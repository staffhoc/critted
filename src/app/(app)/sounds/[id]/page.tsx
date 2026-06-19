"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Music,
  TrendingUp,
  TrendingDown,
  Play,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Bell,
  Share2,
  ArrowLeft,
  Video,
  Users,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockSounds, generateChartData } from "@/lib/mock-data";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useState } from "react";

export default function SoundDetailPage() {
  const params = useParams();
  const [isSaved, setIsSaved] = useState(false);

  const sound = mockSounds.find((s) => s.id === params.id) || mockSounds[0];
  const chartData = generateChartData(30);

  const relatedSounds = mockSounds.filter((s) => s.id !== sound.id).slice(0, 4);

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Back Link */}
      <Link
        href="/sounds"
        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sounds
      </Link>

      {/* Header */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Cover Art */}
                <div className="relative shrink-0">
                  <Avatar className="h-32 w-32 sm:h-40 sm:w-40 rounded-2xl">
                    <AvatarImage src={sound.coverUrl} alt={sound.title} />
                    <AvatarFallback className="text-4xl">
                      <Music className="h-16 w-16" />
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-2 right-2 h-10 w-10 rounded-full"
                  >
                    <Play className="h-5 w-5" fill="white" />
                  </Button>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          className={
                            sound.rankDelta > 0
                              ? "bg-green-500"
                              : sound.rankDelta < 0
                              ? "bg-red-500"
                              : ""
                          }
                        >
                          #{sound.rank} in {sound.locale}
                        </Badge>
                        <Badge variant="outline">{sound.locale}</Badge>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold mb-2">{sound.title}</h1>
                      <p className="text-lg text-muted-foreground mb-4">{sound.author}</p>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Videos</p>
                      <p className="text-xl font-bold">
                        {(sound.videoCount / 1000000).toFixed(2)}M
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">24h Change</p>
                      <p className="text-xl font-bold text-green-500">
                        +{(sound.videoCountDelta / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Growth Rate</p>
                      <p className="text-xl font-bold">+{sound.growthRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rank Change</p>
                      <div
                        className={`flex items-center gap-1 text-xl font-bold ${
                          sound.rankDelta > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {sound.rankDelta > 0 ? (
                          <TrendingUp className="h-5 w-5" />
                        ) : (
                          <TrendingDown className="h-5 w-5" />
                        )}
                        {sound.rankDelta > 0 ? "+" : ""}
                        {sound.rankDelta}
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
                  href={sound.soundUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-8 gap-1.5 px-2.5 rounded-lg border border-border bg-background hover:bg-muted text-sm font-medium transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open on TikTok
                </a>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Total Videos</span>
              </div>
              <span className="font-semibold">
                {(sound.videoCount / 1000000).toFixed(2)}M
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">7-Day Growth</span>
              </div>
              <span className="font-semibold text-green-500">+42.3%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Est. Creators</span>
              </div>
              <span className="font-semibold">85K+</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">First Seen</span>
              </div>
              <span className="font-semibold">12 days ago</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Video Count Over Time</CardTitle>
          <CardDescription>Daily video count for this sound</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="30d">
            <TabsList className="mb-4">
              <TabsTrigger value="7d">7 Days</TabsTrigger>
              <TabsTrigger value="30d">30 Days</TabsTrigger>
              <TabsTrigger value="90d">90 Days</TabsTrigger>
            </TabsList>
            <TabsContent value="30d">
              <div className="h-[300px] sm:h-[400px]">
                <ChartContainer
                  config={{
                    value: {
                      label: "Videos",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
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
                        fill="url(#colorValue)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </TabsContent>
            <TabsContent value="7d">
              <div className="h-[300px] sm:h-[400px] flex items-center justify-center text-muted-foreground">
                7-day chart data
              </div>
            </TabsContent>
            <TabsContent value="90d">
              <div className="h-[300px] sm:h-[400px] flex items-center justify-center text-muted-foreground">
                90-day chart data
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Related Sounds */}
      <Card>
        <CardHeader>
          <CardTitle>Similar Trending Sounds</CardTitle>
          <CardDescription>Other sounds you might want to use</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedSounds.map((s) => (
              <Link
                key={s.id}
                href={`/sounds/${s.id}`}
                className="p-4 rounded-lg border hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-12 w-12 rounded-lg">
                    <AvatarImage src={s.coverUrl} alt={s.title} />
                    <AvatarFallback>
                      <Music className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">{s.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.author}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {(s.videoCount / 1000000).toFixed(1)}M videos
                  </span>
                  <span
                    className={s.rankDelta > 0 ? "text-green-500" : "text-red-500"}
                  >
                    {s.rankDelta > 0 ? "+" : ""}
                    {s.rankDelta}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
