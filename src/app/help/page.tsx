import Link from "next/link";
import {
  TrendingUp,
  Search,
  HelpCircle,
  BookOpen,
  MessageCircle,
  Mail,
  ChevronRight,
  Package,
  Music,
  Bell,
  CreditCard,
  Settings,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicNavbar } from "@/components/public-navbar";

const categories = [
  {
    icon: Package,
    title: "Products",
    description: "Finding and tracking trending products",
    articles: 12,
    href: "/help/products",
  },
  {
    icon: Music,
    title: "Sounds",
    description: "Discovering viral sounds and music",
    articles: 8,
    href: "/help/sounds",
  },
  {
    icon: Bell,
    title: "Alerts",
    description: "Setting up and managing notifications",
    articles: 6,
    href: "/help/alerts",
  },
  {
    icon: CreditCard,
    title: "Billing",
    description: "Subscriptions, payments, and invoices",
    articles: 10,
    href: "/help/billing",
  },
  {
    icon: Settings,
    title: "Account",
    description: "Profile settings and preferences",
    articles: 9,
    href: "/help/account",
  },
  {
    icon: Zap,
    title: "AI Features",
    description: "Video generator, strategy assistant, and more",
    articles: 7,
    href: "/help/ai",
  },
];

const popularArticles = [
  {
    title: "Getting Started with Critted",
    category: "Basics",
    href: "/help/articles/getting-started",
  },
  {
    title: "How to Find High-Commission Products",
    category: "Products",
    href: "/help/articles/high-commission",
  },
  {
    title: "Setting Up Your First Alert",
    category: "Alerts",
    href: "/help/articles/first-alert",
  },
  {
    title: "Understanding Velocity and Growth Metrics",
    category: "Analytics",
    href: "/help/articles/metrics",
  },
  {
    title: "Upgrading to Pro Plan",
    category: "Billing",
    href: "/help/articles/upgrade",
  },
  {
    title: "Using AI Predictions",
    category: "AI Features",
    href: "/help/articles/predictions",
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              How can we help you?
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Search our knowledge base or browse categories below
            </p>
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for help..."
                className="h-14 pl-12 text-lg rounded-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl font-bold mb-8">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.title} href={category.href}>
                  <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{category.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {category.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {category.articles} articles
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl font-bold mb-8">Popular Articles</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
            {popularArticles.map((article) => (
              <Link key={article.title} href={article.href}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{article.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {article.category}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
            <p className="text-muted-foreground mb-8">
              Our support team is here to help you succeed on TikTok Shop
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/help/contact">
                <Button size="lg" className="w-full sm:w-auto">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contact Support
                </Button>
              </Link>
              <a href="mailto:support@critted.com">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">Critted Help</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <Link href="/help" className="hover:text-foreground">
                Help Center
              </Link>
              <Link href="/help/contact" className="hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
