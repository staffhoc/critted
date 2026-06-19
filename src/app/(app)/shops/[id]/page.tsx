"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Store,
  ArrowLeft,
  Star,
  Package,
  TrendingUp,
  Eye,
  Bell,
  ExternalLink,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockShops, mockProducts } from "@/lib/mock-data";

export default function ShopDetailPage() {
  const params = useParams();
  const shop = mockShops.find((s) => s.id === params.id) || mockShops[0];
  const shopProducts = mockProducts.slice(0, 4);

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Back Link */}
      <Link
        href="/shops"
        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Shops
      </Link>

      {/* Shop Header */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl">
              <AvatarImage src={shop.logoUrl} alt={shop.name} />
              <AvatarFallback className="text-3xl">{shop.name[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{shop.locale}</Badge>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-medium">{shop.avgRating}</span>
                    </div>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{shop.name}</h1>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Products</p>
                  <p className="text-xl font-bold">{shop.totalProducts}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <p className="text-xl font-bold">{(shop.totalSales / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  <p className="text-xl font-bold">{shop.avgRating}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Est. Revenue</p>
                  <p className="text-xl font-bold text-green-600">$1.2M</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button>
                  <Eye className="h-4 w-4 mr-2" />
                  Track Shop
                </Button>
                <Button variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Set Alert
                </Button>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-8 gap-1.5 px-2.5 rounded-lg border border-border bg-background hover:bg-muted text-sm font-medium transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  View on TikTok
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shop Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Shop Products
          </CardTitle>
          <CardDescription>Top performing products from this shop</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {shopProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="p-4 rounded-lg border hover:bg-muted transition-colors"
              >
                <Avatar className="h-20 w-20 rounded-lg mb-3">
                  <AvatarImage src={product.imageUrl} alt={product.title} />
                  <AvatarFallback>
                    <Package className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium line-clamp-2 text-sm mb-2">{product.title}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold">${product.price.toFixed(2)}</span>
                  <div className="flex items-center gap-1 text-green-500 text-sm">
                    <TrendingUp className="h-3 w-3" />
                    +{product.growthRate.toFixed(0)}%
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {product.sold.toLocaleString()} sold
                </p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
