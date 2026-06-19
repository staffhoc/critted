import { CreditCard } from "lucide-react";
import { HelpCategoryLayout } from "@/components/help-layout";

const articles = [
  {
    title: "Subscription Plans Overview",
    description: "Compare Free, Basic, and Strategy plans",
    href: "/help/articles/upgrade",
  },
  {
    title: "Upgrading Your Plan",
    description: "How to upgrade from Free to a paid plan",
    href: "/help/articles/upgrading",
  },
  {
    title: "Managing Your Subscription",
    description: "View, change, or cancel your subscription",
    href: "/help/articles/managing-subscription",
  },
  {
    title: "Payment Methods",
    description: "Accepted payment methods and how to update them",
    href: "/help/articles/payment-methods",
  },
  {
    title: "Billing Cycle and Invoices",
    description: "Understanding your billing dates and downloading invoices",
    href: "/help/articles/billing-cycle",
  },
  {
    title: "Refund Policy",
    description: "Our refund policy and how to request one",
    href: "/help/articles/refunds",
  },
  {
    title: "Free Tier Limits",
    description: "What's included in the free plan and usage limits",
    href: "/help/articles/free-tier",
  },
  {
    title: "Strategy Plan Features",
    description: "Everything included in the Strategy plan",
    href: "/help/articles/strategy-plan",
  },
  {
    title: "Troubleshooting Payment Issues",
    description: "Common payment problems and how to resolve them",
    href: "/help/articles/payment-issues",
  },
  {
    title: "Enterprise and Team Plans",
    description: "Options for businesses and teams",
    href: "/help/articles/enterprise",
  },
];

export default function HelpBillingPage() {
  return (
    <HelpCategoryLayout
      icon={<CreditCard className="h-7 w-7 text-primary" />}
      title="Billing"
      description="Manage your subscription, payments, and invoices"
      articles={articles}
    />
  );
}
