import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// Plan limits by tier
const PLAN_LIMITS = {
  FREE: {
    dailyProductViews: 5,
    dailySoundViews: 5,
    watchlistItems: 3,
    alerts: 1,
  },
  BASIC: {
    dailyProductViews: 50,
    dailySoundViews: 50,
    watchlistItems: 25,
    alerts: 10,
  },
  PRO: {
    dailyProductViews: -1, // unlimited
    dailySoundViews: -1,
    watchlistItems: -1,
    alerts: -1,
  },
  ENTERPRISE: {
    dailyProductViews: -1,
    dailySoundViews: -1,
    watchlistItems: -1,
    alerts: -1,
  },
};

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const tier = (user.subscription?.tier || "FREE") as keyof typeof PLAN_LIMITS;
    const limits = PLAN_LIMITS[tier];

    // Get today's date at midnight UTC for usage tracking
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Get or create today's usage record
    let dailyUsage = await prisma.dailyUsage.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
    });

    if (!dailyUsage) {
      dailyUsage = await prisma.dailyUsage.create({
        data: {
          userId: user.id,
          date: today,
          productViews: 0,
          soundViews: 0,
          searchCount: 0,
          exportCount: 0,
        },
      });
    }

    // Get stats in parallel
    const [
      topProducts,
      topSounds,
      watchlistItems,
      predictions,
      currentStats,
      previousStats,
    ] = await Promise.all([
      // Top products by velocity
      prisma.product.findMany({
        orderBy: { salesVelocity: "desc" },
        take: 4,
        include: {
          shop: { select: { name: true } },
          category: { select: { name: true } },
        },
      }),

      // Top sounds by rank (only those with a rank)
      prisma.sound.findMany({
        where: { currentRank: { not: null } },
        orderBy: { currentRank: "asc" },
        take: 4,
      }),

      // User's watchlist
      prisma.watchlistItem.findMany({
        where: { userId: user.id },
        take: 5,
        include: {
          product: { select: { id: true, name: true, imageUrl: true } },
          sound: { select: { id: true, title: true, coverUrl: true } },
          shop: { select: { id: true, name: true, logoUrl: true } },
        },
      }),

      // Predictions with high confidence (future peaks only)
      prisma.prediction.findMany({
        where: {
          confidenceScore: { gte: 70 },
          predictedPeakDate: { gte: new Date() },
        },
        orderBy: { confidenceScore: "desc" },
        take: 2,
        include: {
          product: { select: { id: true, name: true, imageUrl: true } },
          sound: { select: { id: true, title: true, coverUrl: true } },
        },
      }),

      // Current aggregate stats
      Promise.all([
        prisma.product.aggregate({ _max: { salesVelocity: true } }),
        prisma.sound.count({ where: { isTrending: true } }),
        prisma.product.aggregate({ _avg: { commissionRate: true } }),
        prisma.watchlistItem.count({ where: { userId: user.id } }),
      ]),

      // Previous day stats for comparison
      Promise.all([
        // Previous top velocity from snapshots
        prisma.productSnapshot.findFirst({
          where: {
            snapshotDate: {
              gte: new Date(Date.now() - 48 * 60 * 60 * 1000),
              lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
          orderBy: { salesVelocity: "desc" },
        }),
        // Yesterday's trending sounds count
        prisma.sound.count({
          where: {
            isTrending: true,
            lastUpdatedAt: {
              gte: new Date(Date.now() - 48 * 60 * 60 * 1000),
              lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
        }),
      ]),
    ]);

    const [topVelocity, trendingSoundsCount, avgCommission, watchlistCount] = currentStats;
    const [previousTopProduct, previousTrendingCount] = previousStats;

    // Calculate velocity change
    const currentTopVelocity = topVelocity._max.salesVelocity || 0;
    const previousVelocity = previousTopProduct?.salesVelocity || currentTopVelocity;
    const velocityChange = previousVelocity > 0
      ? ((currentTopVelocity - previousVelocity) / previousVelocity * 100)
      : 0;

    // Calculate trending sounds change
    const trendingSoundsChange = trendingSoundsCount - previousTrendingCount;

    // Current avg commission
    const currentAvgCommission = avgCommission._avg.commissionRate || 0;

    // Transform products
    const transformedProducts = topProducts.map((p) => ({
      id: p.id,
      title: p.name,
      imageUrl: p.imageUrl,
      price: p.price,
      commissionPct: p.commissionRate,
      shopName: p.shop?.name || "Unknown Shop",
      category: p.category?.name || "Uncategorized",
      soldDelta: Math.round(p.salesVelocity),
      velocity: Math.round(p.salesVelocity),
    }));

    // Transform sounds
    const transformedSounds = topSounds.map((s) => ({
      id: s.id,
      title: s.title,
      author: s.authorName || "Unknown Artist",
      coverUrl: s.coverUrl,
      videoCount: s.videoCount,
      rankDelta: s.rankChange,
      rank: s.currentRank,
    }));

    // Transform watchlist
    const transformedWatchlist = watchlistItems.map((w) => ({
      id: w.id,
      itemType: w.itemType,
      itemId: w.product?.id || w.sound?.id || w.shop?.id,
      itemName: w.product?.name || w.sound?.title || w.shop?.name || "Unknown",
      itemImage: w.product?.imageUrl || w.sound?.coverUrl || w.shop?.logoUrl,
    }));

    // Transform predictions
    const transformedPredictions = predictions.map((p) => ({
      id: p.id,
      itemType: p.itemType,
      itemName: p.product?.name || p.sound?.title || "Unknown",
      itemImage: p.product?.imageUrl || p.sound?.coverUrl,
      confidenceScore: Math.round(p.confidenceScore),
      predictedPeakDate: p.predictedPeakDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));

    return NextResponse.json({
      stats: {
        topVelocity: {
          value: Math.round(currentTopVelocity),
          change: `${velocityChange >= 0 ? "+" : ""}${velocityChange.toFixed(1)}%`,
          positive: velocityChange >= 0,
        },
        trendingSounds: {
          value: trendingSoundsCount,
          change: `${trendingSoundsChange >= 0 ? "+" : ""}${trendingSoundsChange} today`,
          positive: trendingSoundsChange >= 0,
        },
        avgCommission: {
          value: currentAvgCommission.toFixed(1),
          change: "avg rate",
          positive: true,
        },
        watchlistCount: {
          value: watchlistCount,
          change: "items",
          positive: true,
        },
      },
      usage: {
        productViews: {
          used: dailyUsage.productViews,
          limit: limits.dailyProductViews,
          unlimited: limits.dailyProductViews === -1,
        },
        soundViews: {
          used: dailyUsage.soundViews,
          limit: limits.dailySoundViews,
          unlimited: limits.dailySoundViews === -1,
        },
        watchlist: {
          used: watchlistCount,
          limit: limits.watchlistItems,
          unlimited: limits.watchlistItems === -1,
        },
      },
      topProducts: transformedProducts,
      topSounds: transformedSounds,
      watchlist: transformedWatchlist,
      predictions: transformedPredictions,
      user: {
        name: user.name,
        email: user.email,
        tier: user.subscription?.tier || "FREE",
        cancelAtPeriodEnd: user.subscription?.cancelAtPeriodEnd || false,
        currentPeriodEnd: user.subscription?.currentPeriodEnd?.toISOString() || null,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
