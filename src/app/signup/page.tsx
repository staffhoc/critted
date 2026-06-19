"use client";

import Link from "next/link";
import { TrendingUp, Check } from "lucide-react";
import { AuthForm } from "@/components/auth-form";

const benefits = [
  "Discover high-commission products",
  "Track trending sounds in real-time",
  "AI-powered viral predictions",
  "Custom alerts for breakout opportunities",
];

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white p-12 flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-black" />
            </div>
            <span>Critted</span>
          </Link>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Start Finding Viral Products Today
            </h1>
            <p className="text-gray-400 text-lg">
              Join thousands of TikTok creators and sellers who use Critted to stay ahead of the competition.
            </p>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-[#fe2c55] flex items-center justify-center shrink-0">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-500">
          &copy; 2026 Critted. All rights reserved.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-muted/30">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl">
              <div className="h-10 w-10 rounded-lg bg-black flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-foreground">Critted</span>
            </Link>
          </div>

          <AuthForm mode="signup" />

          <p className="text-sm text-muted-foreground mt-6 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
