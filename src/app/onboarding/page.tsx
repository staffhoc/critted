"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  TrendingUp,
  Users,
  Zap,
  Globe,
  ChevronRight,
  Loader2,
  UserCircle,
  Calendar,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type UserType = "CREATOR" | "SELLER" | null;
type Locale = "US" | "UK" | "ID" | "MY" | "TH" | "VN" | "PH" | "NG" | "KE" | "DE" | "CA" | "UG" | null;
type FollowerRange = "0-1k" | "1k-10k" | "10k-100k" | "100k+" | null;
type AccountAge = "new" | "1-3m" | "3-6m" | "6m+" | null;

const localeOptions = [
  { value: "US", label: "United States", flag: "\u{1F1FA}\u{1F1F8}", shop: "TikTok Shop US" },
  { value: "UK", label: "United Kingdom", flag: "\u{1F1EC}\u{1F1E7}", shop: "TikTok Shop UK" },
  { value: "ID", label: "Indonesia", flag: "\u{1F1EE}\u{1F1E9}", shop: "TikTok Shop ID" },
  { value: "MY", label: "Malaysia", flag: "\u{1F1F2}\u{1F1FE}", shop: "TikTok Shop MY" },
  { value: "TH", label: "Thailand", flag: "\u{1F1F9}\u{1F1ED}", shop: "TikTok Shop TH" },
  { value: "VN", label: "Vietnam", flag: "\u{1F1FB}\u{1F1F3}", shop: "TikTok Shop VN" },
  { value: "PH", label: "Philippines", flag: "\u{1F1F5}\u{1F1ED}", shop: "TikTok Shop PH" },
  { value: "NG", label: "Nigeria", flag: "\u{1F1F3}\u{1F1EC}", shop: "TikTok Shop NG" },
  { value: "KE", label: "Kenya", flag: "\u{1F1F0}\u{1F1EA}", shop: "TikTok Shop KE" },
  { value: "DE", label: "Germany", flag: "\u{1F1E9}\u{1F1EA}", shop: "TikTok Shop DE" },
  { value: "CA", label: "Canada", flag: "\u{1F1E8}\u{1F1E6}", shop: "TikTok Shop CA" },
  { value: "UG", label: "Uganda", flag: "\u{1F1FA}\u{1F1EC}", shop: "TikTok Shop UG" },
];

const niches = [
  "Beauty & Skincare",
  "Fashion & Accessories",
  "Health & Wellness",
  "Home & Kitchen",
  "Tech & Gadgets",
  "Food & Beverages",
  "Fitness & Sports",
  "Pets & Animals",
  "Kids & Baby",
  "Lifestyle & General",
];

const followerOptions = [
  { value: "0-1k", label: "0 - 1K", description: "Just starting out" },
  { value: "1k-10k", label: "1K - 10K", description: "Building momentum" },
  { value: "10k-100k", label: "10K - 100K", description: "Growing audience" },
  { value: "100k+", label: "100K+", description: "Established creator" },
];

const accountAgeOptions = [
  { value: "new", label: "Brand New", description: "Less than 1 month" },
  { value: "1-3m", label: "1-3 Months", description: "Getting started" },
  { value: "3-6m", label: "3-6 Months", description: "Building history" },
  { value: "6m+", label: "6+ Months", description: "Established account" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType>(null);
  const [locale, setLocale] = useState<Locale>(null);
  const [followerRange, setFollowerRange] = useState<FollowerRange>(null);
  const [accountAge, setAccountAge] = useState<AccountAge>(null);
  const [primaryNiche, setPrimaryNiche] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = userType === "CREATOR" ? 4 : 2;

  const handleComplete = async () => {
    if (!userType || !locale) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userType, locale }),
      });

      if (!response.ok) {
        throw new Error("Failed to save preferences");
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
      setIsLoading(false);
    }
  };

  const progress = (step / totalSteps) * 100;

  const canProceed = () => {
    switch (step) {
      case 1:
        return userType !== null;
      case 2:
        if (userType === "SELLER") return locale !== null;
        return followerRange !== null && accountAge !== null;
      case 3:
        return primaryNiche !== null;
      case 4:
        return locale !== null;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step === totalSteps) {
      handleComplete();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-foreground">Critted</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Step {step} of {totalSteps}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="container px-4 mx-auto mt-4">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Step 1: User Type */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">What brings you here?</h1>
                <p className="text-lg text-muted-foreground">
                  We&apos;ll customize your dashboard based on your needs
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary/50",
                    userType === "CREATOR" && "border-2 border-primary bg-primary/5"
                  )}
                  onClick={() => setUserType("CREATOR")}
                >
                  <CardContent className="p-6">
                    <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mb-4">
                      <Users className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Affiliate Creator</h3>
                    <p className="text-muted-foreground">
                      I create content and want to find high-commission products and trending sounds to promote
                    </p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-primary" />
                        High-commission products
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-primary" />
                        Trending sounds
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-primary" />
                        AI Strategy Builder
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary/50",
                    userType === "SELLER" && "border-2 border-primary bg-primary/5"
                  )}
                  onClick={() => setUserType("SELLER")}
                >
                  <CardContent className="p-6">
                    <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mb-4">
                      <Zap className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">TikTok Shop Seller</h3>
                    <p className="text-muted-foreground">
                      I sell products and want to spot winning products, track competitors, and benchmark
                    </p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-primary" />
                        Product trends
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-primary" />
                        Competitor tracking
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-primary" />
                        Category insights
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center">
                <Button size="lg" className="px-8" disabled={!canProceed()} onClick={handleNext}>
                  Continue
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 for Creators: Account Info */}
          {step === 2 && userType === "CREATOR" && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <UserCircle className="h-7 w-7 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">Tell us about your account</h1>
                <p className="text-lg text-muted-foreground">
                  This helps us personalize your strategy recommendations
                </p>
              </div>

              {/* Follower Range */}
              <div className="space-y-3">
                <h3 className="font-semibold text-center">Current Follower Count</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {followerOptions.map((option) => (
                    <Card
                      key={option.value}
                      className={cn(
                        "cursor-pointer transition-all hover:border-primary/50",
                        followerRange === option.value && "border-2 border-primary bg-primary/5"
                      )}
                      onClick={() => setFollowerRange(option.value as FollowerRange)}
                    >
                      <CardContent className="p-4 text-center">
                        <p className="font-semibold">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Account Age */}
              <div className="space-y-3">
                <h3 className="font-semibold text-center flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Account Age
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {accountAgeOptions.map((option) => (
                    <Card
                      key={option.value}
                      className={cn(
                        "cursor-pointer transition-all hover:border-primary/50",
                        accountAge === option.value && "border-2 border-primary bg-primary/5"
                      )}
                      onClick={() => setAccountAge(option.value as AccountAge)}
                    >
                      <CardContent className="p-4 text-center">
                        <p className="font-semibold">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button size="lg" className="px-8" disabled={!canProceed()} onClick={handleNext}>
                  Continue
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3 for Creators: Niche Selection */}
          {step === 3 && userType === "CREATOR" && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">What&apos;s your niche?</h1>
                <p className="text-lg text-muted-foreground">
                  Select your primary content category
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {niches.map((niche) => (
                  <Card
                    key={niche}
                    className={cn(
                      "cursor-pointer transition-all hover:border-primary/50",
                      primaryNiche === niche && "border-2 border-primary bg-primary/5"
                    )}
                    onClick={() => setPrimaryNiche(niche)}
                  >
                    <CardContent className="p-4 text-center">
                      <p className="font-medium text-sm">{niche}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center gap-3">
                <Button variant="outline" size="lg" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button size="lg" className="px-8" disabled={!canProceed()} onClick={handleNext}>
                  Continue
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Market Selection (Step 2 for Sellers, Step 4 for Creators) */}
          {((step === 2 && userType === "SELLER") || (step === 4 && userType === "CREATOR")) && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">Choose your market</h1>
                <p className="text-lg text-muted-foreground">
                  Select the TikTok Shop market you want to track
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-3xl mx-auto">
                {localeOptions.map((option) => (
                  <Card
                    key={option.value}
                    className={cn(
                      "cursor-pointer transition-all hover:border-primary/50",
                      locale === option.value && "border-2 border-primary bg-primary/5"
                    )}
                    onClick={() => setLocale(option.value as Locale)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3 text-3xl">
                        {option.flag}
                      </div>
                      <h3 className="font-semibold mb-1">{option.label}</h3>
                      <p className="text-xs text-muted-foreground">{option.shop}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <p className="text-center text-sm text-muted-foreground">
                <Globe className="h-4 w-4 inline mr-1" />
                You can change this anytime in settings
              </p>

              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(userType === "SELLER" ? 1 : 3)}
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  className="px-8"
                  disabled={!canProceed() || isLoading}
                  onClick={handleComplete}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Get Started
                      <ChevronRight className="h-5 w-5 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
