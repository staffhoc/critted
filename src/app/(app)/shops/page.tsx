"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Store,
  Search,
  TrendingUp,
  Package,
  Star,
  Eye,
  Plus,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

type Shop = {
  id: string;
  externalId: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  locale: string;
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  avgRating: number | null;
  reviewCount: number;
  followerCount: number;
  isVerified: boolean;
  shopUrl: string;
};

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [locale, setLocale] = useState("all");
  const [sortBy, setSortBy] = useState("sales");
  const [trackedShops, setTrackedShops] = useState<string[]>([]);

  useEffect(() => {
    const fetchShops = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("search", searchQuery);
        if (locale !== "all") params.set("locale", locale);
        params.set("sortBy", sortBy);
        params.set("limit", "50");

        const res = await fetch(`/api/shops?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setShops(data.shops || []);
          setTotal(data.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch shops:", error);
      }
      setIsLoading(false);
    };

    fetchShops();
  }, [searchQuery, locale, sortBy]);

  const toggleTrack = (id: string) => {
    setTrackedShops((prev) =>
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
            <Store className="h-8 w-8" />
            Shop Tracking
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor competitor shops and track their performance
          </p>
        </div>
        <Badge variant="outline" className="text-sm w-fit">
          {total} shops
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
                placeholder="Search shops..."
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
                <SelectItem value="sales">Most Sales</SelectItem>
                <SelectItem value="products">Most Products</SelectItem>
                <SelectItem value="rating">Highest Rating</SelectItem>
                <SelectItem value="revenue">Most Revenue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tracked Shops Section */}
      {trackedShops.length > 0 && (
        <Card className="mb-6 border-2 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Tracked Shops ({trackedShops.length})
            </CardTitle>
            <CardDescription>
              Shops you&apos;re monitoring for changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {trackedShops.map((shopId) => {
                const shop = shops.find((s) => s.id === shopId);
                if (!shop) return null;
                return (
                  <Badge
                    key={shop.id}
                    variant="secondary"
                    className="flex items-center gap-2 px-3 py-1"
                  >
                    {shop.name}
                    <button
                      onClick={() => toggleTrack(shop.id)}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : shops.length === 0 ? (
        <Card className="p-12 text-center">
          <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No shops found</h3>
          <p className="text-muted-foreground">
            Shop data will appear after the first sync.
          </p>
        </Card>
      ) : (
        /* Shop Grid */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <Card key={shop.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-16 w-16 rounded-xl">
                    <AvatarImage src={shop.logoUrl || undefined} alt={shop.name} />
                    <AvatarFallback className="text-xl">{shop.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {shop.name}
                      {shop.isVerified && (
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      )}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{shop.locale}</Badge>
                      {shop.avgRating && (
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-medium">{shop.avgRating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Package className="h-4 w-4" />
                      <span className="text-sm">Products</span>
                    </div>
                    <p className="font-semibold text-lg">{shop.totalProducts}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">Total Sales</span>
                    </div>
                    <p className="font-semibold text-lg">
                      {shop.totalSales >= 1000
                        ? `${(shop.totalSales / 1000).toFixed(0)}K`
                        : shop.totalSales}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={trackedShops.includes(shop.id) ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => toggleTrack(shop.id)}
                  >
                    {trackedShops.includes(shop.id) ? (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Tracking
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Track Shop
                      </>
                    )}
                  </Button>
                  <Link href={`/shops/${shop.id}`}>
                    <Button variant="outline" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
