import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Store pending signup data before magic link verification
export async function POST(request: Request) {
  try {
    const { email, name, agreedToTerms } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!agreedToTerms) {
      return NextResponse.json(
        { error: "You must agree to Terms and Privacy Policy" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    // Store or update pending signup data
    await prisma.pendingSignup.upsert({
      where: { email: email.toLowerCase() },
      update: {
        name,
        agreedToTerms: true,
        agreedAt: new Date(),
      },
      create: {
        email: email.toLowerCase(),
        name,
        agreedToTerms: true,
        agreedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error storing pending signup:", error);
    return NextResponse.json(
      { error: "Failed to process signup" },
      { status: 500 }
    );
  }
}
