"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  DollarSign,
  TrendingUp,
  Link2,
  Copy,
  CheckCircle,
  Gift,
  Star,
  Trophy,
  ArrowRight,
  ChevronRight,
  Share2,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const referralStats = {
  totalReferrals: 47,
  activeReferrals: 32,
  totalEarnings: 2340,
  pendingPayout: 450,
  conversionRate: 24.5,
  tier: "Gold",
  nextTier: "Platinum",
  nextTierProgress: 68,
};

const recentReferrals = [
  {
    id: "r1",
    name: "Sarah M.",
    email: "sarah@example.com",
    signedUp: "2 days ago",
    plan: "Pro",
    commission: 50,
    status: "active",
  },
  {
    id: "r2",
    name: "Mike T.",
    email: "mike@example.com",
    signedUp: "5 days ago",
    plan: "Basic",
    commission: 25,
    status: "active",
  },
  {
    id: "r3",
    name: "Emma K.",
    email: "emma@example.com",
    signedUp: "1 week ago",
    plan: "Pro",
    commission: 50,
    status: "churned",
  },
  {
    id: "r4",
    name: "John D.",
    email: "john@example.com",
    signedUp: "2 weeks ago",
    plan: "Pro",
    commission: 50,
    status: "active",
  },
];

const tierBenefits = [
  {
    tier: "Bronze",
    commission: "20%",
    benefits: ["Basic referral tracking", "Monthly payouts"],
    color: "bg-amber-600",
  },
  {
    tier: "Silver",
    commission: "25%",
    benefits: ["All Bronze benefits", "Priority support", "Early feature access"],
    color: "bg-gray-400",
  },
  {
    tier: "Gold",
    commission: "30%",
    benefits: ["All Silver benefits", "Weekly payouts", "Custom referral page"],
    color: "bg-yellow-500",
  },
  {
    tier: "Platinum",
    commission: "35%",
    benefits: ["All Gold benefits", "1-on-1 success manager", "Co-marketing opportunities"],
    color: "bg-slate-300",
  },
];

export default function AffiliatePage() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://trendflow.io/ref/YOURCODE";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Affiliate Program
          </h1>
          <p className="text-muted-foreground mt-1">
            Earn recurring commissions by referring creators and sellers
          </p>
        </div>
        <Badge className="bg-yellow-500 text-black w-fit">
          <Trophy className="h-3 w-3 mr-1" />
          {referralStats.tier} Partner
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-3xl font-bold">${referralStats.totalEarnings}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Referrals</p>
                <p className="text-3xl font-bold">{referralStats.activeReferrals}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-3xl font-bold">{referralStats.conversionRate}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payout</p>
                <p className="text-3xl font-bold">${referralStats.pendingPayout}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Gift className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Referral Link */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Your Referral Link
              </CardTitle>
              <CardDescription>
                Share this link to earn 30% commission on every referral
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={referralLink} readOnly className="font-mono text-sm" />
                <Button onClick={handleCopy} variant="outline">
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Referrals Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReferrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://picsum.photos/seed/${referral.id}/100`} />
                            <AvatarFallback>{referral.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{referral.name}</p>
                            <p className="text-xs text-muted-foreground">{referral.signedUp}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{referral.plan}</Badge>
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        ${referral.commission}/mo
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={referral.status === "active" ? "default" : "secondary"}
                          className={referral.status === "active" ? "bg-green-500" : ""}
                        >
                          {referral.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button variant="outline" className="w-full mt-4">
                View All Referrals
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tier Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Tier Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className="bg-yellow-500 text-black">{referralStats.tier}</Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline">{referralStats.nextTier}</Badge>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{referralStats.nextTierProgress}%</span>
                </div>
                <Progress value={referralStats.nextTierProgress} className="h-2" />
              </div>
              <p className="text-sm text-muted-foreground">
                Refer 8 more users to reach {referralStats.nextTier} tier and unlock 35% commission!
              </p>
            </CardContent>
          </Card>

          {/* Tier Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Commission Tiers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tierBenefits.map((tier) => (
                <div
                  key={tier.tier}
                  className={`p-3 rounded-lg border ${
                    tier.tier === referralStats.tier ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${tier.color}`} />
                      <span className="font-medium">{tier.tier}</span>
                    </div>
                    <Badge variant="secondary">{tier.commission}</Badge>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-3">
                Need help with your affiliate account?
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
