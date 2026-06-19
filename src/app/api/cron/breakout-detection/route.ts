import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendBreakoutAlertEmail } from "@/lib/email";
import { sendBreakoutAlert } from "@/lib/push";

// Vercel Cron: Run every hour
// Configure in vercel.json: "crons": [{ "path": "/api/cron/breakout-detection", "schedule": "0 * * * *" }]

const VELOCITY_THRESHOLD = 50; // 50% increase triggers breakout alert

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://critted.com";
    const breakouts: Array<{ type: "product" | "sound"; name: string; change: number; url: string }> = [];

    // Detect product breakouts
    const breakoutProducts = await prisma.product.findMany({
      where: {
        velocityChange: { gte: VELOCITY_THRESHOLD },
      },
      orderBy: { velocityChange: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        velocityChange: true,
      },
    });

    for (const product of breakoutProducts) {
      breakouts.push({
        type: "product",
        name: product.name,
        change: Math.round(product.velocityChange),
        url: `${appUrl}/products/${product.id}`,
      });
    }

    // Detect sound breakouts
    const breakoutSounds = await prisma.sound.findMany({
      where: {
        velocityChange: { gte: VELOCITY_THRESHOLD },
      },
      orderBy: { velocityChange: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        velocityChange: true,
      },
    });

    for (const sound of breakoutSounds) {
      breakouts.push({
        type: "sound",
        name: sound.title,
        change: Math.round(sound.velocityChange),
        url: `${appUrl}/sounds/${sound.id}`,
      });
    }

    if (breakouts.length === 0) {
      return NextResponse.json({ message: "No breakouts detected", alerts: 0 });
    }

    // Get users with breakout alerts enabled
    const users = await prisma.user.findMany({
      where: {
        notifyBreakout: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        notifyEmail: true,
        notifyPush: true,
      },
    });

    let emailsSent = 0;
    let pushSent = 0;

    // Send alerts for each breakout
    for (const breakout of breakouts) {
      // Send push notifications
      const pushResult = await sendBreakoutAlert(breakout);
      pushSent += pushResult.sent || 0;

      // Send email notifications
      for (const user of users) {
        if (user.notifyEmail) {
          try {
            await sendBreakoutAlertEmail(user.email, user.name, breakout);
            emailsSent++;
          } catch (error) {
            console.error(`Failed to send breakout email to ${user.email}:`, error);
          }
        }
      }

      // Create alert records in database
      for (const user of users) {
        await prisma.alert.create({
          data: {
            userId: user.id,
            type: "VELOCITY_SPIKE",
            title: `Breakout: ${breakout.name}`,
            message: `${breakout.type === "product" ? "Product" : "Sound"} is trending with +${breakout.change}% velocity increase!`,
            itemType: breakout.type === "product" ? "PRODUCT" : "SOUND",
            itemId: breakout.url.split("/").pop(),
            metadata: { velocityChange: breakout.change, url: breakout.url },
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      breakouts: breakouts.length,
      emailsSent,
      pushSent,
    });
  } catch (error) {
    console.error("Breakout detection error:", error);
    return NextResponse.json(
      { error: "Failed to detect breakouts" },
      { status: 500 }
    );
  }
}
