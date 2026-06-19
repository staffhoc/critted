import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendWeeklyDigestEmail } from "@/lib/email";

// Vercel Cron: Run every Monday at 8:00 AM UTC
// Configure in vercel.json: "crons": [{ "path": "/api/cron/weekly-digest", "schedule": "0 8 * * 1" }]

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all users with weekly digest enabled
    const users = await prisma.user.findMany({
      where: {
        notifyWeekly: true,
        notifyEmail: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        locale: true,
      },
    });

    if (users.length === 0) {
      return NextResponse.json({ message: "No users to notify", sent: 0 });
    }

    // Get top trending products (last 7 days)
    const topProducts = await prisma.product.findMany({
      orderBy: { salesVelocity: "desc" },
      take: 5,
      select: {
        name: true,
        currentRank: true,
        rankChange: true,
      },
    });

    // Get top trending sounds (last 7 days)
    const topSounds = await prisma.sound.findMany({
      orderBy: { videoVelocity: "desc" },
      take: 5,
      select: {
        title: true,
        videoCount: true,
      },
    });

    // Get new predictions count
    const newPredictions = await prisma.prediction.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const digestData = {
      topProducts: topProducts.map((p, i) => ({
        name: p.name,
        rank: p.currentRank || i + 1,
        change: p.rankChange,
      })),
      topSounds: topSounds.map((s) => ({
        title: s.title,
        videoCount: s.videoCount,
      })),
      newPredictions,
    };

    // Send digest to each user
    let sentCount = 0;
    const errors: string[] = [];

    for (const user of users) {
      try {
        await sendWeeklyDigestEmail(user.email, user.name, digestData);
        sentCount++;
      } catch (error) {
        console.error(`Failed to send digest to ${user.email}:`, error);
        errors.push(user.email);
      }
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      total: users.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Weekly digest error:", error);
    return NextResponse.json(
      { error: "Failed to send weekly digest" },
      { status: 500 }
    );
  }
}
