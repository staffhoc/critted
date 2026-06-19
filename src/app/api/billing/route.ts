import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get invoices for this user
    const invoices = await prisma.invoice.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Get payment method from Stripe if customer exists
    let paymentMethod = null;
    if (user.subscription?.stripeCustomerId) {
      try {
        const paymentMethods = await stripe.paymentMethods.list({
          customer: user.subscription.stripeCustomerId,
          type: "card",
          limit: 1,
        });

        if (paymentMethods.data.length > 0) {
          const pm = paymentMethods.data[0];
          paymentMethod = {
            brand: pm.card?.brand || "card",
            last4: pm.card?.last4 || "****",
            expMonth: pm.card?.exp_month,
            expYear: pm.card?.exp_year,
          };
        }
      } catch (error) {
        console.error("Error fetching payment method:", error);
      }
    }

    return NextResponse.json({
      subscription: user.subscription
        ? {
            id: user.subscription.id,
            tier: user.subscription.tier,
            status: user.subscription.status,
            currentPeriodEnd: user.subscription.currentPeriodEnd,
            cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd,
            stripeCustomerId: user.subscription.stripeCustomerId,
          }
        : null,
      invoices: invoices.map((inv) => ({
        id: inv.id,
        stripeInvoiceId: inv.stripeInvoiceId,
        amount: inv.amount,
        currency: inv.currency,
        status: inv.status,
        description: inv.description,
        invoiceUrl: inv.invoiceUrl,
        invoicePdf: inv.invoicePdf,
        paidAt: inv.paidAt,
        createdAt: inv.createdAt,
      })),
      paymentMethod,
    });
  } catch (error) {
    console.error("Error fetching billing data:", error);
    return NextResponse.json(
      { error: "Failed to fetch billing data" },
      { status: 500 }
    );
  }
}
