import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        userType: true,
        locale: true,
        createdAt: true,
        notifyEmail: true,
        notifyPush: true,
        notifyWeekly: true,
        notifyBreakout: true,
        notifyMarketing: true,
        theme: true,
        compactView: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      userType,
      locale,
      notifyEmail,
      notifyPush,
      notifyWeekly,
      notifyBreakout,
      notifyMarketing,
      theme,
      compactView,
    } = body;

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name;
    if (userType && ["CREATOR", "SELLER"].includes(userType)) {
      updateData.userType = userType;
    }
    if (locale && ["US", "UK", "ID", "MY", "TH", "VN", "PH", "NG", "KE", "DE", "CA", "UG"].includes(locale)) {
      updateData.locale = locale;
    }
    if (typeof notifyEmail === "boolean") updateData.notifyEmail = notifyEmail;
    if (typeof notifyPush === "boolean") updateData.notifyPush = notifyPush;
    if (typeof notifyWeekly === "boolean") updateData.notifyWeekly = notifyWeekly;
    if (typeof notifyBreakout === "boolean") updateData.notifyBreakout = notifyBreakout;
    if (typeof notifyMarketing === "boolean") updateData.notifyMarketing = notifyMarketing;
    if (theme && ["light", "dark", "system"].includes(theme)) {
      updateData.theme = theme;
    }
    if (typeof compactView === "boolean") updateData.compactView = compactView;

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        userType: true,
        locale: true,
        notifyEmail: true,
        notifyPush: true,
        notifyWeekly: true,
        notifyBreakout: true,
        notifyMarketing: true,
        theme: true,
        compactView: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
