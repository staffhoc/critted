import { Bell } from "lucide-react";
import { HelpCategoryLayout } from "@/components/help-layout";

const articles = [
  {
    title: "Setting Up Your First Alert",
    description: "Step-by-step guide to creating your first alert rule",
    href: "/help/articles/first-alert",
  },
  {
    title: "Alert Types Explained",
    description: "Different alert types and when to use each one",
    href: "/help/articles/alert-types",
  },
  {
    title: "Velocity Alerts",
    description: "Get notified when a product's sales velocity spikes",
    href: "/help/articles/velocity-alerts",
  },
  {
    title: "Rank Change Alerts",
    description: "Track when sounds move up or down in rankings",
    href: "/help/articles/rank-alerts",
  },
  {
    title: "Managing Your Alerts",
    description: "How to edit, pause, or delete existing alerts",
    href: "/help/articles/managing-alerts",
  },
  {
    title: "Alert Delivery Channels",
    description: "Choose between email, push notifications, or both",
    href: "/help/articles/alert-channels",
  },
];

export default function HelpAlertsPage() {
  return (
    <HelpCategoryLayout
      icon={<Bell className="h-7 w-7 text-primary" />}
      title="Alerts"
      description="Set up notifications to never miss a trending opportunity"
      articles={articles}
    />
  );
}
