import { HelpArticleLayout } from "@/components/help-layout";

export default function HighCommissionArticle() {
  return (
    <HelpArticleLayout
      category="Products"
      categoryHref="/help/products"
      title="How to Find High-Commission Products"
      relatedArticles={[
        { title: "Understanding Velocity and Growth Metrics", href: "/help/articles/metrics" },
        { title: "Getting Started with Critted", href: "/help/articles/getting-started" },
        { title: "Tracking Product Performance", href: "/help/articles/tracking-products" },
      ]}
    >
      <p className="text-lg text-muted-foreground mb-6">
        As a TikTok affiliate, your earnings depend on the commission rate of the products you promote.
        This guide shows you how to find products with the highest commission rates on Critted.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Why Commission Rate Matters</h2>
      <p className="text-muted-foreground mb-4">
        Commission rates on TikTok Shop typically range from 5% to 30%. The difference is significant:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li>A $20 product at 5% commission = $1.00 per sale</li>
        <li>A $20 product at 20% commission = $4.00 per sale</li>
        <li>That&apos;s 4x more earnings for the same effort!</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Using the Commission Filter</h2>
      <p className="text-muted-foreground mb-4">
        On the Products page, use the commission filter to find high-paying products:
      </p>
      <ol className="list-decimal pl-6 text-muted-foreground space-y-2 mb-6">
        <li>Navigate to <strong>Products</strong> in the sidebar</li>
        <li>Click the <strong>Filters</strong> button</li>
        <li>Under &quot;Commission Rate&quot;, set the minimum to 15% or higher</li>
        <li>Apply the filter to see only high-commission products</li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Sorting by Commission</h2>
      <p className="text-muted-foreground mb-4">
        You can also sort the entire product list by commission rate:
      </p>
      <ol className="list-decimal pl-6 text-muted-foreground space-y-2 mb-6">
        <li>Click the <strong>Sort</strong> dropdown</li>
        <li>Select <strong>Commission: High to Low</strong></li>
        <li>The highest-commission products will appear at the top</li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-4">The High Commission Tab</h2>
      <p className="text-muted-foreground mb-4">
        On your dashboard, the &quot;High-Mover Products&quot; card has a <strong>High Commission</strong> tab
        that shows trending products sorted by commission rate. This is a quick way to see
        what&apos;s both trending AND high-paying.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Categories with Higher Commissions</h2>
      <p className="text-muted-foreground mb-4">
        Some product categories typically offer higher commission rates:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li><strong>Beauty & Skincare:</strong> Often 15-25% commission</li>
        <li><strong>Health & Wellness:</strong> Supplements often offer 20%+</li>
        <li><strong>Digital Products:</strong> Can be 30% or higher</li>
        <li><strong>Fashion Accessories:</strong> Typically 15-20%</li>
      </ul>
      <p className="text-muted-foreground mb-6">
        Categories like Electronics tend to have lower commissions (5-10%) due to thinner margins.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Balancing Commission vs. Velocity</h2>
      <p className="text-muted-foreground mb-4">
        A high commission rate isn&apos;t everything. Consider these factors:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li><strong>Velocity:</strong> A 10% commission on a product selling 500/day beats
          30% on a product selling 10/day</li>
        <li><strong>Price point:</strong> 20% of a $50 product ($10) is better than 25% of a $15 product ($3.75)</li>
        <li><strong>Conversion rate:</strong> Products that are easy to sell matter more than raw commission</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Pro Tip: Earnings Per Sale</h2>
      <p className="text-muted-foreground mb-4">
        On product detail pages, we show the actual <strong>earnings per sale</strong> calculated as:
      </p>
      <p className="text-muted-foreground mb-4 font-mono bg-muted p-3 rounded">
        Earnings = Product Price × Commission Rate
      </p>
      <p className="text-muted-foreground mb-6">
        This makes it easy to compare the real value of promoting different products.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Setting Up Commission Alerts</h2>
      <p className="text-muted-foreground">
        Want to know when a product&apos;s commission rate increases? Set up an alert:
      </p>
      <ol className="list-decimal pl-6 text-muted-foreground space-y-2 mt-4">
        <li>Add a product to your watchlist</li>
        <li>Go to Alerts and create a new rule</li>
        <li>Select &quot;Commission Change&quot; as the metric</li>
        <li>You&apos;ll be notified if the commission rate goes up</li>
      </ol>
    </HelpArticleLayout>
  );
}
