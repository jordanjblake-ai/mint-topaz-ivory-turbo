import Stripe from "stripe";

export function stripeSecret() {
  return process.env.STRIPE_SECRET_KEY?.trim() ?? "";
}

export function stripePublishableKey() {
  return (
    process.env.STRIPE_PUBLISHABLE_KEY?.trim() ||
    process.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim() ||
    ""
  );
}

export function stripeWebhookSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET?.trim() ?? "";
}

export function stripeConfigured() {
  return Boolean(stripeSecret() && stripePublishableKey());
}

export function getStripe() {
  const secret = stripeSecret();
  if (!secret) return null;
  return new Stripe(secret);
}

export function parseCheckoutMetadata(session: Stripe.Checkout.Session) {
  const meta = session.metadata ?? {};
  const name = meta.name || session.customer_details?.name || session.customer_email || "";
  const email = meta.email || session.customer_email || session.customer_details?.email || "";
  const packageId = meta.packageId || "camp";
  const weeks = meta.weeks ? meta.weeks.split(",").filter(Boolean) : ["week-1"];
  const partySize = Number(meta.partySize || 1) || 1;
  const payment = meta.payment === "paid_in_full" ? ("paid_in_full" as const) : ("deposit" as const);
  const amountCharged = Number(meta.amountCharged || 0) || 0;
  return { name, email, packageId, weeks, partySize, payment, amountCharged };
}
