import { Package } from "lucide-react";
import { HelpCategoryLayout } from "@/components/help-layout";

const articles = [
  {
    title: "Finding Trending Products",
    description: "Learn how to discover products that are gaining momentum on TikTok Shop",
    href: "/help/articles/finding-trending-products",
  },
  {
    title: "Understanding Product Velocity",
    description: "What velocity means and how to use it to spot winning products",
    href: "/help/articles/metrics",
  },
  {
    title: "How to Find High-Commission Products",
    description: "Filter and sort products by commission rate to maximize earnings",
    href: "/help/articles/high-commission",
  },
  {
    title: "Product Categories Explained",
    description: "Overview of all product categories and how to navigate them",
    href: "/help/articles/product-categories",
  },
  {
    title: "Tracking Product Performance",
    description: "How to add products to your watchlist and monitor their growth",
    href: "/help/articles/tracking-products",
  },
  {
    title: "Reading Product Analytics",
    description: "Understanding the charts and data on product detail pages",
    href: "/help/articles/product-analytics",
  },
  {
    title: "Comparing Products",
    description: "How to compare multiple products side by side",
    href: "/help/articles/comparing-products",
  },
  {
    title: "Product History and Trends",
    description: "Accessing historical data to understand product performance over time",
    href: "/help/articles/product-history",
  },
];

export default function HelpProductsPage() {
  return (
    <HelpCategoryLayout
      icon={<Package className="h-7 w-7 text-primary" />}
      title="Products"
      description="Everything you need to know about finding and tracking trending products"
      articles={articles}
    />
  );
}
