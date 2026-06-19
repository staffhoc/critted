import Link from "next/link";
import { HelpArticleLayout } from "@/components/help-layout";

export default function UpgradeArticle() {
  return (
    <HelpArticleLayout
      category="Billing"
      categoryHref="/help/billing"
      title="Upgrading to a Paid Plan"
      relatedArticles={[
        { title: "Free Tier Limits", href: "/help/articles/free-tier" },
        { title: "Strategy Plan Features", href: "/help/articles/strategy-plan" },
        { title: "Managing Your Subscription", href: "/help/articles/managing-subscription" },
      ]}
    >
      <p className="text-lg text-muted-foreground mb-6">
        Ready to unlock the full power of Critted? This guide walks you through the upgrade
        process and helps you choose the right plan for your needs.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Plan Comparison</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 pr-4">Feature</th>
              <th className="text-center py-3 px-4">Free</th>
              <th className="text-center py-3 px-4">Basic ($22/mo)</th>
              <th className="text-center py-3 px-4">Strategy ($27/mo)</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b">
              <td className="py-3 pr-4">Products per day</td>
              <td className="text-center py-3 px-4">5</td>
              <td className="text-center py-3 px-4">Unlimited</td>
              <td className="text-center py-3 px-4">Unlimited</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 pr-4">Markets</td>
              <td className="text-center py-3 px-4">1</td>
              <td className="text-center py-3 px-4">All</td>
              <td className="text-center py-3 px-4">All</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 pr-4">History</td>
              <td className="text-center py-3 px-4">7 days</td>
              <td className="text-center py-3 px-4">Full</td>
              <td className="text-center py-3 px-4">Full</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 pr-4">Alert rules</td>
              <td className="text-center py-3 px-4">2</td>
              <td className="text-center py-3 px-4">Unlimited</td>
              <td className="text-center py-3 px-4">Unlimited</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 pr-4">AI Predictions</td>
              <td className="text-center py-3 px-4">Limited</td>
              <td className="text-center py-3 px-4">Full access</td>
              <td className="text-center py-3 px-4">Full access</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 pr-4">AI Strategy Builder</td>
              <td className="text-center py-3 px-4">-</td>
              <td className="text-center py-3 px-4">-</td>
              <td className="text-center py-3 px-4">Included</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Which Plan Should You Choose?</h2>

      <h3 className="text-xl font-medium mt-6 mb-3">Choose Basic ($22/mo) if you:</h3>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li>Need unlimited access to products and sounds</li>
        <li>Want to track multiple TikTok Shop markets</li>
        <li>Need full historical data for better analysis</li>
        <li>Want unlimited alert rules</li>
        <li>Value AI predictions to find trends early</li>
      </ul>

      <h3 className="text-xl font-medium mt-6 mb-3">Choose Strategy ($27/mo) if you:</h3>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li>Want everything in Basic, plus...</li>
        <li>Need personalized growth strategies for your account</li>
        <li>Want AI-curated weekly product and sound picks</li>
        <li>Need content calendars and posting schedules</li>
        <li>Are serious about growing your TikTok presence</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">How to Upgrade</h2>
      <ol className="list-decimal pl-6 text-muted-foreground space-y-2 mb-6">
        <li>Go to <Link href="/billing" className="text-primary hover:underline">Billing</Link> in the sidebar</li>
        <li>Review the plan options</li>
        <li>Click <strong>Upgrade</strong> on your preferred plan</li>
        <li>Enter your payment information</li>
        <li>Confirm your subscription</li>
      </ol>
      <p className="text-muted-foreground mb-6">
        Your new plan activates immediately, and you&apos;ll have full access to all features right away.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Payment Methods</h2>
      <p className="text-muted-foreground mb-4">
        We accept the following payment methods:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li>All major credit and debit cards (Visa, Mastercard, Amex)</li>
        <li>PayPal</li>
        <li>Apple Pay and Google Pay</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Billing Cycle</h2>
      <p className="text-muted-foreground mb-4">
        All plans are billed monthly:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li>Your billing date is the day you first subscribe</li>
        <li>You&apos;ll be charged on the same date each month</li>
        <li>You can cancel anytime before your next billing date</li>
        <li>No long-term contracts or commitments</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Switching Plans</h2>
      <p className="text-muted-foreground mb-4">
        You can upgrade or downgrade at any time:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li><strong>Upgrading:</strong> Takes effect immediately. You&apos;ll be charged a prorated amount.</li>
        <li><strong>Downgrading:</strong> Takes effect at the end of your current billing period.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Our Guarantee</h2>
      <p className="text-muted-foreground mb-6">
        We&apos;re confident you&apos;ll love Critted. If you&apos;re not satisfied within the first 7 days
        of your paid subscription, contact us for a full refund - no questions asked.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Questions?</h2>
      <p className="text-muted-foreground">
        If you have any questions about plans or billing, <Link href="/help/contact" className="text-primary hover:underline">contact our support team</Link>.
        We&apos;re happy to help you choose the right plan for your needs.
      </p>
    </HelpArticleLayout>
  );
}
