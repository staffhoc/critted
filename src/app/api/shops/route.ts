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
    const sortBy = searchParams.get("sortBy") || "sales";
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

    // Build order by
    let orderBy: Record<string, string> = {};
    switch (sortBy) {
      case "sales":
        orderBy = { totalSales: "desc" };
        break;
      case "products":
        orderBy = { productCount: "desc" };
        break;
      case "rating":
        orderBy = { avgRating: "desc" };
        break;
      case "revenue":
        orderBy = { totalRevenue: "desc" };
        break;
      default:
        orderBy = { totalSales: "desc" };
    }

    const [shops, total] = await Promise.all([
      prisma.shop.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
      }),
      prisma.shop.count({ where }),
    ]);

    // Transform for frontend
    const transformedShops = shops.map((s) => ({
      id: s.id,
      externalId: s.externalId,
      name: s.name,
      description: s.description,
      logoUrl: s.logoUrl,
      locale: s.locale,
      totalProducts: s.productCount,
      totalSales: s.totalSales,
      totalRevenue: s.totalRevenue,
      avgRating: s.avgRating,
      reviewCount: s.reviewCount,
      followerCount: s.followerCount,
      isVerified: s.isVerified,
      shopUrl: `https://www.tiktok.com/shop/${s.externalId}`,
    }));

    return NextResponse.json({
      shops: transformedShops,
      total,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error("Error fetching shops:", error);
    return NextResponse.json(
      { error: "Failed to fetch shops" },
      { status: 500 }
    );
  }
}
