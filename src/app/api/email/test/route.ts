import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { sendWelcomeEmail, sendBreakoutAlertEmail } from "@/lib/email";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { email: true, name: true, notifyEmail: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.notifyEmail) {
      return NextResponse.json(
        { error: "Email notifications are disabled" },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case "welcome":
        result = await sendWelcomeEmail(user.email, user.name);
        break;

      case "breakout":
        result = await sendBreakoutAlertEmail(user.email, user.name, {
          type: "product",
          name: "Viral Beauty Serum",
          change: 245,
          url: `${process.env.NEXT_PUBLIC_APP_URL || "https://critted.com"}/products/test-123`,
        });
        break;

      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json({ success: true, id: result.id });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { error: "Failed to send test email" },
      { status: 500 }
    );
  }
}
