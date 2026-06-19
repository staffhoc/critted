"use client";

import { useState } from "react";
import {
  Bell,
  Plus,
  Trash2,
  Package,
  Music,
  Store,
  TrendingUp,
  Mail,
  Smartphone,
  Edit,
  Power,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockAlerts } from "@/lib/mock-data";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, active: !alert.active } : alert
      )
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const getItemIcon = (type: string) => {
    if (type === "PRODUCT") return Package;
    if (type === "SOUND") return Music;
    return Store;
  };

  const getMetricLabel = (metric: string) => {
    const labels: Record<string, string> = {
      velocity: "Sales Velocity",
      rank_delta: "Rank Change",
      growth_rate: "Growth Rate",
      acceleration: "Acceleration Score",
    };
    return labels[metric] || metric;
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Alert Rules
          </h1>
          <p className="text-muted-foreground mt-1">
            Get notified when items hit your thresholds
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Alert</DialogTitle>
              <DialogDescription>
                Set up a new alert rule to monitor items in your watchlist
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Item Type</Label>
                <Select defaultValue="PRODUCT">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRODUCT">Product</SelectItem>
                    <SelectItem value="SOUND">Sound</SelectItem>
                    <SelectItem value="SHOP">Shop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input placeholder="Search for an item..." />
              </div>
              <div className="space-y-2">
                <Label>Metric</Label>
                <Select defaultValue="velocity">
                  <SelectTrigger>
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="velocity">Sales Velocity</SelectItem>
                    <SelectItem value="rank_delta">Rank Change</SelectItem>
                    <SelectItem value="growth_rate">Growth Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Threshold</Label>
                <Input type="number" placeholder="500" />
              </div>
              <div className="space-y-2">
                <Label>Notification Channel</Label>
                <Select defaultValue="email">
                  <SelectTrigger>
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Create Alert</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Alerts</p>
            <p className="text-2xl font-bold">{alerts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <p className="text-sm text-muted-foreground mb-1">Active</p>
            <p className="text-2xl font-bold text-green-500">
              {alerts.filter((a) => a.active).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <p className="text-sm text-muted-foreground mb-1">Triggered Today</p>
            <p className="text-2xl font-bold">3</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <p className="text-sm text-muted-foreground mb-1">This Week</p>
            <p className="text-2xl font-bold">12</p>
          </CardContent>
        </Card>
      </div>

      {/* Alert List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Alert Rules</CardTitle>
          <CardDescription>
            Manage your alert rules and notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.length > 0 ? (
            alerts.map((alert) => {
              const Icon = getItemIcon(alert.itemType);
              return (
                <div
                  key={alert.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    alert.active ? "" : "opacity-60"
                  }`}
                >
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{alert.itemName}</p>
                      <Badge variant={alert.active ? "default" : "secondary"} className="shrink-0">
                        {alert.active ? "Active" : "Paused"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {getMetricLabel(alert.metric)} &gt; {alert.threshold}
                      </span>
                      <span className="flex items-center gap-1">
                        {alert.channel === "email" ? (
                          <Mail className="h-3 w-3" />
                        ) : (
                          <Smartphone className="h-3 w-3" />
                        )}
                        {alert.channel}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Switch
                      checked={alert.active}
                      onCheckedChange={() => toggleAlert(alert.id)}
                    />
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => deleteAlert(alert.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No alerts yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first alert to get notified when items hit your thresholds
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
