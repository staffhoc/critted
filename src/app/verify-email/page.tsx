"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { TrendingUp, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [email, setEmail] = useState("");

  // Get email from URL params if available
  const urlEmail = searchParams.get("email");

  const handleResend = async () => {
    const targetEmail = urlEmail || email;
    if (!targetEmail) return;

    setIsResending(true);
    try {
      await signIn("resend", {
        email: targetEmail,
        redirect: false,
      });
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch (error) {
      console.error("Failed to resend:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Check your email</CardTitle>
        <CardDescription>
          {urlEmail ? (
            <>We sent a sign-in link to <strong>{urlEmail}</strong></>
          ) : (
            "We sent you a magic link to sign in"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the link in your email to sign in. The link will expire in 24 hours.
          </p>

          <div className="p-4 rounded-lg bg-muted/50 text-sm">
            <p className="font-medium mb-2">Can&apos;t find the email?</p>
            <ul className="text-muted-foreground space-y-1 text-left list-disc list-inside">
              <li>Check your spam or junk folder</li>
              <li>Make sure the email address is correct</li>
              <li>Wait a few minutes and try again</li>
            </ul>
          </div>

          {resent && (
            <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>Email sent successfully!</span>
            </div>
          )}

          <div className="pt-4 space-y-3">
            {!urlEmail && (
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email to resend"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={handleResend}
              disabled={isResending || resent || (!urlEmail && !email)}
            >
              {isResending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                "Resend magic link"
              )}
            </Button>

            <Link href="/login">
              <Button variant="ghost" className="w-full">
                Back to sign in
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function VerifyEmailLoading() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Check your email</CardTitle>
        <CardDescription>Loading...</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 font-bold text-2xl mb-8">
        <div className="h-10 w-10 rounded-lg bg-black flex items-center justify-center">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <span className="text-foreground">Critted</span>
      </Link>

      <Suspense fallback={<VerifyEmailLoading />}>
        <VerifyEmailContent />
      </Suspense>

      <p className="text-sm text-muted-foreground mt-6">
        Wrong email?{" "}
        <Link href="/signup" className="text-primary hover:underline font-medium">
          Sign up with a different email
        </Link>
      </p>
    </div>
  );
}
