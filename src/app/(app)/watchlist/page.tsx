"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bookmark,
  Package,
  Music,
  Store,
  Search,
  Trash2,
  Bell,
  ExternalLink,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockWatchlist } from "@/lib/mock-data";

export default function WatchlistPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState(mockWatchlist);

  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const productItems = filteredItems.filter((i) => i.itemType === "PRODUCT");
  const soundItems = filteredItems.filter((i) => i.itemType === "SOUND");
  const shopItems = filteredItems.filter((i) => i.itemType === "SHOP");

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const getItemLink = (item: typeof mockWatchlist[0]) => {
    if (item.itemType === "PRODUCT") return `/products/${item.itemId}`;
    if (item.itemType === "SOUND") return `/sounds/${item.itemId}`;
    return `/shops/${item.itemId}`;
  };

  const getItemIcon = (type: string) => {
    if (type === "PRODUCT") return Package;
    if (type === "SOUND") return Music;
    return Store;
  };

  const WatchlistItem = ({ item }: { item: typeof mockWatchlist[0] }) => {
    const Icon = getItemIcon(item.itemType);
    return (
      <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
        <Avatar className="h-14 w-14 rounded-lg">
          <AvatarImage src={item.itemImage} alt={item.itemName} />
          <AvatarFallback>
            <Icon className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <Link
            href={getItemLink(item)}
            className="font-medium hover:text-primary truncate block"
          >
            {item.itemName}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              <Icon className="h-3 w-3 mr-1" />
              {item.itemType}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Added {new Date(item.addedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" title="Set Alert">
            <Bell className="h-4 w-4" />
          </Button>
          <Link
            href={getItemLink(item)}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => removeItem(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bookmark className="h-8 w-8" />
            Your Watchlist
          </h1>
          <p className="text-muted-foreground mt-1">
            Items you&apos;re tracking for updates and alerts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{items.length} items</Badge>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your watchlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Watchlist Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All ({filteredItems.length})</TabsTrigger>
              <TabsTrigger value="products">Products ({productItems.length})</TabsTrigger>
              <TabsTrigger value="sounds">Sounds ({soundItems.length})</TabsTrigger>
              <TabsTrigger value="shops">Shops ({shopItems.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => <WatchlistItem key={item.id} item={item} />)
              ) : (
                <EmptyState />
              )}
            </TabsContent>

            <TabsContent value="products" className="space-y-3">
              {productItems.length > 0 ? (
                productItems.map((item) => <WatchlistItem key={item.id} item={item} />)
              ) : (
                <EmptyState type="products" />
              )}
            </TabsContent>

            <TabsContent value="sounds" className="space-y-3">
              {soundItems.length > 0 ? (
                soundItems.map((item) => <WatchlistItem key={item.id} item={item} />)
              ) : (
                <EmptyState type="sounds" />
              )}
            </TabsContent>

            <TabsContent value="shops" className="space-y-3">
              {shopItems.length > 0 ? (
                shopItems.map((item) => <WatchlistItem key={item.id} item={item} />)
              ) : (
                <EmptyState type="shops" />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState({ type }: { type?: string }) {
  return (
    <div className="text-center py-12">
      <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="font-semibold text-lg mb-2">No {type || "items"} in your watchlist</h3>
      <p className="text-muted-foreground mb-4">
        Start by browsing {type || "products, sounds, or shops"} and saving items you want to track
      </p>
      <div className="flex justify-center gap-3">
        <Link href="/products">
          <Button variant="outline">Browse Products</Button>
        </Link>
        <Link href="/sounds">
          <Button variant="outline">Browse Sounds</Button>
        </Link>
      </div>
    </div>
  );
}
