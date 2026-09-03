import { createFileRoute } from "@tanstack/react-router";
import { fulfillPaidDeposit } from "@/lib/checkout";
import { getStripe, parseCheckoutMetadata, stripeWebhookSecret } from "@/lib/stripe.server";

async function handleStripeWebhook(request: Request) {
  const secret = stripeWebhookSecret();
  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature") ?? "";
  if (!secret || !stripe || !signature) {
    return new Response("Stripe webhook is not configured", { status: 503 });
  }

  const payload = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object;
    const paid = session.payment_status === "paid" || session.status === "complete";
    if (paid) {
      const parsed = parseCheckoutMetadata(session);
      await fulfillPaidDeposit({
        sessionId: session.id,
        name: parsed.name,
        email: parsed.email,
        packageId: parsed.packageId,
        weeks: parsed.weeks,
        partySize: parsed.partySize,
        payment: parsed.payment,
        amountCharged: parsed.amountCharged,
      });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export const Route = createFileRoute("/api/stripe/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => handleStripeWebhook(request),
    },
  },
});
