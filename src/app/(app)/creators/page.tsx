"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  TrendingUp,
  DollarSign,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Creator = {
  id: string;
  externalId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  locale: string;
  followers: number;
  following: number;
  videoCount: number;
  likeCount: number;
  isAffiliate: boolean;
  affiliateSales: number;
  isVerified: boolean;
  engagement: number;
  gmvDriven: number;
  profileUrl: string;
};

export default function CreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [locale, setLocale] = useState("all");
  const [sortBy, setSortBy] = useState("followers");

  useEffect(() => {
    const fetchCreators = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("search", searchQuery);
        if (locale !== "all") params.set("locale", locale);
        params.set("sortBy", sortBy);
        params.set("limit", "50");

        const res = await fetch(`/api/creators?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setCreators(data.creators || []);
          setTotal(data.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch creators:", error);
      }
      setIsLoading(false);
    };

    fetchCreators();
  }, [searchQuery, locale, sortBy]);

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Creator Discovery
          </h1>
          <p className="text-muted-foreground mt-1">
            Find top-performing creators to collaborate with
          </p>
        </div>
        <Badge variant="outline" className="text-sm w-fit">
          {total} creators
        </Badge>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

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

            {/* Sort By */}
            <Select value={sortBy} onValueChange={(val) => val && setSortBy(val)}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="followers">Most Followers</SelectItem>
                <SelectItem value="gmv">Highest GMV</SelectItem>
                <SelectItem value="videos">Most Videos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{creators.length} Creators Found</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : creators.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No creators found. Data will appear after the first sync.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Creator</TableHead>
                      <TableHead className="text-right">Followers</TableHead>
                      <TableHead className="text-right">GMV Driven</TableHead>
                      <TableHead className="text-right">Engagement</TableHead>
                      <TableHead className="text-right">Videos</TableHead>
                      <TableHead className="text-right">Market</TableHead>
                      <TableHead className="w-24"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creators.map((creator) => (
                      <TableRow key={creator.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={creator.avatarUrl || undefined} alt={creator.displayName} />
                              <AvatarFallback>{creator.displayName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium flex items-center gap-1">
                                {creator.displayName}
                                {creator.isVerified && (
                                  <Badge variant="secondary" className="text-xs">Verified</Badge>
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground">@{creator.username}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="font-semibold">
                            {creator.followers >= 1000000
                              ? `${(creator.followers / 1000000).toFixed(2)}M`
                              : `${(creator.followers / 1000).toFixed(0)}K`}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1 text-green-600 font-semibold">
                            <DollarSign className="h-4 w-4" />
                            {(creator.gmvDriven / 1000).toFixed(0)}K
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={creator.engagement > 8 ? "default" : "secondary"}
                            className={creator.engagement > 8 ? "bg-green-500" : ""}
                          >
                            {creator.engagement.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-medium">{creator.videoCount}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">{creator.locale}</Badge>
                        </TableCell>
                        <TableCell>
                          <a
                            href={creator.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {creators.map((creator) => (
                  <div
                    key={creator.id}
                    className="p-4 rounded-lg border"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={creator.avatarUrl || undefined} alt={creator.displayName} />
                        <AvatarFallback>{creator.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium flex items-center gap-1">
                          {creator.displayName}
                          {creator.isVerified && (
                            <Badge variant="secondary" className="text-xs">Verified</Badge>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">@{creator.username}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{creator.locale}</Badge>
                          {creator.isAffiliate && (
                            <Badge variant="secondary" className="text-xs">Affiliate</Badge>
                          )}
                        </div>
                      </div>
                      <a
                        href={creator.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Followers</p>
                        <p className="font-semibold">
                          {creator.followers >= 1000000
                            ? `${(creator.followers / 1000000).toFixed(1)}M`
                            : `${(creator.followers / 1000).toFixed(0)}K`}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">GMV</p>
                        <p className="font-semibold text-green-600">
                          ${(creator.gmvDriven / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Engagement</p>
                        <p className="font-semibold">{creator.engagement.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
