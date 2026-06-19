import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { sendPushToUser } from "@/lib/push";

// Vercel Cron: Run every 6 hours
// Configure in vercel.json: "crons": [{ "path": "/api/cron/watchlist-alerts", "schedule": "0 */6 * * *" }]

const RANK_CHANGE_THRESHOLD = 10; // Alert if rank changes by 10 or more
const PRICE_CHANGE_THRESHOLD = 5; // Alert if price changes by 5% or more

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://critted.com";
    let alertsSent = 0;

    // Get all watchlist items with their users
    const watchlistItems = await prisma.watchlistItem.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            notifyEmail: true,
            notifyPush: true,
          },
        },
        product: true,
        sound: true,
        shop: true,
      },
    });

    for (const item of watchlistItems) {
      const user = item.user;
      let alertTitle = "";
      let alertMessage = "";
      let alertUrl = "";
      let shouldAlert = false;

      // Check product changes
      if (item.product) {
        const product = item.product;

        // Check rank change
        if (Math.abs(product.rankChange) >= RANK_CHANGE_THRESHOLD) {
          shouldAlert = true;
          alertTitle = `Rank Change: ${product.name}`;
          alertMessage = product.rankChange > 0
            ? `Dropped ${Math.abs(product.rankChange)} positions (now #${product.currentRank})`
            : `Climbed ${Math.abs(product.rankChange)} positions (now #${product.currentRank})`;
          alertUrl = `${appUrl}/products/${product.id}`;
        }

        // Check velocity spike
        if (product.velocityChange >= 25) {
          shouldAlert = true;
          alertTitle = `Velocity Spike: ${product.name}`;
          alertMessage = `Sales velocity increased by ${Math.round(product.velocityChange)}%`;
          alertUrl = `${appUrl}/products/${product.id}`;
        }
      }

      // Check sound changes
      if (item.sound) {
        const sound = item.sound;

        // Check rank change
        if (Math.abs(sound.rankChange) >= RANK_CHANGE_THRESHOLD) {
          shouldAlert = true;
          alertTitle = `Rank Change: ${sound.title}`;
          alertMessage = sound.rankChange > 0
            ? `Dropped ${Math.abs(sound.rankChange)} positions (now #${sound.currentRank})`
            : `Climbed ${Math.abs(sound.rankChange)} positions (now #${sound.currentRank})`;
          alertUrl = `${appUrl}/sounds/${sound.id}`;
        }

        // Check velocity spike
        if (sound.velocityChange >= 25) {
          shouldAlert = true;
          alertTitle = `Trending Sound: ${sound.title}`;
          alertMessage = `Video velocity increased by ${Math.round(sound.velocityChange)}%`;
          alertUrl = `${appUrl}/sounds/${sound.id}`;
        }

        // Check viral status change
        if (sound.isViral) {
          shouldAlert = true;
          alertTitle = `🔥 Viral Sound: ${sound.title}`;
          alertMessage = "This sound is now trending and going viral!";
          alertUrl = `${appUrl}/sounds/${sound.id}`;
        }
      }

      if (shouldAlert) {
        // Create alert record
        await prisma.alert.create({
          data: {
            userId: user.id,
            type: "RANK_CHANGE",
            title: alertTitle,
            message: alertMessage,
            itemType: item.itemType,
            itemId: item.productId || item.soundId || item.shopId,
            metadata: { url: alertUrl },
          },
        });

        // Send push notification
        if (user.notifyPush) {
          await sendPushToUser(user.id, {
            title: alertTitle,
            body: alertMessage,
            url: alertUrl,
            icon: "/icon-192x192.png",
            tag: `watchlist-${item.id}`,
          });
        }

        // Send email notification
        if (user.notifyEmail) {
          await sendEmail({
            to: user.email,
            subject: alertTitle,
            html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #000; margin: 0;">Critted</h1>
    <p style="color: #666; margin: 5px 0;">Watchlist Alert</p>
  </div>

  <h2 style="color: #000;">${alertTitle}</h2>
  <p>${alertMessage}</p>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${alertUrl}" style="background: #fe2c55; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">View Details</a>
  </div>

  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

  <p style="color: #999; font-size: 12px; text-align: center;">
    Critted - TikTok Shop Trend Intelligence<br>
    <a href="${appUrl}/settings/notifications" style="color: #999;">Manage notification preferences</a>
  </p>
</body>
</html>
            `,
            text: `${alertTitle}\n\n${alertMessage}\n\nView details: ${alertUrl}`,
          });
        }

        alertsSent++;
      }
    }

    return NextResponse.json({
      success: true,
      alertsSent,
      watchlistItemsChecked: watchlistItems.length,
    });
  } catch (error) {
    console.error("Watchlist alerts error:", error);
    return NextResponse.json(
      { error: "Failed to check watchlist alerts" },
      { status: 500 }
    );
  }
}
