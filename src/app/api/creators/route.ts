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
    const sortBy = searchParams.get("sortBy") || "followers";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { username: { contains: search, mode: "insensitive" } },
        { displayName: { contains: search, mode: "insensitive" } },
      ];
    }

    if (locale !== "all") {
      where.locale = locale as Locale;
    }

    // Build order by
    let orderBy: Record<string, string> = {};
    switch (sortBy) {
      case "followers":
        orderBy = { followerCount: "desc" };
        break;
      case "gmv":
        orderBy = { affiliateSales: "desc" };
        break;
      case "videos":
        orderBy = { videoCount: "desc" };
        break;
      default:
        orderBy = { followerCount: "desc" };
    }

    const [creators, total] = await Promise.all([
      prisma.creator.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
      }),
      prisma.creator.count({ where }),
    ]);

    // Transform for frontend
    const transformedCreators = creators.map((c) => ({
      id: c.id,
      externalId: c.externalId,
      username: c.username,
      displayName: c.displayName || c.username,
      avatarUrl: c.avatarUrl,
      bio: c.bio,
      locale: c.locale,
      followers: c.followerCount,
      following: c.followingCount,
      videoCount: c.videoCount,
      likeCount: c.likeCount,
      isAffiliate: c.isAffiliate,
      affiliateSales: c.affiliateSales,
      isVerified: c.isVerified,
      // Calculate engagement rate (likes / followers * 100)
      engagement: c.followerCount > 0
        ? parseFloat(((c.likeCount / c.followerCount) * 100).toFixed(2))
        : 0,
      // Estimate GMV driven (affiliate sales * average product price estimate)
      gmvDriven: c.affiliateSales * 25, // Rough estimate
      profileUrl: `https://www.tiktok.com/@${c.username}`,
    }));

    return NextResponse.json({
      creators: transformedCreators,
      total,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error("Error fetching creators:", error);
    return NextResponse.json(
      { error: "Failed to fetch creators" },
      { status: 500 }
    );
  }
}
