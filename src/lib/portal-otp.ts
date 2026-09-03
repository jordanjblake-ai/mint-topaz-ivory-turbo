import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { personByEmail } from "@/data/camp";
import { isEmail } from "@/lib/guard";

const SENT = "If that email has a booking, we sent a code.";

function normalize(email: string) {
  return email.trim().toLowerCase();
}

async function cryptoApi() {
  return import("node:crypto");
}

async function hashCode(email: string, code: string) {
  const { createHash } = await cryptoApi();
  return createHash("sha256").update(`${email}:${code}`).digest("hex");
}

async function hashesMatch(left: string, right: string) {
  const { timingSafeEqual } = await cryptoApi();
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

async function hasBooking(email: string) {
  const person = personByEmail(email);
  if (person?.role === "player") return true;
  try {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql.query<{ n: number }>(
      "select count(*)::int as n from member_bookings where lower(email) = $1",
      [email],
    );
    return Number(rows[0]?.n ?? 0) > 0;
  } catch {
    return false;
  }
}

const EmailInput = z.object({
  email: z.string().trim().min(3).max(120),
});

const VerifyInput = z.object({
  email: z.string().trim().min(3).max(120),
  code: z.string().trim().min(4).max(8),
});

export const requestPortalCode = createServerFn({ method: "POST" })
  .validator(EmailInput)
  .handler(async ({ data }): Promise<{ status: "sent"; message: string }> => {
    const email = normalize(data.email);
    if (!isEmail(email)) throw new Error("That email does not look right.");

    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const hour = await sql.query<{ n: number }>(
      "select count(*)::int as n from portal_otp where email = $1 and created_at > now() - interval '1 hour'",
      [email],
    );
    if (Number(hour[0]?.n ?? 0) >= 5) {
      return { status: "sent", message: SENT };
    }

    const { randomInt } = await cryptoApi();
    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
    const id = `otp_${Date.now().toString(36)}_${randomInt(1e6, 9e6).toString(36)}`;
    await sql.query(
      `insert into portal_otp (id, email, code_hash, expires_at, attempts, created_at)
       values ($1, $2, $3, now() + interval '10 minutes', 0, now())`,
      [id, email, await hashCode(email, code)],
    );

    try {
      const { sendMail } = await import("@/lib/mail.server");
      await sendMail({
        to: [email],
        subject: "Your Hybrid portal code",
        text: `Your Hybrid portal code is ${code}. It expires in 10 minutes and can be used once.`,
      });
    } catch {
      /* same public message either way */
    }

    return { status: "sent", message: SENT };
  });

export const verifyPortalCode = createServerFn({ method: "POST" })
  .validator(VerifyInput)
  .handler(
    async ({
      data,
    }): Promise<
      | { status: "ok"; hasBooking: boolean; email: string }
      | { status: "invalid"; remaining: number }
      | { status: "locked" }
    > => {
      const email = normalize(data.email);
      const code = data.code.replace(/\D/g, "").slice(0, 6);
      if (!isEmail(email) || code.length !== 6) return { status: "invalid", remaining: 0 };

      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      const rows = await sql.query<{
        id: string;
        code_hash: string;
        attempts: number;
        expires_at: string;
        used_at: string | null;
      }>(
        `select id, code_hash, attempts, expires_at::text, used_at::text
         from portal_otp
         where email = $1
         order by created_at desc
         limit 1`,
        [email],
      );
      const row = rows[0];
      if (!row || row.used_at) return { status: "locked" };
      if (new Date(row.expires_at).getTime() < Date.now()) return { status: "locked" };
      if (row.attempts >= 3) return { status: "locked" };

      if (!(await hashesMatch(row.code_hash, await hashCode(email, code)))) {
        const attempts = row.attempts + 1;
        await sql.query("update portal_otp set attempts = $2 where id = $1", [row.id, attempts]);
        if (attempts >= 3) return { status: "locked" };
        return { status: "invalid", remaining: 3 - attempts };
      }

      await sql.query("update portal_otp set used_at = now(), attempts = attempts + 1 where id = $1", [row.id]);
      return { status: "ok", hasBooking: await hasBooking(email), email };
    },
  );
