import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTikHub, localeToRegion, TikHubProduct } from "@/lib/tikhub";
import { Locale } from "@/generated/prisma";

// Vercel Cron: Run daily at 2 AM UTC
// Configure in vercel.json: "crons": [{ "path": "/api/cron/sync-products", "schedule": "0 2 * * *" }]

// Markets to sync (start with US, expand later)
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
          type: "products",
          locale,
          status: "running",
          startedAt: new Date(),
        },
      });

      try {
        console.log(`[Sync Products] Fetching products for region: ${region}`);

        // Fetch trending products from TikHub
        const response = await tikHub.getTopProducts({
          region,
          sort_by: "post", // Order by post volume (most viral)
          limit: 100,
        });

        console.log(`[Sync Products] Got ${response.products?.length || 0} products for ${region}`);
        const products = response.products || [];

        for (let i = 0; i < products.length; i++) {
          const product = products[i];
          const rank = i + 1;

          try {
            await upsertProduct(product, locale, rank);
            processed++;
          } catch (error) {
            console.error(`Failed to process product ${product.product_id}:`, error);
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
        console.error(`Failed to sync products for ${locale}:`, error);

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

        failed = -1; // Mark as failed
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
    console.error("Product sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync products" },
      { status: 500 }
    );
  }
}

async function upsertProduct(
  product: TikHubProduct,
  locale: Locale,
  rank: number
) {
  const externalId = product.product_id;

  // Find existing product
  const existing = await prisma.product.findUnique({
    where: { externalId },
  });

  // Calculate velocity (sales per day) based on previous data
  let salesVelocity = 0;
  let velocityChange = 0;

  if (existing) {
    // Get last snapshot to calculate velocity
    const lastSnapshot = await prisma.productSnapshot.findFirst({
      where: { productId: existing.id },
      orderBy: { snapshotDate: "desc" },
    });

    if (lastSnapshot) {
      const daysSinceSnapshot = Math.max(
        1,
        (Date.now() - lastSnapshot.snapshotDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const salesDiff = product.sold_count - lastSnapshot.totalSales;
      salesVelocity = salesDiff / daysSinceSnapshot;

      // Calculate velocity change percentage
      if (lastSnapshot.salesVelocity > 0) {
        velocityChange = ((salesVelocity - lastSnapshot.salesVelocity) / lastSnapshot.salesVelocity) * 100;
      }
    }
  }

  // Upsert shop if provided
  let shopId: string | undefined;
  if (product.shop_id) {
    const shop = await prisma.shop.upsert({
      where: { externalId: product.shop_id },
      create: {
        externalId: product.shop_id,
        locale,
        name: product.shop_name || "Unknown Shop",
      },
      update: {
        name: product.shop_name || undefined,
      },
    });
    shopId = shop.id;
  }

  // Calculate rank change
  const previousRank = existing?.currentRank ?? null;
  const rankChange = previousRank ? previousRank - rank : 0;

  // Upsert product
  const upsertedProduct = await prisma.product.upsert({
    where: { externalId },
    create: {
      externalId,
      locale,
      name: product.title,
      description: product.description,
      imageUrl: product.cover_image,
      price: product.price,
      originalPrice: product.original_price,
      currency: product.currency || "USD",
      commissionRate: product.commission_rate || 0,
      shopId,
      totalSales: product.sold_count,
      totalRevenue: product.price * product.sold_count,
      totalVideos: product.video_count || 0,
      avgRating: product.rating,
      reviewCount: product.review_count || 0,
      currentRank: rank,
      previousRank,
      rankChange,
      salesVelocity,
      velocityChange,
      lastUpdatedAt: new Date(),
    },
    update: {
      name: product.title,
      description: product.description,
      imageUrl: product.cover_image,
      price: product.price,
      originalPrice: product.original_price,
      commissionRate: product.commission_rate ?? undefined,
      shopId,
      totalSales: product.sold_count,
      totalRevenue: product.price * product.sold_count,
      totalVideos: product.video_count || 0,
      avgRating: product.rating,
      reviewCount: product.review_count || 0,
      previousRank: existing?.currentRank,
      currentRank: rank,
      rankChange,
      salesVelocity,
      velocityChange,
      lastUpdatedAt: new Date(),
    },
  });

  // Create daily snapshot
  await prisma.productSnapshot.create({
    data: {
      productId: upsertedProduct.id,
      price: product.price,
      totalSales: product.sold_count,
      totalRevenue: product.price * product.sold_count,
      rank,
      salesVelocity,
    },
  });

  return upsertedProduct;
}
