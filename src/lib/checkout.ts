import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { depositTotal, packageById } from "@/data/book";

const Input = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().min(3).max(120),
  packageId: z.enum(["camp", "stay-2bed-4", "stay-2bed-3", "stay-1bed-2", "stay-1bed-1"]),
  weeks: z.array(z.enum(["week-1", "week-2", "week-3"])).min(1).max(3),
  partySize: z.number().int().min(1).max(8),
  origin: z.string().min(8).max(200),
});

export type CheckoutInput = z.infer<typeof Input>;

export const createCampCheckout = createServerFn({ method: "POST" })
  .validator(Input)
  .handler(async ({ data }) => {
    const pack = packageById(data.packageId);
    const amount = depositTotal(data.partySize, data.weeks);
    const weeksLabel = data.weeks
      .map((week) => week.replace("week-", "Week "))
      .join(", ");
    const summary = {
      amount,
      packageName: pack.name,
      weeksLabel,
      partySize: data.partySize,
    };

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return { mode: "preview" as const, clientSecret: null, publishableKey: null, ...summary };
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(secret);
    const returnUrl = `${data.origin.replace(/\/$/, "")}/book/thanks?session_id={CHECKOUT_SESSION_ID}`;
    const line_items = [
      {
        price_data: {
          currency: "gbp",
          unit_amount: amount,
          product_data: {
            name: `Lanzarote 2027 deposit · ${pack.name}`,
            description: `${weeksLabel} · ${data.partySize} ${data.partySize === 1 ? "person" : "people"}. Holds the place. Balance later.`,
          },
        },
        quantity: 1,
      },
    ];
    const metadata = {
      name: data.name,
      email: data.email,
      packageId: data.packageId,
      weeks: data.weeks.join(","),
      partySize: String(data.partySize),
    };

    const base = {
      mode: "payment" as const,
      customer_email: data.email,
      line_items,
      metadata,
      return_url: returnUrl,
    };

    try {
      const session = await stripe.checkout.sessions.create({
        ...base,
        ui_mode: "embedded_page",
      } as Parameters<typeof stripe.checkout.sessions.create>[0]);
      return {
        mode: "stripe" as const,
        clientSecret: session.client_secret,
        publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY ?? process.env.STRIPE_PUBLISHABLE_KEY ?? null,
        ...summary,
      };
    } catch {
      const session = await stripe.checkout.sessions.create({
        ...base,
        ui_mode: "embedded",
      } as Parameters<typeof stripe.checkout.sessions.create>[0]);
      return {
        mode: "stripe" as const,
        clientSecret: session.client_secret,
        publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY ?? process.env.STRIPE_PUBLISHABLE_KEY ?? null,
        ...summary,
      };
    }
  });
