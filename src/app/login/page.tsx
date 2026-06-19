"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { TrendingUp, Loader2 } from "lucide-react";
import { AuthForm } from "@/components/auth-form";

function LoginContent() {
  const searchParams = useSearchParams();
  const isSignUp = searchParams.get("signup") === "true";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 font-bold text-2xl mb-8">
        <div className="h-10 w-10 rounded-lg bg-black flex items-center justify-center">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <span className="text-foreground">Critted</span>
      </Link>

      <AuthForm mode={isSignUp ? "signup" : "login"} />

      <p className="text-sm text-muted-foreground mt-6">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/login?signup=true" className="text-primary hover:underline font-medium">
              Sign up for free
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
