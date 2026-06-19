"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Video,
  Search,
  Play,
  Eye,
  Heart,
  ShoppingCart,
  ExternalLink,
  Filter,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type VideoItem = {
  id: string;
  externalId: string;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  title: string;
  description: string | null;
  duration: number | null;
  locale: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number | null;
  conversions: number;
  creator: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  } | null;
  product: {
    id: string;
    name: string;
    imageUrl: string | null;
    price: number;
  } | null;
  sound: {
    id: string;
    title: string;
    coverUrl: string | null;
  } | null;
  publishedAt: string | null;
  tiktokUrl: string;
};

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [locale, setLocale] = useState("all");
  const [sortBy, setSortBy] = useState("views");

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("search", searchQuery);
        if (locale !== "all") params.set("locale", locale);
        params.set("sortBy", sortBy);
        params.set("limit", "50");

        const res = await fetch(`/api/videos?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setVideos(data.videos || []);
          setTotal(data.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
      setIsLoading(false);
    };

    fetchVideos();
  }, [searchQuery, locale, sortBy]);

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Video className="h-8 w-8" />
            Video Inspiration
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover top-converting videos and ad inspiration
          </p>
        </div>
        <Badge variant="outline" className="text-sm w-fit">
          {total} videos
        </Badge>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Locale Filter */}
            <Select value={locale} onValueChange={(val) => val && setLocale(val)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Market" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Markets</SelectItem>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={(val) => val && setSortBy(val)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="views">Most Views</SelectItem>
                <SelectItem value="likes">Most Likes</SelectItem>
                <SelectItem value="engagement">Best Engagement</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="shrink-0">
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : videos.length === 0 ? (
        <Card className="p-12 text-center">
          <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No videos found</h3>
          <p className="text-muted-foreground">
            Video data will appear after the first sync.
          </p>
        </Card>
      ) : (
        /* Video Grid */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:border-primary/50 transition-colors">
              {/* Thumbnail */}
              <div className="relative aspect-video bg-muted">
                <Avatar className="h-full w-full rounded-none">
                  <AvatarImage
                    src={video.thumbnailUrl || undefined}
                    alt={video.title}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-none">
                    <Video className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <a
                  href={video.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Button size="icon" className="h-14 w-14 rounded-full">
                    <Play className="h-7 w-7" fill="white" />
                  </Button>
                </a>
                <Badge className="absolute top-2 right-2 bg-black/70">
                  {video.locale}
                </Badge>
              </div>

              <CardContent className="p-4">
                {/* Title & Creator */}
                <h3 className="font-medium line-clamp-2 mb-2">{video.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {video.creator ? `@${video.creator.username}` : "Unknown Creator"}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-muted">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Eye className="h-3 w-3" />
                    </div>
                    <p className="font-semibold text-sm">
                      {video.views >= 1000000
                        ? `${(video.views / 1000000).toFixed(1)}M`
                        : video.views >= 1000
                        ? `${(video.views / 1000).toFixed(0)}K`
                        : video.views}
                    </p>
                    <p className="text-xs text-muted-foreground">Views</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Heart className="h-3 w-3" />
                    </div>
                    <p className="font-semibold text-sm">
                      {video.likes >= 1000
                        ? `${(video.likes / 1000).toFixed(0)}K`
                        : video.likes}
                    </p>
                    <p className="text-xs text-muted-foreground">Likes</p>
                  </div>
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                      <ShoppingCart className="h-3 w-3" />
                    </div>
                    <p className="font-semibold text-sm text-green-600">
                      {video.conversions.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Sales</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  {video.product && (
                    <Link href={`/products/${video.product.id}`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        View Product
                      </Button>
                    </Link>
                  )}
                  <a
                    href={video.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
