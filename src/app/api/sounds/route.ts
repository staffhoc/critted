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
    const filter = searchParams.get("filter") || "all"; // "rising", "viral", "trending", "all"
    const sortBy = searchParams.get("sortBy") || "rank";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { authorName: { contains: search, mode: "insensitive" } },
      ];
    }

    if (locale !== "all") {
      where.locale = locale as Locale;
    }

    if (filter === "rising") {
      where.rankChange = { gt: 0 };
    } else if (filter === "viral") {
      where.isViral = true;
    } else if (filter === "trending") {
      where.isTrending = true;
    }

    // Build order by
    let orderBy: Record<string, string> = {};
    switch (sortBy) {
      case "rank":
        orderBy = { currentRank: "asc" };
        break;
      case "videos":
        orderBy = { videoCount: "desc" };
        break;
      case "velocity":
        orderBy = { videoVelocity: "desc" };
        break;
      case "growth":
        orderBy = { velocityChange: "desc" };
        break;
      default:
        orderBy = { currentRank: "asc" };
    }

    const [sounds, total] = await Promise.all([
      prisma.sound.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
      }),
      prisma.sound.count({ where }),
    ]);

    // Transform for frontend
    const transformedSounds = sounds.map((s) => ({
      id: s.id,
      externalId: s.externalId,
      title: s.title,
      author: s.authorName || "Unknown Artist",
      duration: s.duration,
      coverUrl: s.coverUrl,
      audioUrl: s.audioUrl,
      locale: s.locale,
      videoCount: s.videoCount,
      videoCountDelta: s.dailyVideoCount,
      velocity: Math.round(s.videoVelocity),
      growthRate: s.velocityChange,
      rank: s.currentRank,
      rankDelta: s.rankChange,
      isViral: s.isViral,
      isTrending: s.isTrending,
      soundUrl: `https://www.tiktok.com/music/${s.externalId}`,
      lastUpdatedAt: s.lastUpdatedAt,
    }));

    return NextResponse.json({
      sounds: transformedSounds,
      total,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error("Error fetching sounds:", error);
    return NextResponse.json(
      { error: "Failed to fetch sounds" },
      { status: 500 }
    );
  }
}
