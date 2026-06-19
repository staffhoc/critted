import { HelpArticleLayout } from "@/components/help-layout";

export default function GettingStartedArticle() {
  return (
    <HelpArticleLayout
      category="Account"
      categoryHref="/help/account"
      title="Getting Started with Critted"
      relatedArticles={[
        { title: "How to Find High-Commission Products", href: "/help/articles/high-commission" },
        { title: "Setting Up Your First Alert", href: "/help/articles/first-alert" },
        { title: "Understanding Velocity and Growth Metrics", href: "/help/articles/metrics" },
      ]}
    >
      <p className="text-lg text-muted-foreground mb-6">
        Welcome to Critted! This guide will help you get up and running quickly so you can
        start discovering trending products and sounds on TikTok Shop.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Step 1: Complete Your Profile</h2>
      <p className="text-muted-foreground mb-4">
        After signing up, you&apos;ll go through a quick onboarding process where you&apos;ll tell us:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li><strong>Your role:</strong> Are you an affiliate creator or a TikTok Shop seller?</li>
        <li><strong>Your follower count:</strong> This helps us tailor recommendations to your account size</li>
        <li><strong>Your niche:</strong> We&apos;ll prioritize products and sounds in your content area</li>
        <li><strong>Your market:</strong> Choose between US, UK, or other TikTok Shop markets</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Step 2: Explore the Dashboard</h2>
      <p className="text-muted-foreground mb-4">
        Your dashboard is your command center. Here&apos;s what you&apos;ll find:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li><strong>High-Mover Products:</strong> Products with the highest sales velocity right now</li>
        <li><strong>Trending Sounds:</strong> Sounds that are gaining traction on TikTok</li>
        <li><strong>Before Saturation:</strong> AI predictions for items about to go viral</li>
        <li><strong>Your Watchlist:</strong> Items you&apos;re tracking</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Step 3: Find Your First Product</h2>
      <p className="text-muted-foreground mb-4">
        Navigate to the <strong>Products</strong> page to browse all trending products. You can:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li>Filter by category, commission rate, and price range</li>
        <li>Sort by velocity, growth rate, or commission</li>
        <li>Click on any product to see detailed analytics and history</li>
        <li>Add products to your watchlist by clicking the bookmark icon</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Step 4: Set Up Alerts</h2>
      <p className="text-muted-foreground mb-4">
        Don&apos;t miss opportunities! Set up alerts to get notified when:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li>A product&apos;s velocity spikes above a threshold</li>
        <li>A sound moves up significantly in rankings</li>
        <li>An item you&apos;re watching shows unusual growth</li>
      </ul>
      <p className="text-muted-foreground mb-6">
        Go to <strong>Alerts</strong> in the sidebar to create your first alert rule.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Step 5: Understand Key Metrics</h2>
      <p className="text-muted-foreground mb-4">
        Critted uses several key metrics to help you identify opportunities:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li><strong>Velocity:</strong> Number of sales per day - higher is better</li>
        <li><strong>Growth Rate:</strong> Percentage increase in sales compared to previous period</li>
        <li><strong>Commission:</strong> What percentage you earn per sale as an affiliate</li>
        <li><strong>Rank Delta:</strong> How much a sound has moved up or down in rankings</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Free vs. Paid Plans</h2>
      <p className="text-muted-foreground mb-4">
        On the free plan, you can:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li>View up to 5 products per day</li>
        <li>Access 7 days of historical data</li>
        <li>Set up 2 alert rules</li>
        <li>Track 1 market (US or UK)</li>
      </ul>
      <p className="text-muted-foreground mb-6">
        Upgrade to <strong>Basic ($22/mo)</strong> for unlimited access, or <strong>Strategy ($27/mo)</strong>
        to also get AI-powered growth strategies personalized to your account.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Need Help?</h2>
      <p className="text-muted-foreground">
        If you have questions, check out our other help articles or contact our support team.
        We&apos;re here to help you succeed on TikTok Shop!
      </p>
    </HelpArticleLayout>
  );
}
