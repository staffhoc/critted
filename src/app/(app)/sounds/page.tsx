"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Music,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Play,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Sound = {
  id: string;
  externalId: string;
  title: string;
  author: string;
  duration: number | null;
  coverUrl: string | null;
  audioUrl: string | null;
  locale: string;
  videoCount: number;
  videoCountDelta: number;
  velocity: number;
  growthRate: number;
  rank: number | null;
  rankDelta: number;
  isViral: boolean;
  isTrending: boolean;
  soundUrl: string;
  lastUpdatedAt: string;
};

export default function SoundsPage() {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [locale, setLocale] = useState("all");
  const [signalMode, setSignalMode] = useState("rising");
  const [savedSounds, setSavedSounds] = useState<string[]>([]);

  useEffect(() => {
    const fetchSounds = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("search", searchQuery);
        if (locale !== "all") params.set("locale", locale);
        if (signalMode === "rising") params.set("filter", "rising");
        params.set("sortBy", "rank");
        params.set("limit", "50");

        const res = await fetch(`/api/sounds?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setSounds(data.sounds || []);
          setTotal(data.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch sounds:", error);
      }
      setIsLoading(false);
    };

    fetchSounds();
  }, [searchQuery, locale, signalMode]);

  const toggleSave = (id: string) => {
    setSavedSounds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    // TODO: Call API to save to watchlist
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Music className="h-8 w-8" />
            Trending Sounds
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover sounds that are blowing up on TikTok right now
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {total} sounds
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sounds or artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Signal Mode Toggle */}
            <Tabs value={signalMode} onValueChange={(value) => value && setSignalMode(value)}>
              <TabsList>
                <TabsTrigger value="rising">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Rising Fast
                </TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Locale Filter */}
            <Select value={locale} onValueChange={(val) => val && setLocale(val)}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Market" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Markets</SelectItem>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>
              {sounds.length} Sounds Found
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                More Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : sounds.length === 0 ? (
            <div className="text-center py-12">
              <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No sounds found. Data will appear after the first sync.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Rank</TableHead>
                      <TableHead>Sound</TableHead>
                      <TableHead className="text-right">Videos</TableHead>
                      <TableHead className="text-right">Growth</TableHead>
                      <TableHead className="text-right">Rank Change</TableHead>
                      <TableHead className="text-right">Market</TableHead>
                      <TableHead className="w-24"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sounds.map((sound) => (
                      <TableRow key={sound.id} className="group">
                        <TableCell>
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                            {sound.rank || "—"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/sounds/${sound.id}`}
                            className="flex items-center gap-3 hover:opacity-80"
                          >
                            <div className="relative">
                              <Avatar className="h-12 w-12 rounded-lg">
                                <AvatarImage src={sound.coverUrl || undefined} alt={sound.title} />
                                <AvatarFallback>
                                  <Music className="h-6 w-6" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="h-5 w-5 text-white" fill="white" />
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">{sound.title}</p>
                              <p className="text-sm text-muted-foreground">{sound.author}</p>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            <p className="font-semibold">
                              {sound.videoCount >= 1000000
                                ? `${(sound.videoCount / 1000000).toFixed(2)}M`
                                : `${(sound.videoCount / 1000).toFixed(0)}K`}
                            </p>
                            <p className="text-sm text-green-500">
                              +{(sound.videoCountDelta / 1000).toFixed(0)}K
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={sound.growthRate > 10 ? "default" : "secondary"}
                            className={sound.growthRate > 10 ? "bg-green-500" : ""}
                          >
                            +{sound.growthRate.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div
                            className={`flex items-center justify-end gap-1 ${
                              sound.rankDelta > 0 ? "text-green-500" : sound.rankDelta < 0 ? "text-red-500" : "text-muted-foreground"
                            }`}
                          >
                            {sound.rankDelta > 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : sound.rankDelta < 0 ? (
                              <TrendingDown className="h-4 w-4" />
                            ) : null}
                            <span className="font-semibold">
                              {sound.rankDelta > 0 ? "+" : ""}
                              {sound.rankDelta}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">{sound.locale}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleSave(sound.id)}
                            >
                              {savedSounds.includes(sound.id) ? (
                                <BookmarkCheck className="h-4 w-4 text-primary" />
                              ) : (
                                <Bookmark className="h-4 w-4" />
                              )}
                            </Button>
                            <a
                              href={sound.soundUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {sounds.map((sound) => (
                  <Link
                    key={sound.id}
                    href={`/sounds/${sound.id}`}
                    className="block p-4 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0">
                        {sound.rank || "—"}
                      </div>
                      <Avatar className="h-14 w-14 rounded-lg shrink-0">
                        <AvatarImage src={sound.coverUrl || undefined} alt={sound.title} />
                        <AvatarFallback>
                          <Music className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{sound.title}</p>
                        <p className="text-sm text-muted-foreground">{sound.author}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-sm">
                            {sound.videoCount >= 1000000
                              ? `${(sound.videoCount / 1000000).toFixed(2)}M`
                              : `${(sound.videoCount / 1000).toFixed(0)}K`} videos
                          </span>
                          <Badge
                            variant={sound.growthRate > 10 ? "default" : "secondary"}
                            className={sound.growthRate > 10 ? "bg-green-500" : ""}
                          >
                            +{sound.growthRate.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-1 shrink-0 ${
                          sound.rankDelta > 0 ? "text-green-500" : sound.rankDelta < 0 ? "text-red-500" : "text-muted-foreground"
                        }`}
                      >
                        {sound.rankDelta > 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : sound.rankDelta < 0 ? (
                          <TrendingDown className="h-4 w-4" />
                        ) : null}
                        <span className="font-semibold">
                          {sound.rankDelta > 0 ? "+" : ""}
                          {sound.rankDelta}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
