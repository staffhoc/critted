import Link from "next/link";
import { HelpArticleLayout } from "@/components/help-layout";

export default function FirstAlertArticle() {
  return (
    <HelpArticleLayout
      category="Alerts"
      categoryHref="/help/alerts"
      title="Setting Up Your First Alert"
      relatedArticles={[
        { title: "Alert Types Explained", href: "/help/articles/alert-types" },
        { title: "Understanding Velocity and Growth Metrics", href: "/help/articles/metrics" },
        { title: "Getting Started with Critted", href: "/help/articles/getting-started" },
      ]}
    >
      <p className="text-lg text-muted-foreground mb-6">
        Alerts are one of the most powerful features in Critted. They notify you automatically
        when products or sounds meet your criteria, so you never miss a trending opportunity.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Why Use Alerts?</h2>
      <p className="text-muted-foreground mb-4">
        Instead of manually checking Critted every hour, alerts do the work for you:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li>Get notified the moment a product&apos;s velocity spikes</li>
        <li>Know when a sound moves up in rankings</li>
        <li>Catch trends before they become saturated</li>
        <li>Track specific products or sounds you&apos;re interested in</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Step-by-Step: Creating Your First Alert</h2>

      <h3 className="text-xl font-medium mt-6 mb-3">Step 1: Go to Alerts</h3>
      <p className="text-muted-foreground mb-4">
        Click on <strong>Alerts</strong> in the sidebar navigation. You&apos;ll see your existing
        alerts (if any) and a button to create a new one.
      </p>

      <h3 className="text-xl font-medium mt-6 mb-3">Step 2: Click &quot;Create Alert&quot;</h3>
      <p className="text-muted-foreground mb-4">
        Click the <strong>Create Alert</strong> button to open the alert configuration form.
      </p>

      <h3 className="text-xl font-medium mt-6 mb-3">Step 3: Choose What to Track</h3>
      <p className="text-muted-foreground mb-4">
        You can create alerts for:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li><strong>Specific product/sound:</strong> Track a particular item from your watchlist</li>
        <li><strong>Category-wide:</strong> Track all products in a category (e.g., &quot;Beauty&quot;)</li>
        <li><strong>AI Predictions:</strong> Get notified when new high-confidence predictions appear</li>
      </ul>

      <h3 className="text-xl font-medium mt-6 mb-3">Step 4: Select a Metric</h3>
      <p className="text-muted-foreground mb-4">
        Choose what you want to be alerted about:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li><strong>Velocity:</strong> Sales per day exceed a threshold</li>
        <li><strong>Growth rate:</strong> Percentage growth exceeds a threshold</li>
        <li><strong>Rank change:</strong> Sound moves up by X positions</li>
        <li><strong>Commission change:</strong> Product commission rate changes</li>
      </ul>

      <h3 className="text-xl font-medium mt-6 mb-3">Step 5: Set Your Threshold</h3>
      <p className="text-muted-foreground mb-4">
        Define when the alert should trigger. For example:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li>&quot;Notify me when velocity exceeds <strong>500/day</strong>&quot;</li>
        <li>&quot;Notify me when growth rate exceeds <strong>50%</strong>&quot;</li>
        <li>&quot;Notify me when rank improves by <strong>10+ positions</strong>&quot;</li>
      </ul>

      <h3 className="text-xl font-medium mt-6 mb-3">Step 6: Choose Delivery Method</h3>
      <p className="text-muted-foreground mb-4">
        How do you want to receive alerts?
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li><strong>Email:</strong> Get alerts in your inbox</li>
        <li><strong>Push notification:</strong> Browser or mobile notifications</li>
        <li><strong>Both:</strong> Never miss an alert</li>
      </ul>

      <h3 className="text-xl font-medium mt-6 mb-3">Step 7: Save Your Alert</h3>
      <p className="text-muted-foreground mb-6">
        Click <strong>Save Alert</strong> and you&apos;re done! Your alert is now active and will
        trigger when your conditions are met.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Example Alert Setups</h2>

      <h3 className="text-xl font-medium mt-6 mb-3">For Product Hunters</h3>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li>Category: Beauty & Skincare</li>
        <li>Metric: Velocity</li>
        <li>Threshold: Above 300/day</li>
        <li>Delivery: Email + Push</li>
      </ul>
      <p className="text-muted-foreground mb-6">
        This alerts you whenever any beauty product hits 300 sales per day.
      </p>

      <h3 className="text-xl font-medium mt-6 mb-3">For Sound Chasers</h3>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li>Type: All sounds</li>
        <li>Metric: Rank change</li>
        <li>Threshold: Improves by 20+ positions</li>
        <li>Delivery: Push notification</li>
      </ul>
      <p className="text-muted-foreground mb-6">
        Get notified when any sound makes a big jump in rankings.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Alert Limits by Plan</h2>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li><strong>Free plan:</strong> 2 active alerts</li>
        <li><strong>Basic ($22/mo):</strong> Unlimited alerts</li>
        <li><strong>Strategy ($27/mo):</strong> Unlimited alerts</li>
      </ul>
      <p className="text-muted-foreground mb-6">
        <Link href="/billing" className="text-primary hover:underline">Upgrade your plan</Link> to create more alerts.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Managing Your Alerts</h2>
      <p className="text-muted-foreground mb-4">
        You can manage existing alerts at any time:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li><strong>Edit:</strong> Change thresholds or delivery settings</li>
        <li><strong>Pause:</strong> Temporarily disable without deleting</li>
        <li><strong>Delete:</strong> Remove an alert you no longer need</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Tips for Effective Alerts</h2>
      <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
        <li>Start with higher thresholds to avoid alert fatigue</li>
        <li>Use category alerts to discover new products</li>
        <li>Use specific product alerts for items you&apos;re actively promoting</li>
        <li>Review and adjust thresholds based on how many alerts you receive</li>
        <li>Enable push notifications for time-sensitive opportunities</li>
      </ol>
    </HelpArticleLayout>
  );
}
