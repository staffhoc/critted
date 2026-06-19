import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ItemType } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const itemType = searchParams.get("itemType") || "all"; // "PRODUCT", "SOUND", or "all"
    const minConfidence = parseInt(searchParams.get("minConfidence") || "50");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const where: Record<string, unknown> = {
      confidenceScore: { gte: minConfidence },
      predictedPeakDate: { gte: new Date() }, // Only future predictions
    };

    if (itemType !== "all") {
      where.itemType = itemType as ItemType;
    }

    const [predictions, total] = await Promise.all([
      prisma.prediction.findMany({
        where,
        orderBy: { confidenceScore: "desc" },
        take: limit,
        skip: offset,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              price: true,
              salesVelocity: true,
            },
          },
          sound: {
            select: {
              id: true,
              title: true,
              coverUrl: true,
              videoVelocity: true,
            },
          },
        },
      }),
      prisma.prediction.count({ where }),
    ]);

    // Transform for frontend
    const transformedPredictions = predictions.map((p) => ({
      id: p.id,
      itemType: p.itemType,
      itemId: p.product?.id || p.sound?.id,
      itemName: p.product?.name || p.sound?.title || "Unknown",
      itemImage: p.product?.imageUrl || p.sound?.coverUrl,
      confidenceScore: Math.round(p.confidenceScore),
      predictedPeakDate: p.predictedPeakDate.toISOString(),
      predictedPeakValue: p.predictedPeakValue,
      currentValue: p.currentValue,
      accelerationScore: Math.round(p.accelerationScore),
      signals: p.signals,
      // Calculate potential growth
      potentialGrowth: p.currentValue > 0
        ? ((p.predictedPeakValue - p.currentValue) / p.currentValue) * 100
        : 0,
      // Days until peak
      daysUntilPeak: Math.ceil(
        (p.predictedPeakDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      ),
    }));

    return NextResponse.json({
      predictions: transformedPredictions,
      total,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return NextResponse.json(
      { error: "Failed to fetch predictions" },
      { status: 500 }
    );
  }
}
