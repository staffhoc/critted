"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Package,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  DollarSign,
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

type Product = {
  id: string;
  externalId: string;
  title: string;
  imageUrl: string | null;
  price: number;
  originalPrice: number | null;
  currency: string;
  commissionPct: number;
  shopId: string | null;
  shopName: string;
  shopLogo: string | null;
  categoryId: string | null;
  category: string;
  locale: string;
  sold: number;
  soldDelta: number;
  velocity: number;
  growthRate: number;
  rank: number | null;
  rankChange: number;
  avgRating: number | null;
  reviewCount: number;
  productUrl: string;
  lastUpdatedAt: string;
};

const categories = [
  "All Categories",
  "Beauty & Personal Care",
  "Fashion",
  "Home & Living",
  "Electronics",
  "Food & Beverages",
  "Health & Wellness",
  "Sports & Outdoors",
  "Baby & Kids",
  "Pet Supplies",
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [locale, setLocale] = useState("all");
  const [category, setCategory] = useState("All Categories");
  const [signalMode, setSignalMode] = useState("rising");
  const [sortBy, setSortBy] = useState("velocity");
  const [savedProducts, setSavedProducts] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("search", searchQuery);
        if (locale !== "all") params.set("locale", locale);
        if (category !== "All Categories") params.set("category", category);
        params.set("sortBy", sortBy);
        params.set("limit", "50");

        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
          setTotal(data.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, [searchQuery, locale, category, sortBy]);

  const filteredProducts = signalMode === "rising"
    ? products.filter((p) => p.growthRate > 0)
    : products;

  const toggleSave = (id: string) => {
    setSavedProducts((prev) =>
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
            <Package className="h-8 w-8" />
            High-Mover Products
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover products with the highest sales velocity on TikTok Shop
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {total} products
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
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
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category Filter */}
              <Select value={category} onValueChange={(val) => val && setCategory(val)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
                  <SelectItem value="velocity">Highest Velocity</SelectItem>
                  <SelectItem value="commission">Highest Commission</SelectItem>
                  <SelectItem value="sold">Most Sold</SelectItem>
                  <SelectItem value="growth">Fastest Growth</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="shrink-0">
                <Filter className="h-4 w-4 mr-1" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{filteredProducts.length} Products Found</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No products found. Data will appear after the first sync.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Sold</TableHead>
                      <TableHead className="text-right">Velocity</TableHead>
                      <TableHead className="text-right">Commission</TableHead>
                      <TableHead className="text-right">Est. Earnings</TableHead>
                      <TableHead className="text-right">Growth</TableHead>
                      <TableHead className="w-24"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id} className="group">
                        <TableCell>
                          <Link
                            href={`/products/${product.id}`}
                            className="flex items-center gap-3 hover:opacity-80"
                          >
                            <Avatar className="h-12 w-12 rounded-lg">
                              <AvatarImage src={product.imageUrl || undefined} alt={product.title} />
                              <AvatarFallback>{product.title[0]}</AvatarFallback>
                            </Avatar>
                            <div className="max-w-[200px]">
                              <p className="font-medium truncate">{product.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {product.shopName} • {product.category}
                              </p>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ${product.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            <p className="font-semibold">{product.sold.toLocaleString()}</p>
                            <p className="text-sm text-green-500">
                              +{product.soldDelta.toLocaleString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">{product.velocity}/day</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={product.commissionPct >= 15 ? "default" : "secondary"}
                            className={product.commissionPct >= 15 ? "bg-green-500" : ""}
                          >
                            {product.commissionPct}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1 text-green-600 font-semibold">
                            <DollarSign className="h-3 w-3" />
                            {((product.price * product.commissionPct) / 100).toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div
                            className={`flex items-center justify-end gap-1 ${
                              product.growthRate > 0 ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {product.growthRate > 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            <span className="font-semibold">
                              {product.growthRate > 0 ? "+" : ""}
                              {product.growthRate.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleSave(product.id)}
                            >
                              {savedProducts.includes(product.id) ? (
                                <BookmarkCheck className="h-4 w-4 text-primary" />
                              ) : (
                                <Bookmark className="h-4 w-4" />
                              )}
                            </Button>
                            <a
                              href={product.productUrl}
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
              <div className="lg:hidden space-y-4">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="block p-4 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16 rounded-lg shrink-0">
                        <AvatarImage src={product.imageUrl || undefined} alt={product.title} />
                        <AvatarFallback>{product.title[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium line-clamp-2">{product.title}</p>
                        <p className="text-sm text-muted-foreground mb-2">
                          {product.shopName} • {product.category}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold">${product.price.toFixed(2)}</span>
                          <Badge
                            variant={product.commissionPct >= 15 ? "default" : "secondary"}
                            className={product.commissionPct >= 15 ? "bg-green-500" : ""}
                          >
                            {product.commissionPct}%
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {product.sold.toLocaleString()} sold
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div
                          className={`flex items-center gap-1 ${
                            product.growthRate > 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {product.growthRate > 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <span className="font-semibold">
                            {product.growthRate > 0 ? "+" : ""}
                            {product.growthRate.toFixed(1)}%
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {product.velocity}/day
                        </p>
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
