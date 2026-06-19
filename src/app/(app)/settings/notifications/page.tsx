"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Mail,
  Smartphone,
  ArrowLeft,
  TrendingUp,
  Package,
  Music,
  Zap,
  Calendar,
  Loader2,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserPreferences {
  notifyEmail: boolean;
  notifyPush: boolean;
  notifyWeekly: boolean;
  notifyBreakout: boolean;
  notifyMarketing: boolean;
}

export default function NotificationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User preferences from database
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifyWeekly, setNotifyWeekly] = useState(true);
  const [notifyBreakout, setNotifyBreakout] = useState(true);
  const [notifyMarketing, setNotifyMarketing] = useState(false);

  // Digest frequency derived from notifyWeekly
  const digestFrequency = notifyWeekly ? "weekly" : "never";

  // Load user preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const res = await fetch("/api/user");
        if (res.ok) {
          const data: UserPreferences = await res.json();
          setNotifyEmail(data.notifyEmail);
          setNotifyPush(data.notifyPush);
          setNotifyWeekly(data.notifyWeekly);
          setNotifyBreakout(data.notifyBreakout);
          setNotifyMarketing(data.notifyMarketing);
        }
      } catch (err) {
        console.error("Failed to load preferences:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notifyEmail,
          notifyPush,
          notifyWeekly,
          notifyBreakout,
          notifyMarketing,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save preferences");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save preferences. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDigestChange = (value: string | null) => {
    if (value) {
      setNotifyWeekly(value === "weekly");
    }
  };

  const muteAll = () => {
    setNotifyEmail(false);
    setNotifyPush(false);
    setNotifyWeekly(false);
    setNotifyBreakout(false);
    setNotifyMarketing(false);
  };

  const enableAll = () => {
    setNotifyEmail(true);
    setNotifyPush(true);
    setNotifyWeekly(true);
    setNotifyBreakout(true);
    setNotifyMarketing(true);
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/settings"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Settings
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bell className="h-8 w-8" />
          Notification Preferences
        </h1>
        <p className="text-muted-foreground mt-1">
          Choose how and when you want to receive notifications
        </p>
      </div>

      {/* Alert Notifications */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Alert Notifications</CardTitle>
          <CardDescription>
            Configure how you receive alerts for different events
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Channel Headers */}
          <div className="hidden sm:flex items-center justify-end gap-8 mb-4 pr-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              Email
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Smartphone className="h-4 w-4" />
              Push
            </div>
          </div>

          <div className="space-y-4">
            {/* Breakout Alerts */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Zap className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Breakout Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    When products or sounds suddenly start trending
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 pl-13 sm:pl-0">
                <div className="flex items-center gap-2">
                  <Label htmlFor="breakout-email" className="sm:sr-only text-sm">
                    Email
                  </Label>
                  <Switch
                    id="breakout-email"
                    checked={notifyBreakout && notifyEmail}
                    onCheckedChange={(checked) => {
                      if (!checked) setNotifyBreakout(false);
                      else setNotifyBreakout(true);
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="breakout-push" className="sm:sr-only text-sm">
                    Push
                  </Label>
                  <Switch
                    id="breakout-push"
                    checked={notifyBreakout && notifyPush}
                    onCheckedChange={(checked) => {
                      if (!checked && !notifyEmail) setNotifyBreakout(false);
                    }}
                    disabled
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Watchlist Updates */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Watchlist Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Changes to items in your watchlist
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 pl-13 sm:pl-0">
                <div className="flex items-center gap-2">
                  <Label htmlFor="watchlist-email" className="sm:sr-only text-sm">
                    Email
                  </Label>
                  <Switch
                    id="watchlist-email"
                    checked={notifyEmail}
                    onCheckedChange={setNotifyEmail}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="watchlist-push" className="sm:sr-only text-sm">
                    Push
                  </Label>
                  <Switch
                    id="watchlist-push"
                    checked={notifyPush}
                    onCheckedChange={setNotifyPush}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Product Alerts */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Product Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Price changes, commission updates, stock alerts
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 pl-13 sm:pl-0">
                <div className="flex items-center gap-2">
                  <Label htmlFor="product-email" className="sm:sr-only text-sm">
                    Email
                  </Label>
                  <Switch
                    id="product-email"
                    checked={notifyEmail}
                    onCheckedChange={setNotifyEmail}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="product-push" className="sm:sr-only text-sm">
                    Push
                  </Label>
                  <Switch
                    id="product-push"
                    checked={notifyPush}
                    onCheckedChange={setNotifyPush}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Sound Alerts */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Music className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Sound Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Rank changes and viral sound notifications
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 pl-13 sm:pl-0">
                <div className="flex items-center gap-2">
                  <Label htmlFor="sound-email" className="sm:sr-only text-sm">
                    Email
                  </Label>
                  <Switch
                    id="sound-email"
                    checked={notifyEmail}
                    onCheckedChange={setNotifyEmail}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="sound-push" className="sm:sr-only text-sm">
                    Push
                  </Label>
                  <Switch
                    id="sound-push"
                    checked={notifyPush}
                    onCheckedChange={setNotifyPush}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Digest */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <CardTitle className="text-lg">Email Digest</CardTitle>
          </div>
          <CardDescription>
            Receive a summary of top trends and your watchlist updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Digest Frequency</p>
              <p className="text-sm text-muted-foreground">
                How often should we send trend summaries?
              </p>
            </div>
            <Select value={digestFrequency} onValueChange={handleDigestChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {digestFrequency !== "never" && (
            <>
              <Separator />
              <div className="text-sm text-muted-foreground">
                <p>You&apos;ll receive a weekly digest every Monday at 8:00 AM in your timezone.</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Marketing & Updates */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Marketing & Product Updates</CardTitle>
          <CardDescription>
            Stay informed about new features and tips
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Emails</p>
              <p className="text-sm text-muted-foreground">
                Product updates, tips, and occasional promotions
              </p>
            </div>
            <Switch
              checked={notifyMarketing}
              onCheckedChange={setNotifyMarketing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={muteAll}
            >
              Mute All
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={enableAll}
            >
              Enable All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500 text-center mb-4">{error}</p>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </div>
    </div>
  );
}
