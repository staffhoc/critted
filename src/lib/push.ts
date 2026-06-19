import webpush from "web-push";
import { prisma } from "@/lib/db";

// Initialize web-push with VAPID keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:notifications@critted.com";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
  data?: Record<string, unknown>;
}

// Send push notification to a single subscription
export async function sendPushNotification(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: PushNotificationPayload
) {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.warn("VAPID keys not configured, skipping push notification");
    return { success: false, error: "Push notifications not configured" };
  }

  const pushSubscription = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.p256dh,
      auth: subscription.auth,
    },
  };

  try {
    await webpush.sendNotification(
      pushSubscription,
      JSON.stringify(payload)
    );
    return { success: true };
  } catch (error: unknown) {
    const webPushError = error as { statusCode?: number };
    console.error("Push notification error:", error);

    // If subscription is invalid/expired, remove it
    if (webPushError.statusCode === 410 || webPushError.statusCode === 404) {
      await prisma.pushSubscription.delete({
        where: { endpoint: subscription.endpoint },
      }).catch(() => {});
    }

    return { success: false, error: "Failed to send push notification" };
  }
}

// Send push notification to a user (all their subscriptions)
export async function sendPushToUser(
  userId: string,
  payload: PushNotificationPayload
) {
  // Check if user has push notifications enabled
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { notifyPush: true },
  });

  if (!user?.notifyPush) {
    return { success: false, error: "User has push notifications disabled" };
  }

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  if (subscriptions.length === 0) {
    return { success: false, error: "No push subscriptions found" };
  }

  const results = await Promise.all(
    subscriptions.map((sub) =>
      sendPushNotification(
        { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
        payload
      )
    )
  );

  const successCount = results.filter((r) => r.success).length;
  return {
    success: successCount > 0,
    sent: successCount,
    total: subscriptions.length,
  };
}

// Send push notification to multiple users
export async function sendPushToUsers(
  userIds: string[],
  payload: PushNotificationPayload
) {
  const results = await Promise.all(
    userIds.map((userId) => sendPushToUser(userId, payload))
  );

  const successCount = results.filter((r) => r.success).length;
  return {
    success: successCount > 0,
    sent: successCount,
    total: userIds.length,
  };
}

// Send breakout alert to users who have it enabled
export async function sendBreakoutAlert(
  item: { type: "product" | "sound"; name: string; change: number; url: string }
) {
  // Get all users with breakout alerts enabled
  const users = await prisma.user.findMany({
    where: {
      notifyBreakout: true,
      notifyPush: true,
    },
    include: {
      pushSubscriptions: true,
    },
  });

  const payload: PushNotificationPayload = {
    title: `🔥 Breakout Alert: ${item.name}`,
    body: `This ${item.type} is trending with +${item.change}% velocity!`,
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    url: item.url,
    tag: `breakout-${item.type}-${Date.now()}`,
    data: { type: "breakout", itemType: item.type, url: item.url },
  };

  let sent = 0;
  for (const user of users) {
    for (const sub of user.pushSubscriptions) {
      const result = await sendPushNotification(
        { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
        payload
      );
      if (result.success) sent++;
    }
  }

  return { success: sent > 0, sent };
}
