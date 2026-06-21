import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Locale } from "@/generated/prisma";

// Vercel Cron: Run daily at 4 AM UTC
// Configure in vercel.json: "crons": [{ "path": "/api/cron/sync-shops", "schedule": "0 4 * * *" }]

// Note: SociaVault doesn't have a dedicated "top shops" endpoint.
// Shops are discovered and created during product sync when products have shop info.
// This job aggregates shop statistics from their products.

const MARKETS_TO_SYNC: Locale[] = ["US"];

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const results: Record<string, { processed: number; failed: number }> = {};

  try {
    for (const locale of MARKETS_TO_SYNC) {
      let processed = 0;
      let failed = 0;

      // Create ingestion job record
      const job = await prisma.dataIngestionJob.create({
        data: {
          type: "shops",
          locale,
          status: "running",
          startedAt: new Date(),
        },
      });

      try {
        console.log(`[Sync Shops] Aggregating shop stats for locale: ${locale}`);

        // Get all shops for this locale that have products
        const shops = await prisma.shop.findMany({
          where: { locale },
          include: {
            _count: {
              select: { products: true },
            },
          },
        });

        console.log(`[Sync Shops] Found ${shops.length} shops for ${locale}`);

        for (const shop of shops) {
          try {
            await updateShopStats(shop.id);
            processed++;
          } catch (error) {
            console.error(`Failed to update shop ${shop.id}:`, error);
            failed++;
          }
        }

        // Update job status
        await prisma.dataIngestionJob.update({
          where: { id: job.id },
          data: {
            status: "completed",
            itemsProcessed: processed,
            itemsFailed: failed,
            completedAt: new Date(),
          },
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`Failed to sync shops for ${locale}:`, error);

        await prisma.dataIngestionJob.update({
          where: { id: job.id },
          data: {
            status: "failed",
            itemsProcessed: processed,
            itemsFailed: failed,
            errorMessage,
            completedAt: new Date(),
          },
        });

        failed = -1;
      }

      results[locale] = { processed, failed };
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      duration: `${duration}ms`,
      results,
    });
  } catch (error) {
    console.error("Shop sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync shops" },
      { status: 500 }
    );
  }
}

async function updateShopStats(shopId: string) {
  // Aggregate stats from the shop's products
  const stats = await prisma.product.aggregate({
    where: { shopId },
    _count: { id: true },
    _sum: {
      totalSales: true,
      totalRevenue: true,
      reviewCount: true,
    },
    _avg: {
      avgRating: true,
    },
  });

  const productCount = stats._count.id || 0;
  const totalSales = stats._sum.totalSales || 0;
  const totalRevenue = stats._sum.totalRevenue || 0;
  const avgRating = stats._avg.avgRating || null;
  const reviewCount = stats._sum.reviewCount || 0;

  // Update shop with aggregated stats
  const updatedShop = await prisma.shop.update({
    where: { id: shopId },
    data: {
      productCount,
      totalSales,
      totalRevenue,
      avgRating,
      reviewCount,
    },
  });

  // Create daily snapshot
  await prisma.shopSnapshot.create({
    data: {
      shopId,
      productCount,
      totalSales,
      totalRevenue,
      followerCount: updatedShop.followerCount || 0,
    },
  });

  return updatedShop;
}
