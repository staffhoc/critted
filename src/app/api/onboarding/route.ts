import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { UserType, Locale } from "@/generated/prisma";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userType, locale } = body;

    // Validate userType
    if (!userType || !["CREATOR", "SELLER"].includes(userType)) {
      return NextResponse.json(
        { error: "Invalid userType" },
        { status: 400 }
      );
    }

    // Validate locale
    const validLocales = ["US", "UK", "ID", "MY", "TH", "VN", "PH", "NG", "KE", "DE", "CA", "UG"];
    if (!locale || !validLocales.includes(locale)) {
      return NextResponse.json(
        { error: "Invalid locale" },
        { status: 400 }
      );
    }

    // Update user preferences
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        userType: userType as UserType,
        locale: locale as Locale,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to save preferences" },
      { status: 500 }
    );
  }
}
