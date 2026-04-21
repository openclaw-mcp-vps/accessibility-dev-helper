import { NextRequest, NextResponse } from "next/server";
import { recordPurchaseFromStripe, verifyStripeSignature } from "@/lib/lemonsqueezy";

export const runtime = "nodejs";

type StripeEvent = {
  id: string;
  type: string;
  data?: {
    object?: {
      id?: string;
      customer_email?: string;
      customer_details?: {
        email?: string;
      };
      amount_total?: number;
      currency?: string;
      payment_status?: string;
      status?: string;
    };
  };
};

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (secret) {
    if (!signature || !verifyStripeSignature(payload, signature, secret)) {
      return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
    }
  }

  let event: StripeEvent;

  try {
    event = JSON.parse(payload) as StripeEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data?.object;

    if (!session) {
      return NextResponse.json({ received: true, ignored: true });
    }

    if (session.payment_status !== "paid" && session.status !== "complete") {
      return NextResponse.json({ received: true, ignored: true });
    }

    const email = session.customer_details?.email ?? session.customer_email;

    if (email) {
      await recordPurchaseFromStripe({
        email,
        checkoutId: session.id ?? event.id,
        amountTotal: session.amount_total,
        currency: session.currency
      });
    }
  }

  return NextResponse.json({ received: true });
}
