import { Settings } from "lucide-react";
import { HelpCategoryLayout } from "@/components/help-layout";

const articles = [
  {
    title: "Getting Started with Critted",
    description: "Complete guide for new users",
    href: "/help/articles/getting-started",
  },
  {
    title: "Updating Your Profile",
    description: "How to change your name, email, and preferences",
    href: "/help/articles/update-profile",
  },
  {
    title: "Connecting Your TikTok Account",
    description: "Link your TikTok account for personalized insights",
    href: "/help/articles/connect-tiktok",
  },
  {
    title: "Notification Settings",
    description: "Control what notifications you receive and how",
    href: "/help/articles/notification-settings",
  },
  {
    title: "Security and Two-Factor Authentication",
    description: "Protect your account with 2FA",
    href: "/help/articles/security",
  },
  {
    title: "Managing Active Sessions",
    description: "View and revoke access from other devices",
    href: "/help/articles/sessions",
  },
  {
    title: "Changing Your Password",
    description: "How to update your password",
    href: "/help/articles/change-password",
  },
  {
    title: "Deleting Your Account",
    description: "How to permanently delete your Critted account",
    href: "/help/articles/delete-account",
  },
  {
    title: "Data Export",
    description: "Download your data and watchlists",
    href: "/help/articles/data-export",
  },
];

export default function HelpAccountPage() {
  return (
    <HelpCategoryLayout
      icon={<Settings className="h-7 w-7 text-primary" />}
      title="Account"
      description="Manage your profile, settings, and security"
      articles={articles}
    />
  );
}
