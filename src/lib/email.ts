import { Resend } from "resend";

const FROM_EMAIL = "Critted <notifications@critted.com>";

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export type EmailTemplate =
  | "magic-link"
  | "welcome"
  | "weekly-digest"
  | "breakout-alert"
  | "marketing";

// Magic link sign-in email
export async function sendMagicLinkEmail(to: string, url: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://critted.com";

  return sendEmail({
    to,
    subject: "Sign in to Critted",
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
    <p style="color: #666; margin: 5px 0;">TikTok Shop Intelligence</p>
  </div>

  <h2 style="color: #000; text-align: center;">Sign in to your account</h2>

  <p style="text-align: center;">Click the button below to sign in to Critted. This link will expire in 24 hours.</p>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${url}" style="background: #fe2c55; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">Sign in to Critted</a>
  </div>

  <p style="text-align: center; color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
  <p style="text-align: center; word-break: break-all; color: #666; font-size: 12px; background: #f5f5f5; padding: 12px; border-radius: 4px;">${url}</p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

  <p style="color: #999; font-size: 12px; text-align: center;">
    If you didn't request this email, you can safely ignore it.<br>
    <a href="${appUrl}" style="color: #999;">Critted</a> - TikTok Shop Trend Intelligence
  </p>
</body>
</html>
    `,
    text: `Sign in to Critted\n\nClick this link to sign in: ${url}\n\nThis link will expire in 24 hours.\n\nIf you didn't request this email, you can safely ignore it.`,
  });
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  const resend = getResend();

  if (!resend) {
    console.warn("RESEND_API_KEY not configured, skipping email");
    return { success: false, error: "Email not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: "Failed to send email" };
  }
}

// Sign-in notification email for existing users
export async function sendSignInNotificationEmail(to: string, name: string | null) {
  const displayName = name || "there";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://critted.com";
  const signInTime = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return sendEmail({
    to,
    subject: "New sign-in to your Critted account",
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
    <p style="color: #666; margin: 5px 0;">TikTok Shop Intelligence</p>
  </div>

  <h2 style="color: #000;">Hey ${displayName}!</h2>

  <p>We noticed a new sign-in to your Critted account.</p>

  <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0;"><strong>Time:</strong> ${signInTime}</p>
  </div>

  <p>If this was you, no action is needed. You can safely ignore this email.</p>

  <p style="color: #666;">If you didn't sign in, please secure your account immediately by changing your password or contacting support.</p>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${appUrl}/dashboard" style="background: #fe2c55; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Go to Dashboard</a>
  </div>

  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

  <p style="color: #999; font-size: 12px; text-align: center;">
    Critted - TikTok Shop Trend Intelligence<br>
    <a href="${appUrl}/settings" style="color: #999;">Manage email preferences</a>
  </p>
</body>
</html>
    `,
    text: `Hey ${displayName},\n\nWe noticed a new sign-in to your Critted account.\n\nTime: ${signInTime}\n\nIf this was you, no action is needed. If you didn't sign in, please secure your account immediately.\n\nGo to dashboard: ${appUrl}/dashboard`,
  });
}

// Welcome email when user signs up
export async function sendWelcomeEmail(to: string, name: string | null) {
  const displayName = name || "there";

  return sendEmail({
    to,
    subject: "Welcome to Critted! 🚀",
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
    <p style="color: #666; margin: 5px 0;">TikTok Shop Intelligence</p>
  </div>

  <h2 style="color: #000;">Welcome, ${displayName}!</h2>

  <p>Thanks for joining Critted. You now have access to powerful TikTok Shop trend intelligence.</p>

  <p><strong>Here's what you can do:</strong></p>
  <ul>
    <li>Discover trending products before they go viral</li>
    <li>Find high-commission affiliate opportunities</li>
    <li>Track trending sounds for your content</li>
    <li>Get AI-powered predictions</li>
  </ul>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://critted.com"}/dashboard" style="background: #fe2c55; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Go to Dashboard</a>
  </div>

  <p style="color: #666; font-size: 14px;">If you have any questions, just reply to this email.</p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

  <p style="color: #999; font-size: 12px; text-align: center;">
    Critted - TikTok Shop Trend Intelligence<br>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://critted.com"}/settings" style="color: #999;">Manage email preferences</a>
  </p>
</body>
</html>
    `,
    text: `Welcome to Critted, ${displayName}!\n\nThanks for joining. You now have access to powerful TikTok Shop trend intelligence.\n\nGo to your dashboard: ${process.env.NEXT_PUBLIC_APP_URL || "https://critted.com"}/dashboard`,
  });
}

// Weekly digest email
export async function sendWeeklyDigestEmail(
  to: string,
  name: string | null,
  data: {
    topProducts: Array<{ name: string; rank: number; change: number }>;
    topSounds: Array<{ title: string; videoCount: number }>;
    newPredictions: number;
  }
) {
  const displayName = name || "there";

  const productsList = data.topProducts
    .map(
      (p, i) =>
        `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${i + 1}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${p.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; color: ${p.change > 0 ? "#22c55e" : "#ef4444"};">${p.change > 0 ? "+" : ""}${p.change}%</td>
    </tr>`
    )
    .join("");

  const soundsList = data.topSounds
    .map(
      (s) =>
        `<li style="margin: 8px 0;">${s.title} - ${s.videoCount.toLocaleString()} videos</li>`
    )
    .join("");

  return sendEmail({
    to,
    subject: "Your Weekly TikTok Shop Trends Digest",
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
    <p style="color: #666; margin: 5px 0;">Weekly Digest</p>
  </div>

  <h2 style="color: #000;">Hey ${displayName}, here's your weekly roundup!</h2>

  <h3 style="color: #fe2c55; margin-top: 30px;">Top Trending Products</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr style="background: #f9fafb;">
        <th style="padding: 8px; text-align: left;">#</th>
        <th style="padding: 8px; text-align: left;">Product</th>
        <th style="padding: 8px; text-align: left;">Change</th>
      </tr>
    </thead>
    <tbody>
      ${productsList}
    </tbody>
  </table>

  <h3 style="color: #fe2c55; margin-top: 30px;">Hot Sounds This Week</h3>
  <ul style="padding-left: 20px;">
    ${soundsList}
  </ul>

  ${data.newPredictions > 0 ? `<p style="background: #fef3c7; padding: 12px; border-radius: 6px; margin-top: 20px;"><strong>${data.newPredictions} new AI predictions</strong> are ready for you!</p>` : ""}

  <div style="text-align: center; margin: 30px 0;">
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://critted.com"}/dashboard" style="background: #fe2c55; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">View Full Report</a>
  </div>

  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

  <p style="color: #999; font-size: 12px; text-align: center;">
    Critted - TikTok Shop Trend Intelligence<br>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://critted.com"}/settings" style="color: #999;">Manage email preferences</a> | <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://critted.com"}/settings" style="color: #999;">Unsubscribe</a>
  </p>
</body>
</html>
    `,
  });
}

// Breakout alert email
export async function sendBreakoutAlertEmail(
  to: string,
  name: string | null,
  item: {
    type: "product" | "sound";
    name: string;
    change: number;
    url: string;
  }
) {
  const displayName = name || "there";
  const itemType = item.type === "product" ? "Product" : "Sound";

  return sendEmail({
    to,
    subject: `🔥 Breakout Alert: ${item.name} is trending!`,
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
    <p style="color: #fe2c55; margin: 5px 0; font-weight: 600;">BREAKOUT ALERT</p>
  </div>

  <h2 style="color: #000;">Hey ${displayName}!</h2>

  <div style="background: linear-gradient(135deg, #fe2c55 0%, #ff6b6b 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
    <p style="margin: 0; font-size: 14px; opacity: 0.9;">${itemType} Alert</p>
    <h3 style="margin: 10px 0; font-size: 24px;">${item.name}</h3>
    <p style="margin: 0; font-size: 32px; font-weight: bold;">+${item.change}%</p>
    <p style="margin: 5px 0 0; opacity: 0.9;">velocity increase</p>
  </div>

  <p>This ${item.type} is showing strong breakout signals and could be the next viral trend. Act fast to capitalize on early momentum!</p>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${item.url}" style="background: #fe2c55; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">View Details</a>
  </div>

  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

  <p style="color: #999; font-size: 12px; text-align: center;">
    Critted - TikTok Shop Trend Intelligence<br>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://critted.com"}/settings" style="color: #999;">Manage alert preferences</a>
  </p>
</body>
</html>
    `,
    text: `Breakout Alert!\n\n${item.name} is trending with +${item.change}% velocity increase.\n\nView details: ${item.url}`,
  });
}

// Marketing email
export async function sendMarketingEmail(
  to: string,
  name: string | null,
  content: {
    subject: string;
    preheader: string;
    headline: string;
    body: string;
    ctaText: string;
    ctaUrl: string;
  }
) {
  const displayName = name || "there";

  return sendEmail({
    to,
    subject: content.subject,
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
  </div>

  <h2 style="color: #000;">${content.headline}</h2>

  <p>Hey ${displayName},</p>

  ${content.body}

  <div style="text-align: center; margin: 30px 0;">
    <a href="${content.ctaUrl}" style="background: #fe2c55; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">${content.ctaText}</a>
  </div>

  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

  <p style="color: #999; font-size: 12px; text-align: center;">
    Critted - TikTok Shop Trend Intelligence<br>
    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://critted.com"}/settings" style="color: #999;">Unsubscribe from marketing emails</a>
  </p>
</body>
</html>
    `,
  });
}
