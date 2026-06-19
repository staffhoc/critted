"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Package,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Bell,
  Share2,
  ArrowLeft,
  Store,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Video,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockProducts, mockVideos, generateChartData } from "@/lib/mock-data";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts";

export default function ProductDetailPage() {
  const params = useParams();
  const [isSaved, setIsSaved] = useState(false);

  const product = mockProducts.find((p) => p.id === params.id) || mockProducts[0];
  const chartData = generateChartData(30);
  const relatedProducts = mockProducts.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  const productVideos = mockVideos.slice(0, 3);

  const estCommission = (product.price * product.commissionPct) / 100;

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Back Link */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      {/* Header */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Product Image */}
                <div className="shrink-0">
                  <Avatar className="h-40 w-40 sm:h-48 sm:w-48 rounded-2xl">
                    <AvatarImage src={product.imageUrl} alt={product.title} />
                    <AvatarFallback className="text-4xl">
                      <Package className="h-16 w-16" />
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="outline">{product.category}</Badge>
                    <Badge variant="outline">{product.locale}</Badge>
                    <Badge
                      variant={product.commissionPct >= 15 ? "default" : "secondary"}
                      className={product.commissionPct >= 15 ? "bg-green-500" : ""}
                    >
                      {product.commissionPct}% Commission
                    </Badge>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">{product.title}</h1>
                  <Link
                    href={`/shops/shop-1`}
                    className="text-lg text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4"
                  >
                    <Store className="h-4 w-4" />
                    {product.shopName}
                  </Link>

                  {/* Price & Commission */}
                  <div className="flex flex-wrap items-baseline gap-4 mb-4">
                    <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                    <div className="flex items-center gap-1 text-green-600 font-semibold">
                      <DollarSign className="h-4 w-4" />
                      <span>{estCommission.toFixed(2)} per sale</span>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Sold</p>
                      <p className="text-xl font-bold">{product.sold.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">24h Sales</p>
                      <p className="text-xl font-bold text-green-500">
                        +{product.soldDelta.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Velocity</p>
                      <p className="text-xl font-bold">{product.velocity}/day</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Growth</p>
                      <div
                        className={`flex items-center gap-1 text-xl font-bold ${
                          product.growthRate > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {product.growthRate > 0 ? (
                          <TrendingUp className="h-5 w-5" />
                        ) : (
                          <TrendingDown className="h-5 w-5" />
                        )}
                        +{product.growthRate.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t">
                <Button
                  variant={isSaved ? "default" : "outline"}
                  onClick={() => setIsSaved(!isSaved)}
                >
                  {isSaved ? (
                    <BookmarkCheck className="h-4 w-4 mr-2" />
                  ) : (
                    <Bookmark className="h-4 w-4 mr-2" />
                  )}
                  {isSaved ? "Saved" : "Save to Watchlist"}
                </Button>
                <Button variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Set Alert
                </Button>
                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-8 gap-1.5 px-2.5 rounded-lg border border-border bg-background hover:bg-muted text-sm font-medium transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  View on TikTok Shop
                </a>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Commission Calculator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Earnings Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <p className="text-sm text-muted-foreground mb-1">Commission per sale</p>
              <p className="text-3xl font-bold text-green-600">${estCommission.toFixed(2)}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">10 sales</span>
                <span className="font-semibold">${(estCommission * 10).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">50 sales</span>
                <span className="font-semibold">${(estCommission * 50).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">100 sales</span>
                <span className="font-semibold text-green-600">
                  ${(estCommission * 100).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">500 sales</span>
                <span className="font-semibold text-green-600">
                  ${(estCommission * 500).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Videos */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales History</CardTitle>
            <CardDescription>Daily sales over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="30d">
              <TabsList className="mb-4">
                <TabsTrigger value="7d">7 Days</TabsTrigger>
                <TabsTrigger value="30d">30 Days</TabsTrigger>
                <TabsTrigger value="90d">90 Days</TabsTrigger>
              </TabsList>
              <TabsContent value="30d">
                <div className="h-[300px] sm:h-[350px]">
                  <ChartContainer
                    config={{
                      value: {
                        label: "Sales",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="date"
                          tickFormatter={(value) =>
                            new Date(value).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          }
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                          tick={{ fontSize: 12 }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(var(--chart-1))"
                          fill="url(#colorSales)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </TabsContent>
              <TabsContent value="7d">
                <div className="h-[300px] sm:h-[350px] flex items-center justify-center text-muted-foreground">
                  7-day chart data
                </div>
              </TabsContent>
              <TabsContent value="90d">
                <div className="h-[300px] sm:h-[350px] flex items-center justify-center text-muted-foreground">
                  90-day chart data
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Top Videos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Top Videos
            </CardTitle>
            <CardDescription>Best performing videos for this product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {productVideos.map((video) => (
              <Link
                key={video.id}
                href="/videos"
                className="block p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-24 rounded-lg">
                    <AvatarImage
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      <Video className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{video.title}</p>
                    <p className="text-xs text-muted-foreground">@{video.creatorName}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{(video.views / 1000000).toFixed(1)}M views</span>
                      <span>{video.conversions.toLocaleString()} sales</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            <Link href="/videos">
              <Button variant="outline" className="w-full" size="sm">
                View All Videos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Related Products */}
      <Card>
        <CardHeader>
          <CardTitle>Similar Products</CardTitle>
          <CardDescription>Other trending products in {product.category}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="p-4 rounded-lg border hover:bg-muted transition-colors"
                >
                  <Avatar className="h-20 w-20 rounded-lg mb-3">
                    <AvatarImage src={p.imageUrl} alt={p.title} />
                    <AvatarFallback>
                      <Package className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-medium line-clamp-2 text-sm mb-2">{p.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">${p.price.toFixed(2)}</span>
                    <Badge variant="secondary">{p.commissionPct}%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {p.sold.toLocaleString()} sold
                  </p>
                </Link>
              ))
            ) : (
              mockProducts.filter((p) => p.id !== product.id).slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="p-4 rounded-lg border hover:bg-muted transition-colors"
                >
                  <Avatar className="h-20 w-20 rounded-lg mb-3">
                    <AvatarImage src={p.imageUrl} alt={p.title} />
                    <AvatarFallback>
                      <Package className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-medium line-clamp-2 text-sm mb-2">{p.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">${p.price.toFixed(2)}</span>
                    <Badge variant="secondary">{p.commissionPct}%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {p.sold.toLocaleString()} sold
                  </p>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
