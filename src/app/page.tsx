import Link from "next/link";
import {
  TrendingUp,
  Music,
  Package,
  Sparkles,
  Bell,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Zap,
  Target,
  Users,
  Check,
  Crown,
  Brain,
  Calendar,
  X,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PublicNavbar } from "@/components/public-navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 lg:py-32">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#fe2c55]/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="container px-4 mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="text-center lg:text-left">
              <Badge className="mb-6 py-2 px-4" variant="secondary">
                <Sparkles className="h-3.5 w-3.5 mr-2 text-primary" />
                Land Critical Hits on TikTok Trends
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                Find{" "}
                <span className="relative">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#fe2c55] to-primary">
                    Trending Products
                  </span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-[#fe2c55]/20 -z-0" />
                </span>{" "}
                Before They Go Viral
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                Critted helps TikTok creators and sellers discover high-commission products,
                trending sounds, and viral opportunities — strike at the perfect moment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/login?signup=true">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-lg px-8 bg-[#fe2c55] hover:bg-[#fe2c55]/90"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 group">
                    <Play className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                    See How It Works
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right - Dashboard Preview */}
            <div className="relative hidden lg:block">
              {/* Main Card */}
              <Card className="border-2 shadow-2xl">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="p-4 border-b bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-semibold">Critted</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">Live Data</Badge>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      High-Mover Products
                    </h4>
                    {[
                      { name: "LED Ring Light Pro", sales: "816/day", growth: "+28.9%", commission: "18%", img: "1" },
                      { name: "Vitamin C Serum", sales: "654/day", growth: "+45.2%", commission: "22%", img: "2" },
                      { name: "Wireless Earbuds", sales: "542/day", growth: "+12.8%", commission: "15%", img: "3" },
                    ].map((product, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <Avatar className="h-10 w-10 rounded-lg">
                          <AvatarImage src={`https://picsum.photos/seed/prod${product.img}/100`} />
                          <AvatarFallback>{product.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.sales}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-green-500 font-medium">{product.growth}</p>
                          <p className="text-xs text-muted-foreground">{product.commission} com</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Floating Sound Card */}
              <Card className="absolute -left-16 top-24 w-56 border shadow-xl animate-float">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Music className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">Trending Sound</p>
                      <p className="text-[10px] text-muted-foreground">+312 positions</p>
                    </div>
                  </div>
                  <p className="text-xs truncate">&quot;Original sound - viral beat&quot;</p>
                </CardContent>
              </Card>

              {/* Floating Alert Card */}
              <Card className="absolute -right-8 bottom-20 w-52 border shadow-xl animate-float-delayed">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-[#fe2c55]/10 flex items-center justify-center">
                      <Bell className="h-4 w-4 text-[#fe2c55]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">Velocity Alert!</p>
                      <p className="text-[10px] text-muted-foreground">Ring Light hit 500/day</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Prediction Card */}
              <Card className="absolute -left-8 -bottom-4 w-48 border shadow-xl animate-float">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <p className="text-xs font-medium">AI Prediction</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">87% confidence</p>
                  <p className="text-xs mt-1">Peak in 5 days</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Win on TikTok Shop
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools for creators and sellers to find, analyze, and capitalize on trends.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Package,
                title: "High-Mover Products",
                description:
                  "Discover products with the highest sales velocity and growth rate. Filter by commission, category, and price range.",
                color: "bg-blue-500/10 text-blue-500",
              },
              {
                icon: Music,
                title: "Trending Sounds",
                description:
                  "Find the sounds that are blowing up right now. Get rank changes, video counts, and growth metrics in real-time.",
                color: "bg-purple-500/10 text-purple-500",
              },
              {
                icon: Target,
                title: "Commission Optimizer",
                description:
                  "Focus on products that pay the most. Sort by commission percentage and estimated earnings per sale.",
                color: "bg-green-500/10 text-green-500",
              },
              {
                icon: Sparkles,
                title: "Predictive Insights",
                description:
                  "Our AI detects products and sounds in the early acceleration window — catch trends before saturation.",
                color: "bg-yellow-500/10 text-yellow-500",
              },
              {
                icon: Bell,
                title: "Smart Alerts",
                description:
                  "Get notified when your watched items cross velocity or rank thresholds. Never miss a breakout opportunity.",
                color: "bg-red-500/10 text-red-500",
              },
              {
                icon: BarChart3,
                title: "Historical Charts",
                description:
                  "See the complete history of any product or sound. Analyze patterns and make data-driven decisions.",
                color: "bg-cyan-500/10 text-cyan-500",
              },
            ].map((feature) => (
              <Card key={feature.title} className="group border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className={`h-12 w-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Finding Trends in 3 Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Sign Up Free",
                description: "Create your account in seconds with Google or TikTok. No credit card required.",
              },
              {
                step: "2",
                title: "Discover Trends",
                description: "Browse trending products, sounds, and AI predictions tailored to your niche.",
              },
              {
                step: "3",
                title: "Take Action",
                description: "Promote products, use trending sounds, and watch your TikTok presence grow.",
              },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                  {item.step}
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-muted-foreground/30" />
                )}
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">For Everyone</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Creators & Sellers</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you&apos;re promoting products or selling them, Critted has the tools you need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all group overflow-hidden">
              <CardContent className="p-0">
                <div className="p-8">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#fe2c55] to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">For Affiliate Creators</h3>
                  <ul className="space-y-3">
                    {[
                      "Find high-commission products to promote",
                      "Discover trending sounds for your videos",
                      "Track which products are converting",
                      "Get alerts on breakout opportunities",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="h-2 w-full bg-gradient-to-r from-[#fe2c55] to-pink-600" />
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all group overflow-hidden">
              <CardContent className="p-0">
                <div className="p-8">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">For TikTok Shop Sellers</h3>
                  <ul className="space-y-3">
                    {[
                      "Spot winning products and niches",
                      "Track competitor shops and pricing",
                      "Analyze category-level trends",
                      "Benchmark your performance",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-cyan-500" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Strategy Feature Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-[#fe2c55]/5" />

        <div className="container px-4 mx-auto relative">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4" variant="secondary">
                  <Brain className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Personalized Growth Strategy
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Stop guessing what to do next. Our AI analyzes your account and generates
                  actionable 7, 30, 60, and 90-day strategies tailored to your goals.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    {
                      title: "Account Analysis",
                      description: "We consider your follower count, account age, and niche focus",
                    },
                    {
                      title: "Specific Actions",
                      description: "Get exact products to promote and sounds to use each week",
                    },
                    {
                      title: "Adaptive Plans",
                      description: "Strategies evolve based on what's trending right now",
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link href="/login?signup=true">
                  <Button size="lg" className="bg-[#fe2c55] hover:bg-[#fe2c55]/90">
                    Try Strategy Builder
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <Card className="border-2 shadow-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Your 7-Day Strategy</h3>
                      <Badge variant="secondary">Week 1</Badge>
                    </div>
                    <div className="space-y-4">
                      <div className="p-3 rounded-lg bg-muted/50 border">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-6 w-6 rounded bg-purple-500/10 flex items-center justify-center">
                            <Music className="h-3 w-3 text-purple-500" />
                          </div>
                          <span className="text-sm font-medium">Sound to Use</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          &quot;Original sound - viral beat&quot; <span className="text-green-500 font-medium">+312%</span>
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 border">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-6 w-6 rounded bg-blue-500/10 flex items-center justify-center">
                            <Package className="h-3 w-3 text-blue-500" />
                          </div>
                          <span className="text-sm font-medium">Product to Promote</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          LED Ring Light - $4.50 commission <span className="text-green-500 font-medium">18% growth</span>
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 border">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-6 w-6 rounded bg-orange-500/10 flex items-center justify-center">
                            <Calendar className="h-3 w-3 text-orange-500" />
                          </div>
                          <span className="text-sm font-medium">Content Plan</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          3 videos this week: Unboxing, Demo, Review
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-[#fe2c55]/10 border border-[#fe2c55]/20">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="h-4 w-4 text-[#fe2c55]" />
                          <span className="text-sm font-medium text-[#fe2c55]">Week 1 Goal</span>
                        </div>
                        <p className="text-sm">Hit 1,000 views on at least 1 video</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-xl bg-gradient-to-br from-primary/10 to-[#fe2c55]/10 border-2 border-dashed border-primary/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">Pricing</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free, upgrade when you&apos;re ready. Half the price of competitors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="relative border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <Zap className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold">Free</h3>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">
                  Perfect for exploring and getting started
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    { text: "1 market (US or UK)", included: true },
                    { text: "5 products per day", included: true },
                    { text: "7-day history", included: true },
                    { text: "2 alert rules", included: true },
                    { text: "Basic trend data", included: true },
                    { text: "AI Strategy Builder", included: false },
                  ].map((feature) => (
                    <li key={feature.text} className="flex items-center gap-2 text-sm">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                      )}
                      <span className={feature.included ? "" : "text-muted-foreground/50"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button variant="outline" className="w-full">
                    Get Started Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Basic Plan */}
            <Card className="relative border-2 border-primary shadow-xl scale-105">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary shadow-lg">Most Popular</Badge>
              </div>
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Crown className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Basic</h3>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$22</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">
                  Full access for serious creators and sellers
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    { text: "All markets included", included: true },
                    { text: "Unlimited products", included: true },
                    { text: "Full history access", included: true },
                    { text: "Unlimited alert rules", included: true },
                    { text: "AI Predictions", included: true },
                    { text: "Priority support", included: true },
                    { text: "AI Strategy Builder", included: false },
                  ].map((feature) => (
                    <li key={feature.text} className="flex items-center gap-2 text-sm">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                      )}
                      <span className={feature.included ? "" : "text-muted-foreground/50"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button className="w-full bg-[#fe2c55] hover:bg-[#fe2c55]/90">
                    Start 7-Day Free Trial
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Strategy Plan */}
            <Card className="relative border-2 hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="secondary" className="shadow">
                  <Brain className="h-3 w-3 mr-1" />
                  + AI Strategy
                </Badge>
              </div>
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-bold">Strategy</h3>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$27</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">
                  Everything in Basic + personalized AI strategies
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    { text: "Everything in Basic", included: true },
                    { text: "7/30/60/90-day strategies", included: true },
                    { text: "Personalized action plans", included: true },
                    { text: "Weekly sound & product picks", included: true },
                    { text: "Content calendar", included: true },
                    { text: "Goal tracking", included: true },
                  ].map((feature) => (
                    <li key={feature.text} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button variant="outline" className="w-full">
                    Start 7-Day Free Trial
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Comparison note */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Compare: Kalodata starts at $50/mo, FastMoss at $50/mo. Critted gives you more for less.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">FAQ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: "Where does Critted get its data?",
                a: "We aggregate data from multiple sources including TikTok's public APIs and third-party data providers to give you the most comprehensive view of trends.",
              },
              {
                q: "How accurate are the AI predictions?",
                a: "Our high-confidence predictions (90%+) are accurate about 85% of the time. We continuously improve our models based on outcomes.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes! No contracts, no commitments. Cancel anytime and your subscription will end at the next billing date.",
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 7-day money-back guarantee on all paid plans. If you're not satisfied, contact us for a full refund.",
              },
            ].map((faq) => (
              <Card key={faq.q} className="border-2">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/10 via-background to-[#fe2c55]/10 rounded-3xl p-12 border-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/5" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Find Your Next Viral Product?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of creators and sellers using Critted to stay ahead of the competition.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login?signup=true">
                  <Button
                    size="lg"
                    className="text-lg px-8 bg-[#fe2c55] hover:bg-[#fe2c55]/90"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/help">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Learn More
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card required. Free plan available forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-foreground">Critted</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The #1 TikTok Shop intelligence platform for creators and sellers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="/help" className="hover:text-foreground">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help/contact" className="hover:text-foreground">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Get Started</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/signup" className="hover:text-foreground">Sign Up Free</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Log In</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; 2026 Critted. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="/help/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
