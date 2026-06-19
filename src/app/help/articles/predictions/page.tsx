import { HelpArticleLayout } from "@/components/help-layout";

export default function PredictionsArticle() {
  return (
    <HelpArticleLayout
      category="AI Features"
      categoryHref="/help/ai"
      title="Using AI Predictions"
      relatedArticles={[
        { title: "Understanding Velocity and Growth Metrics", href: "/help/articles/metrics" },
        { title: "AI Strategy Builder", href: "/help/articles/strategy-builder" },
        { title: "Setting Up Your First Alert", href: "/help/articles/first-alert" },
      ]}
    >
      <p className="text-lg text-muted-foreground mb-6">
        Critted&apos;s AI analyzes millions of data points to predict which products and sounds
        will trend before they go viral. This guide explains how to use these predictions effectively.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">How Our Predictions Work</h2>
      <p className="text-muted-foreground mb-4">
        Our AI model analyzes multiple signals to identify items that are about to trend:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li><strong>Velocity patterns:</strong> Unusual acceleration in sales or usage</li>
        <li><strong>Historical comparisons:</strong> Similarity to past viral products/sounds</li>
        <li><strong>Cross-platform signals:</strong> Mentions on Instagram, YouTube, etc.</li>
        <li><strong>Influencer activity:</strong> Early adoption by top creators</li>
        <li><strong>Search volume:</strong> Rising search interest on TikTok and Google</li>
        <li><strong>Seasonal patterns:</strong> Timing relative to holidays, events, etc.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Understanding Confidence Scores</h2>
      <p className="text-muted-foreground mb-4">
        Each prediction includes a confidence score from 0-100%:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li><strong>90%+ confidence:</strong> Very strong signals - highest probability of trending</li>
        <li><strong>75-90% confidence:</strong> Strong signals - likely to trend</li>
        <li><strong>60-75% confidence:</strong> Moderate signals - promising but less certain</li>
        <li><strong>Below 60%:</strong> Weaker signals - more speculative</li>
      </ul>
      <p className="text-muted-foreground mb-6">
        We recommend focusing on predictions with 75%+ confidence for the best results.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">The Before Saturation Section</h2>
      <p className="text-muted-foreground mb-4">
        The &quot;Before Saturation&quot; section on your dashboard highlights items our AI believes
        will peak soon. For each prediction, you&apos;ll see:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li><strong>Confidence score:</strong> How certain we are about this prediction</li>
        <li><strong>Predicted peak date:</strong> When we expect the item to reach maximum popularity</li>
        <li><strong>Current value:</strong> Current velocity or video count</li>
        <li><strong>Predicted peak value:</strong> Expected velocity/count at peak</li>
        <li><strong>Key signals:</strong> What triggered this prediction</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Acting on Predictions</h2>
      <p className="text-muted-foreground mb-4">
        When you see a high-confidence prediction:
      </p>
      <ol className="list-decimal pl-6 text-muted-foreground space-y-2 mb-6">
        <li><strong>Review the signals:</strong> Understand why our AI flagged this item</li>
        <li><strong>Check the timeline:</strong> Is the predicted peak date within your content schedule?</li>
        <li><strong>Evaluate fit:</strong> Does this product/sound match your niche and audience?</li>
        <li><strong>Move quickly:</strong> The value of a prediction decreases as more people act on it</li>
        <li><strong>Add to watchlist:</strong> Track the item to see if our prediction is accurate</li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Prediction Accuracy</h2>
      <p className="text-muted-foreground mb-4">
        Our AI predictions are based on historical patterns and signals, but they&apos;re not guarantees.
        On average:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li>90%+ confidence predictions are accurate ~85% of the time</li>
        <li>75-90% confidence predictions are accurate ~70% of the time</li>
        <li>60-75% confidence predictions are accurate ~55% of the time</li>
      </ul>
      <p className="text-muted-foreground mb-6">
        We continuously improve our model based on outcomes.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Prediction Alerts</h2>
      <p className="text-muted-foreground mb-4">
        Don&apos;t want to check predictions manually? Set up alerts:
      </p>
      <ol className="list-decimal pl-6 text-muted-foreground space-y-2 mb-6">
        <li>Go to <strong>Alerts</strong> in the sidebar</li>
        <li>Create a new &quot;Before Saturation&quot; alert</li>
        <li>Set your minimum confidence threshold (e.g., 80%)</li>
        <li>Optionally filter by category or type (product/sound)</li>
        <li>Get notified immediately when a matching prediction appears</li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Predictions on Paid Plans</h2>
      <p className="text-muted-foreground mb-4">
        Prediction access varies by plan:
      </p>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
        <li><strong>Free:</strong> See top 2 predictions per day (limited details)</li>
        <li><strong>Basic ($22/mo):</strong> Full access to all predictions with complete details</li>
        <li><strong>Strategy ($27/mo):</strong> All predictions plus AI-powered strategy recommendations</li>
      </ul>
      <p className="text-muted-foreground">
        Upgrade to Basic or Strategy to get the full power of our AI predictions.
      </p>
    </HelpArticleLayout>
  );
}
