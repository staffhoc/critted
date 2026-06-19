import { HelpArticleLayout } from "@/components/help-layout";

export default function MetricsArticle() {
  return (
    <HelpArticleLayout
      category="Analytics"
      categoryHref="/help/products"
      title="Understanding Velocity and Growth Metrics"
      relatedArticles={[
        { title: "How to Find High-Commission Products", href: "/help/articles/high-commission" },
        { title: "Using AI Predictions", href: "/help/articles/predictions" },
        { title: "Setting Up Your First Alert", href: "/help/articles/first-alert" },
      ]}
    >
      <p className="text-lg text-muted-foreground mb-6">
        Critted uses several key metrics to help you identify trending products and sounds.
        Understanding these metrics is crucial for making smart decisions about what to promote.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Velocity</h2>
      <p className="text-muted-foreground mb-4">
        <strong>Velocity</strong> measures how fast a product is selling, expressed as units sold per day.
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li><strong>Low velocity (1-50/day):</strong> Niche or early-stage products</li>
        <li><strong>Medium velocity (50-200/day):</strong> Solid performers worth considering</li>
        <li><strong>High velocity (200-500/day):</strong> Hot products with proven demand</li>
        <li><strong>Very high velocity (500+/day):</strong> Viral products, but may be saturated</li>
      </ul>
      <p className="text-muted-foreground mb-6">
        Higher velocity generally means more opportunity, but extremely high velocity might indicate
        the product is already saturated with promoters.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Growth Rate</h2>
      <p className="text-muted-foreground mb-4">
        <strong>Growth rate</strong> shows the percentage change in velocity compared to the previous period.
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li><strong>Negative growth:</strong> Product is declining - proceed with caution</li>
        <li><strong>0-10% growth:</strong> Stable performer</li>
        <li><strong>10-50% growth:</strong> Growing steadily - good opportunity</li>
        <li><strong>50%+ growth:</strong> Rapid growth - act fast before saturation</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Rank and Rank Delta</h2>
      <p className="text-muted-foreground mb-4">
        For sounds, we track their position in TikTok&apos;s trending charts:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li><strong>Rank:</strong> Current position in the trending sounds chart</li>
        <li><strong>Rank Delta:</strong> How many positions the sound moved up (+) or down (-)</li>
      </ul>
      <p className="text-muted-foreground mb-6">
        A sound moving from #50 to #25 (rank delta +25) is gaining momentum and could be a good
        choice for your next video.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Video Count</h2>
      <p className="text-muted-foreground mb-4">
        For sounds, <strong>video count</strong> shows how many TikTok videos use that sound.
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li><strong>Under 10K videos:</strong> Early stage - less competition, but unproven</li>
        <li><strong>10K-100K videos:</strong> Gaining traction - sweet spot for early adopters</li>
        <li><strong>100K-1M videos:</strong> Mainstream - proven but more competition</li>
        <li><strong>1M+ videos:</strong> Viral - may be oversaturated</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Acceleration Score</h2>
      <p className="text-muted-foreground mb-4">
        Our AI-calculated <strong>acceleration score</strong> (0-100) predicts how quickly an item
        is likely to continue growing. It considers:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li>Recent velocity changes</li>
        <li>Pattern recognition from similar items</li>
        <li>Seasonal factors</li>
        <li>External signals (influencer mentions, etc.)</li>
      </ul>
      <p className="text-muted-foreground mb-6">
        A high acceleration score (70+) suggests the item is about to take off.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Confidence Score</h2>
      <p className="text-muted-foreground mb-4">
        In our Predictions section, each prediction has a <strong>confidence score</strong> (0-100%)
        indicating how certain our AI is about the prediction.
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li><strong>90%+:</strong> Very high confidence - strong signals detected</li>
        <li><strong>75-90%:</strong> High confidence - likely to trend</li>
        <li><strong>60-75%:</strong> Moderate confidence - promising but less certain</li>
        <li><strong>Below 60%:</strong> Lower confidence - more speculative</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">How to Use These Metrics Together</h2>
      <p className="text-muted-foreground mb-4">
        The best opportunities typically show:
      </p>
      <ol className="list-decimal pl-6 text-muted-foreground space-y-2 mb-6">
        <li>Moderate to high velocity (proves demand exists)</li>
        <li>Strong positive growth rate (trending upward)</li>
        <li>High acceleration score (momentum is building)</li>
        <li>Good commission rate (worth your effort)</li>
      </ol>
      <p className="text-muted-foreground">
        Avoid products with declining growth or extremely high velocity (already saturated).
        Look for the sweet spot where demand is proven but competition hasn&apos;t peaked.
      </p>
    </HelpArticleLayout>
  );
}
