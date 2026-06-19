"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  LayoutGrid,
  TrendingUp,
  TrendingDown,
  Package,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type Category = {
  id: string;
  name: string;
  slug: string;
  locale: string;
  productCount: number;
  avgCommission: number;
  growth: number;
  topProduct: string | null;
};

type CategoryStats = {
  totalCategories: number;
  totalProducts: number;
  avgGrowth: number;
  avgCommission: number;
};

// Category icons mapping
const categoryIcons: Record<string, string> = {
  "Beauty": "💄",
  "Beauty & Personal Care": "💄",
  "Electronics": "📱",
  "Fashion": "👗",
  "Home & Kitchen": "🏠",
  "Home & Living": "🛋️",
  "Home Decor": "🛋️",
  "Sports & Outdoors": "⚽",
  "Health & Wellness": "💊",
  "Baby & Kids": "👶",
  "Pet Supplies": "🐕",
  "Food & Beverages": "🍔",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<CategoryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
          setStats(data.stats || null);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
      setIsLoading(false);
    };

    fetchCategories();
  }, []);

  const maxProducts = categories.length > 0
    ? Math.max(...categories.map((c) => c.productCount))
    : 1;

  const getIcon = (name: string) => {
    return categoryIcons[name] || "📦";
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <LayoutGrid className="h-8 w-8" />
          Category Insights
        </h1>
        <p className="text-muted-foreground mt-1">
          Explore trends and performance across TikTok Shop categories
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : categories.length === 0 ? (
        <Card className="p-12 text-center">
          <LayoutGrid className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No categories found</h3>
          <p className="text-muted-foreground">
            Category data will appear after the first sync.
          </p>
        </Card>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <p className="text-sm text-muted-foreground mb-1">Total Categories</p>
                <p className="text-2xl font-bold">{stats?.totalCategories || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <p className="text-sm text-muted-foreground mb-1">Total Products</p>
                <p className="text-2xl font-bold">
                  {(stats?.totalProducts || 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <p className="text-sm text-muted-foreground mb-1">Avg Growth</p>
                <p className={`text-2xl font-bold ${(stats?.avgGrowth || 0) >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {(stats?.avgGrowth || 0) >= 0 ? "+" : ""}
                  {(stats?.avgGrowth || 0).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <p className="text-sm text-muted-foreground mb-1">Avg Commission</p>
                <p className="text-2xl font-bold">
                  {(stats?.avgCommission || 0).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Category Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getIcon(category.name)}</span>
                      <CardTitle>{category.name}</CardTitle>
                    </div>
                    <Badge
                      variant={category.growth > 20 ? "default" : "secondary"}
                      className={category.growth > 20 ? "bg-green-500" : ""}
                    >
                      {category.growth > 0 ? "+" : ""}
                      {category.growth.toFixed(1)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Products Bar */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Products</span>
                      <span className="font-medium">{category.productCount.toLocaleString()}</span>
                    </div>
                    <Progress value={(category.productCount / maxProducts) * 100} className="h-2" />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Commission</p>
                      <p className="font-semibold">{category.avgCommission.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Trend</p>
                      <div className="flex items-center gap-1">
                        {category.growth > 0 ? (
                          <>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="font-semibold text-green-500">Rising</span>
                          </>
                        ) : category.growth < 0 ? (
                          <>
                            <TrendingDown className="h-4 w-4 text-red-500" />
                            <span className="font-semibold text-red-500">Falling</span>
                          </>
                        ) : (
                          <span className="font-semibold text-muted-foreground">Stable</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Top Product */}
                  {category.topProduct && (
                    <div className="pt-3 border-t">
                      <p className="text-sm text-muted-foreground mb-1">Top Product</p>
                      <p className="font-medium truncate">{category.topProduct}</p>
                    </div>
                  )}

                  {/* Action */}
                  <Link href={`/products?category=${encodeURIComponent(category.name)}`}>
                    <Button variant="outline" className="w-full">
                      <Package className="h-4 w-4 mr-2" />
                      View Products
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
