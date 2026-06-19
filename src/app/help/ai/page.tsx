import { Zap } from "lucide-react";
import { HelpCategoryLayout } from "@/components/help-layout";

const articles = [
  {
    title: "Using AI Predictions",
    description: "How our AI predicts which products and sounds will trend",
    href: "/help/articles/predictions",
  },
  {
    title: "AI Strategy Builder",
    description: "Get personalized growth strategies for your TikTok account",
    href: "/help/articles/strategy-builder",
  },
  {
    title: "Understanding Confidence Scores",
    description: "What prediction confidence means and how to use it",
    href: "/help/articles/confidence-scores",
  },
  {
    title: "Before Saturation Alerts",
    description: "Get notified about trends before they peak",
    href: "/help/articles/before-saturation",
  },
  {
    title: "AI Video Generator",
    description: "Create video ideas using AI assistance",
    href: "/help/articles/video-generator",
  },
  {
    title: "Personalized Recommendations",
    description: "How we tailor suggestions to your niche and goals",
    href: "/help/articles/recommendations",
  },
  {
    title: "AI Accuracy and Limitations",
    description: "Understanding the accuracy and limitations of our predictions",
    href: "/help/articles/ai-accuracy",
  },
];

export default function HelpAIPage() {
  return (
    <HelpCategoryLayout
      icon={<Zap className="h-7 w-7 text-primary" />}
      title="AI Features"
      description="Learn how to leverage AI for predictions, strategy, and content creation"
      articles={articles}
    />
  );
}
