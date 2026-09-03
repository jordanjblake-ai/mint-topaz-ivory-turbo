import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { allowAttempt, isEmail } from "@/lib/guard";
import { BOOK_WEEKS, campTotal, chargeTotal, packageById, pounds, type BookPayment } from "@/data/book";

const Payment = z.enum(["deposit", "paid_in_full"]);

const Input = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().min(3).max(120),
  packageId: z.enum(["camp", "stay-2bed-4", "stay-2bed-3", "stay-1bed-2", "stay-1bed-1"]),
  weeks: z.array(z.enum(["week-1", "week-2", "week-3"])).min(1).max(3),
  partySize: z.number().int().min(1).max(8),
  payment: Payment,
  origin: z.string().min(8).max(200),
});

const PaidInput = z.object({
  sessionId: z.string().trim().max(200).optional(),
  name: z.string().trim().max(80).optional(),
  email: z.string().trim().max(120).optional(),
  packageId: z.enum(["camp", "stay-2bed-4", "stay-2bed-3", "stay-1bed-2", "stay-1bed-1"]).optional(),
  weeks: z.array(z.enum(["week-1", "week-2", "week-3"])).max(3).optional(),
  partySize: z.number().int().min(1).max(8).optional(),
  payment: Payment.optional(),
  amountCharged: z.number().int().min(0).optional(),
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
  payment: BookPayment;
}) {
  const pack = packageById(opts.packageId);
  const full = opts.payment === "paid_in_full";
  const paidLine = full
    ? "Lanzarote paid in full. Nothing further due for this week. Do not send January balance chasers."
    : "Lanzarote deposit paid.";
  const startedLine = full
    ? "Lanzarote booking form completed. Full payment checkout opened."
    : "Lanzarote booking form completed. Deposit checkout opened.";
  return [
    opts.stage === "paid" ? paidLine : startedLine,
    "",
    `Name: ${opts.name}`,
    `Email: ${opts.email}`,
    `Package: ${pack.name}`,
    `Payment: ${full ? "paid_in_full" : "deposit"}`,
    `Weeks: ${weeksLabel(opts.weeks)}`,
    `People: ${opts.partySize}`,
    `Amount charged: ${pounds(opts.amount)}`,
    full ? "Balance: none." : `Camp total: ${pounds(campTotal(opts.packageId, opts.partySize, opts.weeks))}`,
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

export async function fulfillPaidDeposit(opts: {
  sessionId?: string;
  name: string;
  email: string;
  packageId: string;
  weeks: string[];
  partySize: number;
  payment?: BookPayment;
  amountCharged?: number;
}): Promise<"sent" | "skipped"> {
  const name = opts.name.trim();
  const email = opts.email.trim();
  const weeks = opts.weeks.length ? opts.weeks : ["week-1"];
  const partySize = opts.partySize || 1;
  const packageId = opts.packageId || "camp";
  const payment: BookPayment = opts.payment === "paid_in_full" ? "paid_in_full" : "deposit";
  const amount = opts.amountCharged && opts.amountCharged > 0
    ? opts.amountCharged
    : chargeTotal(packageId, partySize, weeks, payment);
  const key = opts.sessionId
    ? `booking-paid:${opts.sessionId}`
    : `booking-paid:${email.toLowerCase()}`;
  const windowMs = opts.sessionId ? 24 * 60 * 60 * 1000 : 10 * 60 * 1000;
  if (!allowAttempt(key, 1, windowMs)) return "skipped";
  if (!name || !isEmail(email)) return "skipped";

  try {
    const { recordPaidBooking } = await import("@/lib/member-profile");
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const session = await getSessionUser().catch(() => null);
    const pack = packageById(packageId);
    await recordPaidBooking({
      id: opts.sessionId || `lanzarote-${email.toLowerCase()}-${packageId}-${weeks.join("-")}`,
      userId: session?.id ?? null,
      email,
      kind: "camp",
      product: "lanzarote",
      packageId,
      weeks,
      partySize,
      payment,
      amountCharged: amount,
      title: "Lanzarote Beach Volleyball 2027",
      detail: `${pack.name} · ${payment === "paid_in_full" ? "paid in full" : "deposit"} · ${pounds(amount)} · ${weeksLabel(weeks)} · ${partySize} ${partySize === 1 ? "person" : "people"}`,
    });
  } catch {
    /* dashboard list can catch up later */
  }
  await emailHybrid(
    payment === "paid_in_full" ? `Hybrid Booking paid in full: ${name}` : `Hybrid Booking deposit paid: ${name}`,
    bookingText({
      stage: "paid",
      name,
      email,
      packageId,
      weeks,
      partySize,
      amount,
      payment,
    }),
    email,
  );
  return "sent";
}

export const createCampCheckout = createServerFn({ method: "POST" })
  .validator(Input)
  .handler(async ({ data }) => {
    const { assertZeroTrustRequest, auditEvent } = await import("@/lib/zero-trust.server");
    await assertZeroTrustRequest();
    await auditEvent({ action: "booking.start", outcome: "allow", detail: data.packageId });
    const pack = packageById(data.packageId);
    const payment: BookPayment = data.payment === "paid_in_full" ? "paid_in_full" : "deposit";
    const amount = chargeTotal(data.packageId, data.partySize, data.weeks, payment);
    const label = weeksLabel(data.weeks);
    const summary = {
      amount,
      payment,
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
        payment,
      }),
      data.email,
    );

    const { getStripe, stripeConfigured, stripePublishableKey } = await import("@/lib/stripe.server");
    const stripe = getStripe();
    if (!stripe || !stripeConfigured()) {
      return { mode: "preview" as const, clientSecret: null, publishableKey: null, ...summary };
    }

    const returnUrl = `${data.origin.replace(/\/$/, "")}/book/thanks?session_id={CHECKOUT_SESSION_ID}`;
    const full = payment === "paid_in_full";
    const line_items = [
      {
        price_data: {
          currency: "gbp",
          unit_amount: amount,
          product_data: {
            name: full
              ? `Lanzarote 2027 · ${pack.name}`
              : `Lanzarote 2027 deposit · ${pack.name}`,
            description: full
              ? `${label} · ${data.partySize} ${data.partySize === 1 ? "person" : "people"}. Paid in full. Nothing further due for this week.`
              : `${label} · ${data.partySize} ${data.partySize === 1 ? "person" : "people"}. Holds the place. Camp balance 15 January. Stay balance 1 January if you took an apartment.`,
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
      payment,
      amountCharged: String(amount),
    };

    const base = {
      mode: "payment" as const,
      customer_email: data.email,
      line_items,
      metadata,
      locale: "en-GB" as const,
      billing_address_collection: "auto" as const,
      payment_intent_data: {
        description: full
          ? `Hybrid Lanzarote 2027 paid in full · ${data.name}`
          : `Hybrid Lanzarote 2027 deposit · ${data.name}`,
        statement_descriptor_suffix: "LANZAROTE",
      },
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
        publishableKey: stripePublishableKey() || null,
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
        publishableKey: stripePublishableKey() || null,
        ...summary,
      };
    }
  });

export const confirmCampDeposit = createServerFn({ method: "POST" })
  .validator(PaidInput)
  .handler(async ({ data }): Promise<{
    status: "sent" | "logged" | "skipped";
    payment: BookPayment;
    amountCharged: number;
  }> => {
    const { assertZeroTrustRequest, auditEvent } = await import("@/lib/zero-trust.server");
    await assertZeroTrustRequest();
    await auditEvent({ action: "booking.confirm", outcome: "allow" });
    let name = data.name?.trim() ?? "";
    let email = data.email?.trim() ?? "";
    let packageId = data.packageId ?? "camp";
    let weeks = data.weeks ?? ["week-1"];
    let partySize = data.partySize ?? 1;
    let payment: BookPayment = data.payment === "paid_in_full" ? "paid_in_full" : "deposit";
    let amountCharged = data.amountCharged ?? 0;

    if (data.sessionId) {
      const { getStripe, parseCheckoutMetadata } = await import("@/lib/stripe.server");
      const stripe = getStripe();
      if (!stripe) return { status: "skipped", payment, amountCharged };
      const session = await stripe.checkout.sessions.retrieve(data.sessionId);
      const paid = session.payment_status === "paid" || session.status === "complete";
      if (!paid) return { status: "skipped", payment, amountCharged };
      const parsed = parseCheckoutMetadata(session);
      name = parsed.name || name;
      email = parsed.email || email;
      packageId = (parsed.packageId as typeof packageId) || packageId;
      weeks = (parsed.weeks.length ? parsed.weeks : weeks) as typeof weeks;
      partySize = parsed.partySize || partySize;
      payment = parsed.payment === "paid_in_full" ? "paid_in_full" : "deposit";
      amountCharged = parsed.amountCharged || amountCharged;
    }

    if (!amountCharged) amountCharged = chargeTotal(packageId, partySize, weeks, payment);

    const status = await fulfillPaidDeposit({
      sessionId: data.sessionId,
      name,
      email,
      packageId,
      weeks,
      partySize,
      payment,
      amountCharged,
    });
    return { status, payment, amountCharged };
  });
