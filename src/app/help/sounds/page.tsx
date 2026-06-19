import { Music } from "lucide-react";
import { HelpCategoryLayout } from "@/components/help-layout";

const articles = [
  {
    title: "Discovering Trending Sounds",
    description: "How to find sounds that are going viral on TikTok",
    href: "/help/articles/discovering-sounds",
  },
  {
    title: "Understanding Sound Rankings",
    description: "What rank changes mean and how to interpret them",
    href: "/help/articles/sound-rankings",
  },
  {
    title: "Sound Categories and Genres",
    description: "Browse sounds by genre, mood, or use case",
    href: "/help/articles/sound-categories",
  },
  {
    title: "Tracking Sound Performance",
    description: "Add sounds to your watchlist and get alerts on growth",
    href: "/help/articles/tracking-sounds",
  },
  {
    title: "Sound Analytics Dashboard",
    description: "Reading the charts and metrics on sound detail pages",
    href: "/help/articles/sound-analytics",
  },
  {
    title: "Before Saturation Predictions",
    description: "How our AI predicts which sounds will go viral",
    href: "/help/articles/predictions",
  },
  {
    title: "Using Sounds in Your Content",
    description: "Best practices for incorporating trending sounds",
    href: "/help/articles/using-sounds",
  },
  {
    title: "Sound Licensing and Copyright",
    description: "Understanding music rights on TikTok",
    href: "/help/articles/sound-licensing",
  },
];

export default function HelpSoundsPage() {
  return (
    <HelpCategoryLayout
      icon={<Music className="h-7 w-7 text-primary" />}
      title="Sounds"
      description="Learn how to discover and leverage trending sounds and music"
      articles={articles}
    />
  );
}
