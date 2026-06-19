"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

interface AuthFormProps {
  mode: "login" | "signup";
  showCard?: boolean;
}

export function AuthForm({ mode, showCard = true }: AuthFormProps) {
  const isSignUp = mode === "signup";

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = () => {
    setLoadingProvider("google");
    signIn("google", { callbackUrl: isSignUp ? "/onboarding" : "/dashboard" });
  };

  const handleTikTokLogin = () => {
    setLoadingProvider("tiktok");
    // TikTok OAuth not yet implemented - simulate for now
    setTimeout(() => {
      setLoadingProvider(null);
      alert("TikTok login coming soon!");
    }, 500);
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) return;
    if (isSignUp && !name) return;
    if (isSignUp && !agreedToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      return;
    }

    setLoadingProvider("magic");

    try {
      if (isSignUp) {
        // For signup: Check if user already exists
        const checkRes = await fetch("/api/auth/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const checkData = await checkRes.json();

        if (checkData.exists) {
          setError("An account with this email already exists. Please sign in instead.");
          setLoadingProvider(null);
          return;
        }

        // Store pending signup data (name + terms agreement)
        const pendingRes = await fetch("/api/auth/pending-signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name, agreedToTerms }),
        });

        if (!pendingRes.ok) {
          const pendingData = await pendingRes.json();
          setError(pendingData.error || "Failed to process signup");
          setLoadingProvider(null);
          return;
        }
      } else {
        // For login: Check if user exists
        const checkRes = await fetch("/api/auth/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const checkData = await checkRes.json();

        if (!checkData.exists) {
          setError("No account found with this email. Please sign up first.");
          setLoadingProvider(null);
          return;
        }
      }

      // Send magic link
      const result = await signIn("resend", {
        email,
        redirect: false,
        callbackUrl: isSignUp ? "/onboarding" : "/dashboard",
      });

      if (result?.error) {
        console.error("Magic link error:", result.error);
        setError("Failed to send magic link. Please try again.");
        setLoadingProvider(null);
        return;
      }

      setMagicLinkSent(true);
    } catch (err) {
      console.error("Magic link error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoadingProvider(null);
    }
  };

  const formContent = (
    <div className="space-y-6">
      {/* Social Login Buttons */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full h-12 text-base"
          onClick={handleGoogleLogin}
          disabled={loadingProvider !== null}
        >
          {loadingProvider === "google" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </>
          )}
        </Button>

        <Button
          variant="outline"
          className="w-full h-12 text-base"
          onClick={handleTikTokLogin}
          disabled={loadingProvider !== null}
        >
          {loadingProvider === "tiktok" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
              Continue with TikTok
            </>
          )}
        </Button>
      </div>

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
          OR
        </span>
      </div>

      {/* Magic Link Form */}
      {magicLinkSent ? (
        <div className="text-center py-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Check your email</h3>
          <p className="text-sm text-muted-foreground mb-4">
            We sent a magic link to <strong>{email}</strong>
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMagicLinkSent(false)}
          >
            Use a different email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleMagicLink} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12"
            />
          </div>

          {isSignUp && (
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-tight cursor-pointer"
              >
                I agree to the{" "}
                <Link href="/terms" className="underline hover:text-foreground">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline hover:text-foreground">
                  Privacy Policy
                </Link>
              </label>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full h-12"
            disabled={loadingProvider !== null || !email || (isSignUp && (!name || !agreedToTerms))}
          >
            {loadingProvider === "magic" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Mail className="h-5 w-5 mr-2" />
                {isSignUp ? "Create Account" : "Send Magic Link"}
              </>
            )}
          </Button>
        </form>
      )}

      {!isSignUp && (
        <p className="text-xs text-center text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      )}
    </div>
  );

  if (!showCard) {
    return formContent;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          {isSignUp ? "Create your account" : "Welcome back"}
        </CardTitle>
        <CardDescription>
          {isSignUp
            ? "Start your free trial. No credit card required."
            : "Sign in to access your TikTok trend intelligence"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  );
}
