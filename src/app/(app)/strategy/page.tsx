"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Brain,
  Users,
  Calendar,
  Target,
  Package,
  Music,
  ChevronRight,
  Loader2,
  Sparkles,
  Clock,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Mock user subscription - in real app this would come from auth context
const userPlan = "strategy"; // "free" | "basic" | "strategy"

const followerRanges = [
  { value: "0-1k", label: "0 - 1,000" },
  { value: "1k-10k", label: "1,000 - 10,000" },
  { value: "10k-100k", label: "10,000 - 100,000" },
  { value: "100k+", label: "100,000+" },
];

const accountAges = [
  { value: "new", label: "Less than 1 month" },
  { value: "1-3m", label: "1 - 3 months" },
  { value: "3-6m", label: "3 - 6 months" },
  { value: "6m+", label: "6+ months" },
];

const niches = [
  "Beauty & Skincare",
  "Fashion & Accessories",
  "Tech & Gadgets",
  "Home & Kitchen",
  "Health & Fitness",
  "Food & Cooking",
  "Pet Products",
  "Baby & Kids",
];

interface Strategy {
  week: number;
  sound: {
    name: string;
    growth: string;
  };
  product: {
    name: string;
    commission: string;
    growth: string;
  };
  contentPlan: string[];
  goal: string;
  tips: string[];
}

const mockStrategies: Record<string, Strategy[]> = {
  "7": [
    {
      week: 1,
      sound: { name: "Original sound - viral beat", growth: "+312%" },
      product: { name: "LED Ring Light with Phone Holder", commission: "$4.50", growth: "+18%" },
      contentPlan: ["Unboxing video", "Demo/Tutorial", "Review with results"],
      goal: "Post 3 videos, aim for 1,000+ views on at least one",
      tips: [
        "Post between 6-9 PM in your timezone",
        "Use trending hashtags in your niche",
        "Engage with comments within first hour",
      ],
    },
  ],
  "30": [
    {
      week: 1,
      sound: { name: "Original sound - viral beat", growth: "+312%" },
      product: { name: "LED Ring Light", commission: "$4.50", growth: "+18%" },
      contentPlan: ["Unboxing", "Setup tutorial", "Before/after results"],
      goal: "Establish content rhythm, 3 videos",
      tips: ["Focus on consistency over perfection"],
    },
    {
      week: 2,
      sound: { name: "Summer Vibes Remix", growth: "+89%" },
      product: { name: "Portable Blender", commission: "$3.00", growth: "+24%" },
      contentPlan: ["Recipe video", "Lifestyle integration", "Comparison"],
      goal: "Test different content formats",
      tips: ["Analyze which videos perform best"],
    },
    {
      week: 3,
      sound: { name: "That One Sound", growth: "+156%" },
      product: { name: "Acne Pimple Patches", commission: "$2.60", growth: "+31%" },
      contentPlan: ["Routine video", "7-day challenge start", "Q&A"],
      goal: "Double down on winning format",
      tips: ["Start building series content"],
    },
    {
      week: 4,
      sound: { name: "POV: You Found It", growth: "+144%" },
      product: { name: "Cloud Slides", commission: "$2.40", growth: "+29%" },
      contentPlan: ["Challenge results", "Lifestyle content", "Behind the scenes"],
      goal: "1 viral video (10K+ views)",
      tips: ["Collaborate or duet with similar creators"],
    },
  ],
  "60": [],
  "90": [],
};

export default function StrategyPage() {
  const [followers, setFollowers] = useState("");
  const [accountAge, setAccountAge] = useState("");
  const [primaryNiche, setPrimaryNiche] = useState("");
  const [secondaryNiche, setSecondaryNiche] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategyGenerated, setStrategyGenerated] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("30");

  const canGenerate = followers && accountAge && primaryNiche;

  const handleGenerate = () => {
    if (!canGenerate) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStrategyGenerated(true);
    }, 2500);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  // Show upgrade prompt for non-strategy users
  if (userPlan !== "strategy") {
    return (
      <div className="container px-4 py-8 mx-auto max-w-3xl">
        <Card className="border-2 border-dashed">
          <CardContent className="py-16 text-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Lock className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">AI Strategy Builder</h1>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Get personalized 7, 30, 60, and 90-day growth strategies with specific product and sound recommendations tailored to your account.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Badge variant="secondary" className="text-base px-4 py-1">
                +$5/month
              </Badge>
              <Link href="/billing">
                <Button size="lg">
                  Upgrade to Strategy Plan
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="h-8 w-8" />
          AI Strategy Builder
        </h1>
        <p className="text-muted-foreground mt-1">
          Get a personalized growth strategy based on your account profile
        </p>
      </div>

      {!strategyGenerated ? (
        /* Strategy Input Form */
        <Card>
          <CardHeader>
            <CardTitle>Tell us about your account</CardTitle>
            <CardDescription>
              We&apos;ll create a customized strategy based on your current situation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Follower Count */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Current Followers
                </Label>
                <Select value={followers} onValueChange={(value) => value && setFollowers(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {followerRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Account Age */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Account Age
                </Label>
                <Select value={accountAge} onValueChange={(value) => value && setAccountAge(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountAges.map((age) => (
                      <SelectItem key={age.value} value={age.value}>
                        {age.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Primary Niche */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Primary Niche
                </Label>
                <Select value={primaryNiche} onValueChange={(value) => value && setPrimaryNiche(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select niche" />
                  </SelectTrigger>
                  <SelectContent>
                    {niches.map((niche) => (
                      <SelectItem key={niche} value={niche}>
                        {niche}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Secondary Niche */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4 opacity-50" />
                  Secondary Niche (Optional)
                </Label>
                <Select value={secondaryNiche} onValueChange={(value) => value && setSecondaryNiche(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select niche" />
                  </SelectTrigger>
                  <SelectContent>
                    {niches
                      .filter((n) => n !== primaryNiche)
                      .map((niche) => (
                        <SelectItem key={niche} value={niche}>
                          {niche}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating Strategy...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate My Strategy
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Strategy Results */
        <div className="space-y-6">
          {/* Profile Summary */}
          <Card className="bg-muted/30">
            <CardContent className="py-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <Badge variant="secondary">{followers} followers</Badge>
                  <Badge variant="secondary">{accountAge} old</Badge>
                  <Badge variant="secondary">{primaryNiche}</Badge>
                  {secondaryNiche && <Badge variant="outline">{secondaryNiche}</Badge>}
                </div>
                <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={isGenerating}>
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Period Tabs */}
          <Tabs value={selectedPeriod} onValueChange={(value) => value && setSelectedPeriod(value)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="7">7 Days</TabsTrigger>
              <TabsTrigger value="30">30 Days</TabsTrigger>
              <TabsTrigger value="60">60 Days</TabsTrigger>
              <TabsTrigger value="90">90 Days</TabsTrigger>
            </TabsList>

            <TabsContent value="7" className="mt-6">
              <StrategyWeekView strategies={mockStrategies["7"]} period={7} />
            </TabsContent>

            <TabsContent value="30" className="mt-6">
              <StrategyWeekView strategies={mockStrategies["30"]} period={30} />
            </TabsContent>

            <TabsContent value="60" className="mt-6">
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>60-day strategy coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="90" className="mt-6">
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>90-day strategy coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

function StrategyWeekView({ strategies, period }: { strategies: Strategy[]; period: number }) {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);

  if (strategies.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Strategy generation in progress...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Strategy Progress</span>
            <span className="text-sm text-muted-foreground">Week 1 of {strategies.length}</span>
          </div>
          <Progress value={(1 / strategies.length) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Week cards */}
      {strategies.map((strategy) => (
        <Card
          key={strategy.week}
          className={cn(
            "cursor-pointer transition-all",
            expandedWeek === strategy.week && "border-primary"
          )}
          onClick={() => setExpandedWeek(expandedWeek === strategy.week ? null : strategy.week)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Week {strategy.week}
                {strategy.week === 1 && (
                  <Badge className="bg-primary">Current</Badge>
                )}
              </CardTitle>
              <ChevronRight
                className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform",
                  expandedWeek === strategy.week && "rotate-90"
                )}
              />
            </div>
            <CardDescription>{strategy.goal}</CardDescription>
          </CardHeader>

          {expandedWeek === strategy.week && (
            <CardContent className="space-y-4 pt-2">
              {/* Sound Recommendation */}
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Music className="h-4 w-4 text-primary" />
                  <span className="font-medium">Sound to Use</span>
                </div>
                <p className="text-sm">
                  {strategy.sound.name}{" "}
                  <span className="text-green-500 font-medium">{strategy.sound.growth}</span>
                </p>
              </div>

              {/* Product Recommendation */}
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-primary" />
                  <span className="font-medium">Product to Promote</span>
                </div>
                <p className="text-sm">
                  {strategy.product.name} - {strategy.product.commission} commission{" "}
                  <span className="text-green-500 font-medium">{strategy.product.growth}</span>
                </p>
              </div>

              {/* Content Plan */}
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium">Content Plan</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {strategy.contentPlan.map((content, i) => (
                    <Badge key={i} variant="secondary">
                      {content}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium text-primary">Pro Tips</span>
                </div>
                <ul className="space-y-1">
                  {strategy.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
