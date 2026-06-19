"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TrendingUp, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type VerificationState = "loading" | "success" | "error" | "expired";

export default function VerifyEmailTokenPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;
  const [state, setState] = useState<VerificationState>("loading");

  useEffect(() => {
    // Simulate token verification
    const verifyToken = async () => {
      // In real app, this would call the API to verify the token
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate different states based on token content
      if (token === "expired") {
        setState("expired");
      } else if (token === "invalid") {
        setState("error");
      } else if (token.length > 10) {
        setState("success");
      } else {
        setState("error");
      }
    };

    verifyToken();
  }, [token]);

  const handleContinue = () => {
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 font-bold text-2xl mb-8">
        <div className="h-10 w-10 rounded-lg bg-black flex items-center justify-center">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <span className="text-foreground">Critted</span>
      </Link>

      <Card className="w-full max-w-md">
        {state === "loading" && (
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Verifying your email...</h3>
              <p className="text-sm text-muted-foreground">
                Please wait while we confirm your email address.
              </p>
            </div>
          </CardContent>
        )}

        {state === "success" && (
          <>
            <CardHeader className="text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Email Verified!</CardTitle>
              <CardDescription>
                Your email has been successfully verified.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Thank you for verifying your email. You can now access all features of Critted.
              </p>
              <Button className="w-full" onClick={handleContinue}>
                Continue to Critted
              </Button>
            </CardContent>
          </>
        )}

        {state === "expired" && (
          <>
            <CardHeader className="text-center">
              <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl">Link Expired</CardTitle>
              <CardDescription>
                This verification link has expired.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Verification links expire after 24 hours for security reasons. Please request a new verification email.
              </p>
              <Link href="/verify-email">
                <Button className="w-full">Request New Link</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
            </CardContent>
          </>
        )}

        {state === "error" && (
          <>
            <CardHeader className="text-center">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl">Verification Failed</CardTitle>
              <CardDescription>
                We couldn&apos;t verify your email address.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                The verification link is invalid or has already been used. Please try requesting a new verification email.
              </p>
              <Link href="/verify-email">
                <Button className="w-full">Request New Link</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
