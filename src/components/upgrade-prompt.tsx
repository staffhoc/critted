"use client";

import Link from "next/link";
import { ArrowRight, Brain, Crown, Sparkles, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UpgradePromptProps {
  variant?: "free-to-basic" | "basic-to-strategy" | "free-to-strategy";
  className?: string;
}

export function UpgradePrompt({ variant = "free-to-basic", className }: UpgradePromptProps) {
  if (variant === "free-to-basic") {
    return (
      <Card className={`border-2 border-dashed border-primary/50 bg-primary/5 ${className}`}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Crown className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold flex items-center gap-2">
                Unlock Full Access
                <Badge variant="secondary">$22/mo</Badge>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Get unlimited products, all markets, full history, and AI predictions.
              </p>
            </div>
            <Link href="/billing" className="shrink-0">
              <Button>
                Upgrade Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "basic-to-strategy") {
    return (
      <Card className={`border-2 border-dashed border-primary/50 bg-primary/5 ${className}`}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold flex items-center gap-2">
                Add AI Strategy Builder
                <Badge variant="secondary">+$5/mo</Badge>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Get personalized growth strategies, weekly picks, and content calendars.
              </p>
            </div>
            <Link href="/billing" className="shrink-0">
              <Button>
                Upgrade
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // free-to-strategy
  return (
    <Card className={`border-2 border-dashed border-primary/50 bg-primary/5 ${className}`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold flex items-center gap-2">
              Go Pro with Strategy
              <Badge variant="secondary">$27/mo</Badge>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Unlimited access + AI Strategy Builder with personalized growth plans.
            </p>
          </div>
          <Link href="/billing" className="shrink-0">
            <Button>
              Upgrade Now
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Inline usage limit warning
export function UsageLimitWarning({
  used,
  limit,
  feature
}: {
  used: number;
  limit: number;
  feature: string;
}) {
  const percentage = (used / limit) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  if (!isNearLimit) return null;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg text-sm ${
      isAtLimit
        ? "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900"
        : "bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900"
    }`}>
      <Zap className={`h-4 w-4 ${isAtLimit ? "text-red-500" : "text-yellow-600"}`} />
      <span className={isAtLimit ? "text-red-700 dark:text-red-400" : "text-yellow-700 dark:text-yellow-400"}>
        {isAtLimit
          ? `You've reached your daily ${feature} limit (${limit}/${limit}).`
          : `${used}/${limit} ${feature} used today.`
        }
      </span>
      <Link href="/billing" className="ml-auto">
        <Button size="sm" variant={isAtLimit ? "default" : "outline"}>
          Upgrade
        </Button>
      </Link>
    </div>
  );
}

// Feature lock overlay for locked features
export function FeatureLock({
  feature,
  requiredPlan
}: {
  feature: string;
  requiredPlan: "basic" | "strategy";
}) {
  return (
    <div className="absolute inset-0 backdrop-blur-sm bg-background/80 flex flex-col items-center justify-center p-6 text-center rounded-lg z-10">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        {requiredPlan === "strategy" ? (
          <Brain className="h-8 w-8 text-muted-foreground" />
        ) : (
          <Crown className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      <h3 className="font-semibold text-lg mb-2">{feature}</h3>
      <p className="text-muted-foreground mb-4 max-w-xs">
        {requiredPlan === "strategy"
          ? "This feature requires the Strategy plan ($27/mo)"
          : "This feature requires the Basic plan ($22/mo)"
        }
      </p>
      <Link href="/billing">
        <Button>
          Upgrade to {requiredPlan === "strategy" ? "Strategy" : "Basic"}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}
