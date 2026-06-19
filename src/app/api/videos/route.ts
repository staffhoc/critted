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
    const sortBy = searchParams.get("sortBy") || "views";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
      where.description = { contains: search, mode: "insensitive" };
    }

    if (locale !== "all") {
      where.locale = locale as Locale;
    }

    // Build order by
    let orderBy: Record<string, string> = {};
    switch (sortBy) {
      case "views":
        orderBy = { viewCount: "desc" };
        break;
      case "likes":
        orderBy = { likeCount: "desc" };
        break;
      case "engagement":
        orderBy = { engagementRate: "desc" };
        break;
      case "recent":
        orderBy = { publishedAt: "desc" };
        break;
      default:
        orderBy = { viewCount: "desc" };
    }

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              price: true,
              totalSales: true,
            },
          },
          sound: {
            select: {
              id: true,
              title: true,
              coverUrl: true,
            },
          },
        },
      }),
      prisma.video.count({ where }),
    ]);

    // Transform for frontend
    const transformedVideos = videos.map((v) => ({
      id: v.id,
      externalId: v.externalId,
      thumbnailUrl: v.thumbnailUrl,
      videoUrl: v.videoUrl,
      title: v.description?.slice(0, 100) || "Untitled Video",
      description: v.description,
      duration: v.duration,
      locale: v.locale,
      views: v.viewCount,
      likes: v.likeCount,
      comments: v.commentCount,
      shares: v.shareCount,
      engagementRate: v.engagementRate,
      // Estimate conversions based on product sales attributed to this video
      conversions: v.product ? Math.round(v.product.totalSales * 0.05) : 0,
      creator: v.creator
        ? {
            id: v.creator.id,
            username: v.creator.username,
            displayName: v.creator.displayName,
            avatarUrl: v.creator.avatarUrl,
          }
        : null,
      product: v.product
        ? {
            id: v.product.id,
            name: v.product.name,
            imageUrl: v.product.imageUrl,
            price: v.product.price,
          }
        : null,
      sound: v.sound
        ? {
            id: v.sound.id,
            title: v.sound.title,
            coverUrl: v.sound.coverUrl,
          }
        : null,
      publishedAt: v.publishedAt,
      tiktokUrl: `https://www.tiktok.com/video/${v.externalId}`,
    }));

    return NextResponse.json({
      videos: transformedVideos,
      total,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
