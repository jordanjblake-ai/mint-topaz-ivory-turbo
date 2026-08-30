import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { allowAttempt, isEmail } from "@/lib/guard";
import { BOOK_WEEKS, depositTotal, packageById, pounds } from "@/data/book";

const Input = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().min(3).max(120),
  packageId: z.enum(["camp", "stay-2bed-4", "stay-2bed-3", "stay-1bed-2", "stay-1bed-1"]),
  weeks: z.array(z.enum(["week-1", "week-2", "week-3"])).min(1).max(3),
  partySize: z.number().int().min(1).max(8),
  origin: z.string().min(8).max(200),
});

const PaidInput = z.object({
  sessionId: z.string().trim().max(200).optional(),
  name: z.string().trim().max(80).optional(),
  email: z.string().trim().max(120).optional(),
  packageId: z.enum(["camp", "stay-2bed-4", "stay-2bed-3", "stay-1bed-2", "stay-1bed-1"]).optional(),
  weeks: z.array(z.enum(["week-1", "week-2", "week-3"])).max(3).optional(),
  partySize: z.number().int().min(1).max(8).optional(),
});

export type CheckoutInput = z.infer<typeof Input>;

function inbox() {
  return process.env.MAIL_TO?.trim() || "support@hybridvacations.com";
}

function weeksLabel(weeks: string[]) {
  return weeks
    .map((id) => BOOK_WEEKS.find((week) => week.id === id))
    .filter(Boolean)
    .map((week) => `${week!.label} (${week!.range})`)
    .join(", ");
}

function bookingText(opts: {
  stage: "started" | "paid";
  name: string;
  email: string;
  packageId: string;
  weeks: string[];
  partySize: number;
  amount: number;
}) {
  const pack = packageById(opts.packageId);
  return [
    opts.stage === "paid" ? "Lanzarote deposit paid." : "Lanzarote booking form completed. Checkout opened.",
    "",
    `Name: ${opts.name}`,
    `Email: ${opts.email}`,
    `Package: ${pack.name}`,
    `Weeks: ${weeksLabel(opts.weeks)}`,
    `People: ${opts.partySize}`,
    `Deposit: ${pounds(opts.amount)}`,
    `Camp total: ${pounds(pack.priceEach * opts.partySize * opts.weeks.length)}`,
    "",
    "Reply to this email to reach the guest.",
  ].join("\n");
}

async function emailHybrid(subject: string, text: string, replyTo: string) {
  try {
    const { sendMail } = await import("@/lib/mail.server");
    await sendMail({
      to: [inbox()],
      replyTo,
      subject,
      text,
    });
  } catch {
    /* booking must still complete if mail is down */
  }
}

export const createCampCheckout = createServerFn({ method: "POST" })
  .validator(Input)
  .handler(async ({ data }) => {
    const pack = packageById(data.packageId);
    const amount = depositTotal(data.partySize, data.weeks);
    const label = weeksLabel(data.weeks);
    const summary = {
      amount,
      packageName: pack.name,
      weeksLabel: label,
      partySize: data.partySize,
    };

    await emailHybrid(
      `Hybrid Booking started: ${data.name}`,
      bookingText({
        stage: "started",
        name: data.name,
        email: data.email,
        packageId: data.packageId,
        weeks: data.weeks,
        partySize: data.partySize,
        amount,
      }),
      data.email,
    );

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
            description: `${label} · ${data.partySize} ${data.partySize === 1 ? "person" : "people"}. Holds the place. Balance later.`,
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

export const confirmCampDeposit = createServerFn({ method: "POST" })
  .validator(PaidInput)
  .handler(async ({ data }): Promise<{ status: "sent" | "logged" | "skipped" }> => {
    let name = data.name?.trim() ?? "";
    let email = data.email?.trim() ?? "";
    let packageId = data.packageId ?? "camp";
    let weeks = data.weeks ?? ["week-1"];
    let partySize = data.partySize ?? 1;

    if (data.sessionId) {
      const secret = process.env.STRIPE_SECRET_KEY;
      if (!secret) return { status: "skipped" };
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(secret);
      const session = await stripe.checkout.sessions.retrieve(data.sessionId);
      const paid = session.payment_status === "paid" || session.status === "complete";
      if (!paid) return { status: "skipped" };
      const meta = session.metadata ?? {};
      name = meta.name || session.customer_details?.name || name;
      email = meta.email || session.customer_email || session.customer_details?.email || email;
      packageId = (meta.packageId as typeof packageId) || packageId;
      weeks = (meta.weeks ? meta.weeks.split(",") : weeks) as typeof weeks;
      partySize = Number(meta.partySize || partySize) || partySize;
      if (!allowAttempt(`booking-paid:${data.sessionId}`, 1, 24 * 60 * 60 * 1000)) {
        return { status: "skipped" };
      }
    } else if (!allowAttempt(`booking-paid:${email.toLowerCase()}`, 1, 10 * 60 * 1000)) {
      return { status: "skipped" };
    }

    if (!name || !isEmail(email)) return { status: "skipped" };

    const amount = depositTotal(partySize, weeks);
    await emailHybrid(
      `Hybrid Booking deposit paid: ${name}`,
      bookingText({
        stage: "paid",
        name,
        email,
        packageId,
        weeks,
        partySize,
        amount,
      }),
      email,
    );
    return { status: "sent" };
  });
