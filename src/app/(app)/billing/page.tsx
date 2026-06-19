"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Check,
  Zap,
  Crown,
  ArrowRight,
  Download,
  Calendar,
  Shield,
  Brain,
  X,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type SubscriptionTier = "FREE" | "BASIC" | "PRO" | "ENTERPRISE";
type SubscriptionStatus = "ACTIVE" | "PAST_DUE" | "CANCELED" | "PAUSED";
type InvoiceStatus = "DRAFT" | "OPEN" | "PAID" | "VOID" | "UNCOLLECTIBLE";

interface Subscription {
  id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
}

interface Invoice {
  id: string;
  stripeInvoiceId: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  description: string | null;
  invoiceUrl: string | null;
  invoicePdf: string | null;
  paidAt: string | null;
  createdAt: string;
}

interface PaymentMethod {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

interface BillingData {
  subscription: Subscription | null;
  invoices: Invoice[];
  paymentMethod: PaymentMethod | null;
}

const plans = [
  {
    id: "FREE",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for exploring and getting started",
    icon: Zap,
    features: [
      { text: "1 market (US or UK)", included: true },
      { text: "5 products per day", included: true },
      { text: "7-day history", included: true },
      { text: "2 alert rules", included: true },
      { text: "AI Strategy Builder", included: false },
    ],
  },
  {
    id: "BASIC",
    name: "Basic",
    monthlyPrice: 22,
    yearlyPrice: 220,
    description: "Full access for serious creators and sellers",
    icon: Crown,
    popular: true,
    features: [
      { text: "All markets included", included: true },
      { text: "Unlimited products", included: true },
      { text: "Full history access", included: true },
      { text: "Unlimited alert rules", included: true },
      { text: "AI Predictions", included: true },
      { text: "Priority support", included: true },
      { text: "AI Strategy Builder", included: false },
    ],
  },
  {
    id: "PRO",
    name: "Strategy",
    monthlyPrice: 27,
    yearlyPrice: 270,
    description: "Everything in Basic + personalized AI strategies",
    icon: Brain,
    features: [
      { text: "Everything in Basic", included: true },
      { text: "7/30/60/90-day strategies", included: true },
      { text: "Personalized action plans", included: true },
      { text: "Weekly sound & product picks", included: true },
      { text: "Content calendar", included: true },
      { text: "Goal tracking", included: true },
    ],
  },
];

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null);
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const res = await fetch("/api/billing");
        if (res.ok) {
          const data = await res.json();
          setBillingData(data);
        } else {
          setError("Failed to load billing data");
        }
      } catch (err) {
        console.error("Error fetching billing data:", err);
        setError("Failed to load billing data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillingData();
  }, []);

  const handleManagePayment = async () => {
    setIsPortalLoading(true);
    try {
      const res = await fetch("/api/billing/portal", {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        const data = await res.json();
        alert(data.error || "Failed to open billing portal");
      }
    } catch (err) {
      console.error("Error opening portal:", err);
      alert("Failed to open billing portal");
    } finally {
      setIsPortalLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    setIsUpgrading(planId);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billingPeriod }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        const data = await res.json();
        alert(data.error || "Failed to start checkout");
      }
    } catch (err) {
      console.error("Error starting checkout:", err);
      alert("Failed to start checkout");
    } finally {
      setIsUpgrading(null);
    }
  };

  const handleCancelSubscription = async () => {
    setIsCanceling(true);
    try {
      const res = await fetch("/api/billing/cancel", {
        method: "POST",
      });

      if (res.ok) {
        // Refresh billing data
        const billingRes = await fetch("/api/billing");
        if (billingRes.ok) {
          const data = await billingRes.json();
          setBillingData(data);
        }
        alert("Subscription will be canceled at the end of your billing period.");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to cancel subscription");
      }
    } catch (err) {
      console.error("Error canceling subscription:", err);
      alert("Failed to cancel subscription");
    } finally {
      setIsCanceling(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string = "usd") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "PAID":
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Paid</Badge>;
      case "OPEN":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Open</Badge>;
      case "VOID":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Void</Badge>;
      case "UNCOLLECTIBLE":
        return <Badge variant="secondary" className="bg-red-100 text-red-700">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto max-w-5xl flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const currentTier = billingData?.subscription?.tier || "FREE";
  const currentPlan = plans.find((p) => p.id === currentTier) || plans[0];
  const renewalDate = billingData?.subscription?.currentPeriodEnd
    ? formatDate(billingData.subscription.currentPeriodEnd)
    : null;

  const getPrice = (plan: typeof plans[0]) => {
    if (billingPeriod === "yearly") {
      return plan.yearlyPrice;
    }
    return plan.monthlyPrice;
  };

  const getMonthlyEquivalent = (plan: typeof plans[0]) => {
    if (billingPeriod === "yearly" && plan.yearlyPrice > 0) {
      return (plan.yearlyPrice / 12).toFixed(2);
    }
    return plan.monthlyPrice;
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CreditCard className="h-8 w-8" />
          Billing & Subscription
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscription and billing details
        </p>
      </div>

      {error && (
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="p-4 text-red-700">{error}</CardContent>
        </Card>
      )}

      {/* Current Plan */}
      <Card className="mb-8 border-2 border-primary">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center">
                <currentPlan.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{currentPlan.name} Plan</h2>
                  <Badge className={billingData?.subscription?.status === "ACTIVE" ? "bg-primary" : "bg-yellow-500"}>
                    {billingData?.subscription?.status || "Free"}
                  </Badge>
                  {billingData?.subscription?.cancelAtPeriodEnd && (
                    <Badge variant="outline" className="text-red-600 border-red-600">
                      Canceling
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">
                  ${currentPlan.monthlyPrice}/month
                  {renewalDate && ` • Renews on ${renewalDate}`}
                </p>
              </div>
            </div>
            {billingData?.subscription?.stripeCustomerId && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleManagePayment} disabled={isPortalLoading}>
                  {isPortalLoading ? "Loading..." : "Manage Subscription"}
                </Button>
                {!billingData.subscription.cancelAtPeriodEnd && (
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={<Button variant="outline" className="text-red-600 hover:text-red-700" />}
                    >
                      Cancel
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Your subscription will remain active until {renewalDate}. After that,
                          you&apos;ll be downgraded to the Free plan with limited features.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={handleCancelSubscription}
                          disabled={isCanceling}
                        >
                          {isCanceling ? "Canceling..." : "Cancel Subscription"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade to Strategy */}
      {currentTier === "BASIC" && (
        <Card className="mb-8 border-2 border-dashed border-primary/50 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    Unlock AI Strategy Builder
                    <Badge variant="secondary">+$5/mo</Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get personalized 7/30/60/90-day growth strategies, weekly product & sound recommendations,
                    and actionable content calendars tailored to your account.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => handleUpgrade("PRO")}
                disabled={isUpgrading === "PRO"}
                className="shrink-0"
              >
                {isUpgrading === "PRO" ? "Upgrading..." : "Upgrade to Strategy"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans Comparison */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold">All Plans</h2>
        <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingPeriod === "monthly"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              billingPeriod === "yearly"
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Yearly
            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
              2 months free
            </Badge>
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = plan.id === currentTier;
          return (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular ? "border-2 border-primary" : ""
              } ${isCurrent ? "bg-primary/5" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className={`h-5 w-5 ${isCurrent ? "text-primary" : ""}`} />
                    {plan.name}
                  </CardTitle>
                  {isCurrent && <Badge variant="secondary">Current</Badge>}
                </div>
                <div className="mt-2">
                  {billingPeriod === "yearly" && plan.yearlyPrice > 0 ? (
                    <>
                      <span className="text-3xl font-bold">${getMonthlyEquivalent(plan)}</span>
                      <span className="text-muted-foreground">/mo</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Billed ${plan.yearlyPrice}/year
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">${plan.monthlyPrice}</span>
                      <span className="text-muted-foreground">/mo</span>
                    </>
                  )}
                </div>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-center gap-2 text-sm">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                      )}
                      <span className={feature.included ? "" : "text-muted-foreground/40"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : plan.monthlyPrice === 0 ? (
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={<Button variant="outline" className="w-full" />}
                    >
                      Downgrade
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Downgrade to Free?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You&apos;ll lose access to unlimited products, full history, and AI predictions.
                          This change will take effect at the end of your current billing period.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Current Plan</AlertDialogCancel>
                        <AlertDialogAction onClick={handleManagePayment}>Confirm Downgrade</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.monthlyPrice > currentPlan.monthlyPrice ? "default" : "outline"}
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isUpgrading === plan.id}
                  >
                    {isUpgrading === plan.id ? "Processing..." : plan.monthlyPrice > currentPlan.monthlyPrice ? "Upgrade" : "Switch"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment Method */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          {billingData?.paymentMethod ? (
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-4">
                <div className="h-12 w-16 rounded bg-muted flex items-center justify-center font-bold text-sm uppercase">
                  {billingData.paymentMethod.brand}
                </div>
                <div>
                  <p className="font-medium">
                    {billingData.paymentMethod.brand.charAt(0).toUpperCase() + billingData.paymentMethod.brand.slice(1)} ending in {billingData.paymentMethod.last4}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expires {billingData.paymentMethod.expMonth}/{billingData.paymentMethod.expYear}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleManagePayment} disabled={isPortalLoading}>
                {isPortalLoading ? "Loading..." : "Update"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-lg border border-dashed">
              <p className="text-muted-foreground">No payment method on file</p>
              {billingData?.subscription?.stripeCustomerId && (
                <Button variant="outline" size="sm" onClick={handleManagePayment} disabled={isPortalLoading}>
                  Add Payment Method
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Billing History
          </CardTitle>
          <CardDescription>Download invoices for your records</CardDescription>
        </CardHeader>
        <CardContent>
          {billingData?.invoices && billingData.invoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Download</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingData.invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.stripeInvoiceId.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell>{formatDate(invoice.paidAt || invoice.createdAt)}</TableCell>
                    <TableCell>{formatCurrency(invoice.amount, invoice.currency)}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right">
                      {invoice.invoicePdf ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(invoice.invoicePdf!, "_blank")}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" disabled>
                          <Download className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No invoices yet</p>
              <p className="text-sm">Your billing history will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Note */}
      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Shield className="h-4 w-4" />
        <span>Payments are processed securely by Stripe. We never store your card details.</span>
      </div>
    </div>
  );
}
