import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTikHub, localeToRegion, TikHubShop } from "@/lib/tikhub";
import { Locale } from "@/generated/prisma";

// Vercel Cron: Run daily at 4 AM UTC
// Configure in vercel.json: "crons": [{ "path": "/api/cron/sync-shops", "schedule": "0 4 * * *" }]

// Markets to sync
const MARKETS_TO_SYNC: Locale[] = ["US", "UK"];

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
    const tikHub = getTikHub();

    for (const locale of MARKETS_TO_SYNC) {
      const region = localeToRegion(locale);
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
        console.log(`[Sync Shops] Fetching shops for region: ${region}`);

        // Fetch top shops from TikHub (derived from top products)
        const response = await tikHub.getTopShops({
          region,
          limit: 50,
        });

        console.log(`[Sync Shops] Got ${response.shops?.length || 0} shops for ${region}`);
        const shops = response.shops || [];

        for (const shop of shops) {
          try {
            await upsertShop(shop, locale);
            processed++;
          } catch (error) {
            console.error(`Failed to process shop ${shop.shop_id}:`, error);
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

async function upsertShop(shop: TikHubShop, locale: Locale) {
  const externalId = shop.shop_id;

  // Find existing shop
  const existing = await prisma.shop.findUnique({
    where: { externalId },
  });

  // Upsert shop
  const upsertedShop = await prisma.shop.upsert({
    where: { externalId },
    create: {
      externalId,
      locale,
      name: shop.shop_name,
      description: shop.description,
      logoUrl: shop.logo_url,
      productCount: shop.product_count,
      totalSales: shop.sold_count,
      totalRevenue: 0, // Will be calculated from products
      avgRating: shop.rating,
      reviewCount: shop.review_count || 0,
      followerCount: shop.follower_count || 0,
      isVerified: shop.is_verified || false,
    },
    update: {
      name: shop.shop_name,
      description: shop.description,
      logoUrl: shop.logo_url,
      productCount: shop.product_count,
      totalSales: shop.sold_count,
      avgRating: shop.rating,
      reviewCount: shop.review_count || 0,
      followerCount: shop.follower_count || 0,
      isVerified: shop.is_verified || false,
    },
  });

  // Create daily snapshot
  await prisma.shopSnapshot.create({
    data: {
      shopId: upsertedShop.id,
      productCount: shop.product_count,
      totalSales: shop.sold_count,
      totalRevenue: 0,
      followerCount: shop.follower_count || 0,
    },
  });

  // Update shop's total revenue from its products
  const productsRevenue = await prisma.product.aggregate({
    where: { shopId: upsertedShop.id },
    _sum: { totalRevenue: true },
  });

  if (productsRevenue._sum.totalRevenue) {
    await prisma.shop.update({
      where: { id: upsertedShop.id },
      data: { totalRevenue: productsRevenue._sum.totalRevenue },
    });
  }

  return upsertedShop;
}
