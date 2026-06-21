import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSociaVault, NormalizedProduct } from "@/lib/sociavault";
import { Locale } from "@/generated/prisma";

// Vercel Cron: Run daily at 2 AM UTC
// Configure in vercel.json: "crons": [{ "path": "/api/cron/sync-products", "schedule": "0 2 * * *" }]

// Markets to sync - SociaVault supports: US, GB, DE, FR, IT, ID, MY, MX, PH, SG, ES, TH, VN, BR, JP, IE
const MARKETS_TO_SYNC: { locale: Locale; region: string }[] = [
  { locale: "US", region: "US" },
];

// Search queries to find trending products across categories
// Using more specific product-related terms that are likely to return results
const TRENDING_QUERIES = [
  "skincare",
  "makeup",
  "phone case",
  "jewelry",
  "clothing",
  "fitness",
  "home decor",
  "kitchen",
];

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
    const sociaVault = getSociaVault();

    for (const { locale, region } of MARKETS_TO_SYNC) {
      let processed = 0;
      let failed = 0;
      const seenProductIds = new Set<string>();

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
        console.log(`[Sync Products] API Key present: ${!!process.env.SOCIAVAULT_API_KEY}`);
        console.log(`[Sync Products] API Key length: ${process.env.SOCIAVAULT_API_KEY?.length || 0}`);

        // Search for products using multiple queries to get a diverse set
        for (const query of TRENDING_QUERIES) {
          try {
            const response = await sociaVault.searchProducts({
              query,
              page: 1,
              region,
            });

            console.log(`[Sync Products] Query "${query}" returned ${response.products.length} products for ${region}`);
            console.log(`[Sync Products] Query "${query}" hasMore: ${response.hasMore}`);

            for (const product of response.products) {
              // Skip duplicates
              if (seenProductIds.has(product.product_id)) {
                continue;
              }
              seenProductIds.add(product.product_id);

              const rank = seenProductIds.size; // Use order as rank

              try {
                await upsertProduct(product, locale, rank);
                processed++;
              } catch (error) {
                console.error(`Failed to process product ${product.product_id}:`, error);
                failed++;
              }
            }
          } catch (queryError) {
            const errorMessage = queryError instanceof Error ? queryError.message : "Unknown error";
            console.error(`Failed to search for "${query}" in ${region}:`, errorMessage);
            console.error(`[Sync Products] Query error stack:`, queryError instanceof Error ? queryError.stack : undefined);
          }
        }

        console.log(`[Sync Products] Total unique products for ${region}: ${seenProductIds.size}`);

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
  product: NormalizedProduct,
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
        logoUrl: product.shop_logo,
      },
      update: {
        name: product.shop_name || undefined,
        logoUrl: product.shop_logo || undefined,
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
      imageUrl: product.image_url,
      price: product.price,
      originalPrice: product.original_price,
      currency: product.currency || "USD",
      commissionRate: 0, // Not available from SociaVault
      shopId,
      totalSales: product.sold_count,
      totalRevenue: product.price * product.sold_count,
      totalVideos: 0, // Not available from search
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
      imageUrl: product.image_url,
      price: product.price,
      originalPrice: product.original_price,
      shopId,
      totalSales: product.sold_count,
      totalRevenue: product.price * product.sold_count,
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
