import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Locale } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const locale = searchParams.get("locale") || "all";
    const category = searchParams.get("category") || "all";
    const sortBy = searchParams.get("sortBy") || "velocity";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    if (locale !== "all") {
      where.locale = locale as Locale;
    }

    if (category !== "all") {
      where.category = { name: category };
    }

    // Build order by
    let orderBy: Record<string, string> = {};
    switch (sortBy) {
      case "velocity":
        orderBy = { salesVelocity: "desc" };
        break;
      case "commission":
        orderBy = { commissionRate: "desc" };
        break;
      case "sold":
        orderBy = { totalSales: "desc" };
        break;
      case "growth":
        orderBy = { velocityChange: "desc" };
        break;
      case "rank":
        orderBy = { currentRank: "asc" };
        break;
      default:
        orderBy = { salesVelocity: "desc" };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        include: {
          shop: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Transform for frontend
    const transformedProducts = products.map((p) => ({
      id: p.id,
      externalId: p.externalId,
      title: p.name,
      imageUrl: p.imageUrl,
      price: p.price,
      originalPrice: p.originalPrice,
      currency: p.currency,
      commissionPct: p.commissionRate,
      shopId: p.shop?.id,
      shopName: p.shop?.name || "Unknown Shop",
      shopLogo: p.shop?.logoUrl,
      categoryId: p.category?.id,
      category: p.category?.name || "Uncategorized",
      locale: p.locale,
      sold: p.totalSales,
      soldDelta: Math.round(p.salesVelocity), // Daily sales
      velocity: Math.round(p.salesVelocity),
      growthRate: p.velocityChange,
      rank: p.currentRank,
      rankChange: p.rankChange,
      avgRating: p.avgRating,
      reviewCount: p.reviewCount,
      productUrl: `https://shop.tiktok.com/view/product/${p.externalId}`,
      lastUpdatedAt: p.lastUpdatedAt,
    }));

    return NextResponse.json({
      products: transformedProducts,
      total,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
