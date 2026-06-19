"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Music,
  Package,
  Sparkles,
  ArrowRight,
  Bookmark,
  DollarSign,
  BarChart3,
  ExternalLink,
  Brain,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UpgradePrompt, UsageLimitWarning } from "@/components/upgrade-prompt";
import { Skeleton } from "@/components/ui/skeleton";

type UsageItem = {
  used: number;
  limit: number;
  unlimited: boolean;
};

type DashboardData = {
  stats: {
    topVelocity: { value: number; change: string; positive: boolean };
    trendingSounds: { value: number; change: string; positive: boolean };
    avgCommission: { value: string; change: string; positive: boolean };
    watchlistCount: { value: number; change: string; positive: boolean };
  };
  usage: {
    productViews: UsageItem;
    soundViews: UsageItem;
    watchlist: UsageItem;
  };
  topProducts: Array<{
    id: string;
    title: string;
    imageUrl: string | null;
    price: number;
    commissionPct: number;
    shopName: string;
    category: string;
    soldDelta: number;
    velocity: number;
  }>;
  topSounds: Array<{
    id: string;
    title: string;
    author: string;
    coverUrl: string | null;
    videoCount: number;
    rankDelta: number;
    rank: number | null;
  }>;
  watchlist: Array<{
    id: string;
    itemType: string;
    itemId: string;
    itemName: string;
    itemImage: string | null;
  }>;
  predictions: Array<{
    id: string;
    itemType: string;
    itemName: string;
    itemImage: string | null;
    confidenceScore: number;
    predictedPeakDate: string;
  }>;
  user: {
    name: string | null;
    email: string;
    tier: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: string | null;
  };
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && !data.error) {
          setData(data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const userPlan = (data?.user?.tier?.toLowerCase() || "free") as "free" | "basic" | "pro" | "enterprise";
  const displayName = data?.user?.name || data?.user?.email?.split("@")[0] || "there";

  // Real usage from API
  const productUsage = data?.usage?.productViews || { used: 0, limit: 5, unlimited: false };
  const soundUsage = data?.usage?.soundViews || { used: 0, limit: 5, unlimited: false };

  const topProducts = data?.topProducts || [];
  const topSounds = data?.topSounds || [];
  const predictions = data?.predictions || [];
  const watchlist = data?.watchlist || [];

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {displayName}!</h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s trending on TikTok Shop today
        </p>
      </div>

      {/* Free Tier Usage Warning */}
      {userPlan === "free" && !productUsage.unlimited && (
        <div className="mb-6">
          <UsageLimitWarning
            used={productUsage.used}
            limit={productUsage.limit}
            feature="products"
          />
        </div>
      )}

      {/* Upgrade Prompt for Free Users */}
      {userPlan === "free" && (
        <UpgradePrompt variant="free-to-basic" className="mb-6" />
      )}

      {/* Subscription Cancellation Notice */}
      {data?.user?.cancelAtPeriodEnd && data?.user?.currentPeriodEnd && (
        <Card className="mb-6 border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Bookmark className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-yellow-700 dark:text-yellow-400">
                  Subscription Ending
                </p>
                <p className="text-sm text-muted-foreground">
                  Your {userPlan.toUpperCase()} plan will end on{" "}
                  {new Date(data.user.currentPeriodEnd).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  . You&apos;ll be downgraded to Free after this date.
                </p>
              </div>
              <Link href="/billing">
                <Button variant="outline" size="sm">
                  Reactivate
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            title: "Top Product Velocity",
            value: data?.stats.topVelocity.value ? `${data.stats.topVelocity.value}/day` : "—",
            change: data?.stats.topVelocity.change || "—",
            positive: data?.stats.topVelocity.positive ?? true,
            icon: Package,
          },
          {
            title: "Trending Sounds",
            value: data?.stats.trendingSounds.value?.toString() || "—",
            change: data?.stats.trendingSounds.change || "—",
            positive: data?.stats.trendingSounds.positive ?? true,
            icon: Music,
          },
          {
            title: "Avg Commission",
            value: data?.stats.avgCommission.value ? `${data.stats.avgCommission.value}%` : "—",
            change: data?.stats.avgCommission.change || "—",
            positive: data?.stats.avgCommission.positive ?? true,
            icon: DollarSign,
          },
          {
            title: "Your Watchlist",
            value: data?.stats.watchlistCount.value?.toString() || "0",
            change: data?.stats.watchlistCount.change || "items",
            positive: data?.stats.watchlistCount.positive ?? true,
            icon: Bookmark,
          },
        ].map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.positive ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span
                      className={`text-xs ${stat.positive ? "text-green-500" : "text-red-500"}`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Products & Sounds */}
        <div className="lg:col-span-2 space-y-6">
          {/* High Movers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  High-Mover Products
                </CardTitle>
                <CardDescription>Products with highest sales velocity</CardDescription>
              </div>
              <Link href="/products">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="rising">
                <TabsList className="mb-4">
                  <TabsTrigger value="rising">Rising Fast</TabsTrigger>
                  <TabsTrigger value="commission">High Commission</TabsTrigger>
                </TabsList>
                <TabsContent value="rising" className="space-y-3">
                  {topProducts.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No products synced yet. Data will appear after the first sync.
                    </p>
                  ) : (
                    topProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Avatar className="h-12 w-12 rounded-lg">
                          <AvatarImage src={product.imageUrl || undefined} alt={product.title} />
                          <AvatarFallback>{product.title[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{product.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.shopName} • {product.category}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold">${product.price}</p>
                          <div className="flex items-center gap-1 text-green-500 text-sm">
                            <TrendingUp className="h-3 w-3" />
                            +{product.soldDelta.toLocaleString()}
                          </div>
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          {product.commissionPct}%
                        </Badge>
                      </Link>
                    ))
                  )}
                </TabsContent>
                <TabsContent value="commission" className="space-y-3">
                  {topProducts.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No products synced yet.
                    </p>
                  ) : (
                    [...topProducts]
                      .sort((a, b) => b.commissionPct - a.commissionPct)
                      .map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <Avatar className="h-12 w-12 rounded-lg">
                            <AvatarImage src={product.imageUrl || undefined} alt={product.title} />
                            <AvatarFallback>{product.title[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{product.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.shopName} • {product.category}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-semibold text-green-600">{product.commissionPct}%</p>
                            <p className="text-sm text-muted-foreground">
                              ${(product.price * product.commissionPct / 100).toFixed(2)}/sale
                            </p>
                          </div>
                        </Link>
                      ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Trending Sounds */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Trending Sounds
                </CardTitle>
                <CardDescription>Sounds gaining traction right now</CardDescription>
              </div>
              <Link href="/sounds">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {topSounds.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No sounds synced yet. Data will appear after the first sync.
                </p>
              ) : (
                topSounds.map((sound, index) => (
                  <Link
                    key={sound.id}
                    href={`/sounds/${sound.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                      {sound.rank || index + 1}
                    </div>
                    <Avatar className="h-12 w-12 rounded-lg">
                      <AvatarImage src={sound.coverUrl || undefined} alt={sound.title} />
                      <AvatarFallback>
                        <Music className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{sound.title}</p>
                      <p className="text-sm text-muted-foreground">{sound.author}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold">{(sound.videoCount / 1000).toFixed(0)}K</p>
                      <div
                        className={`flex items-center gap-1 text-sm ${
                          sound.rankDelta > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {sound.rankDelta > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {sound.rankDelta > 0 ? "+" : ""}
                        {sound.rankDelta}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Predictions & Watchlist */}
        <div className="space-y-6">
          {/* Predictions */}
          <Card className="border-2 border-dashed border-muted-foreground/30 bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Before Saturation
              </CardTitle>
              <CardDescription>Items predicted to break out soon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {predictions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4 text-sm">
                  No predictions available yet.
                </p>
              ) : (
                predictions.map((pred) => (
                  <Link
                    key={pred.id}
                    href="/predictions"
                    className="block p-3 rounded-lg bg-background hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-10 w-10 rounded-lg">
                        <AvatarImage src={pred.itemImage || undefined} alt={pred.itemName} />
                        <AvatarFallback>{pred.itemType === "PRODUCT" ? "P" : "S"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm">{pred.itemName}</p>
                        <Badge variant="outline" className="text-xs">
                          {pred.itemType === "PRODUCT" ? "Product" : "Sound"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-semibold text-purple-600">{pred.confidenceScore}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Peak Est.</span>
                      <span>{pred.predictedPeakDate}</span>
                    </div>
                  </Link>
                ))
              )}
              <Link href="/predictions">
                <Button variant="outline" className="w-full" size="sm">
                  View All Predictions
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Watchlist */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5" />
                  Your Watchlist
                </CardTitle>
                <CardDescription>Items you&apos;re tracking</CardDescription>
              </div>
              <Link href="/watchlist">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {watchlist.length === 0 ? (
                <p className="text-muted-foreground text-center py-4 text-sm">
                  Your watchlist is empty. Start tracking items!
                </p>
              ) : (
                watchlist.map((item) => (
                  <Link
                    key={item.id}
                    href={
                      item.itemType === "PRODUCT"
                        ? `/products/${item.itemId}`
                        : item.itemType === "SOUND"
                        ? `/sounds/${item.itemId}`
                        : `/shops/${item.itemId}`
                    }
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Avatar className="h-10 w-10 rounded-lg">
                      <AvatarImage src={item.itemImage || undefined} alt={item.itemName} />
                      <AvatarFallback>{item.itemName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm">{item.itemName}</p>
                      <Badge variant="secondary" className="text-xs">
                        {item.itemType}
                      </Badge>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Link href="/products">
                <Button variant="outline" className="w-full h-auto py-3 flex-col">
                  <Package className="h-5 w-5 mb-1" />
                  <span className="text-xs">Products</span>
                </Button>
              </Link>
              <Link href="/sounds">
                <Button variant="outline" className="w-full h-auto py-3 flex-col">
                  <Music className="h-5 w-5 mb-1" />
                  <span className="text-xs">Sounds</span>
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline" className="w-full h-auto py-3 flex-col">
                  <BarChart3 className="h-5 w-5 mb-1" />
                  <span className="text-xs">Categories</span>
                </Button>
              </Link>
              <Link href="/predictions">
                <Button variant="outline" className="w-full h-auto py-3 flex-col">
                  <Sparkles className="h-5 w-5 mb-1" />
                  <span className="text-xs">Predictions</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Strategy Builder Prompt - Show to Basic users who don't have Pro */}
          {(userPlan === "basic" || userPlan === "free") && (
            <Card className="border-2 border-dashed border-primary/50 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">AI Strategy Builder</h3>
                    <Badge variant="secondary" className="text-xs">PRO</Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Get personalized 7-90 day growth strategies with weekly product & sound picks.
                </p>
                <Link href="/billing">
                  <Button size="sm" className="w-full">
                    {userPlan === "free" ? "Upgrade to Pro" : "Upgrade"}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
