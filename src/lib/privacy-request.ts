import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { allowAttempt, isEmail } from "@/lib/guard";

export const PRIVACY_REQUEST_TYPES = [
  { value: "access", label: "Access — send me a copy of my data" },
  { value: "rectify", label: "Correction — something is wrong" },
  { value: "erase", label: "Erasure — delete my data" },
  { value: "port", label: "Portability — give me a file I can take elsewhere" },
  { value: "restrict", label: "Restriction — limit how you use it" },
  { value: "object", label: "Objection — stop a particular use" },
  { value: "withdraw", label: "Withdraw consent" },
] as const;

const Input = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().min(3).max(120),
  requestType: z.enum(PRIVACY_REQUEST_TYPES.map((item) => item.value) as [string, ...string[]]),
  detail: z.string().trim().max(2000),
  company: z.string().max(80).optional(),
});

function inbox() {
  return process.env.MAIL_TO?.trim() || "support@hybridvacations.com";
}

function typeLabel(value: string) {
  return PRIVACY_REQUEST_TYPES.find((item) => item.value === value)?.label ?? value;
}

export const submitPrivacyRequest = createServerFn({ method: "POST" })
  .validator(Input)
  .handler(async ({ data }): Promise<{ status: "sent" | "logged" }> => {
    if (data.company?.trim()) return { status: "logged" };
    if (!isEmail(data.email)) throw new Error("That email does not look right.");

    const { assertZeroTrustRequest, auditEvent } = await import("@/lib/zero-trust.server");
    await assertZeroTrustRequest();
    await auditEvent({ action: "privacy.request", outcome: "allow", detail: data.requestType });

    const key = data.email.trim().toLowerCase();
    if (!allowAttempt(`privacy:${key}`, 4, 10 * 60_000)) {
      throw new Error("Too many requests just now. Wait a few minutes and try again.");
    }

    const id = `pr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    try {
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      await sql`
        insert into privacy_requests (id, request_type, name, email, detail, status, created_at)
        values (
          ${id},
          ${data.requestType},
          ${data.name.trim()},
          ${key},
          ${data.detail.trim()},
          ${"received"},
          now()
        )
      `;
    } catch (err) {
      console.error("[privacy-request] store failed", err instanceof Error ? err.message : "unknown");
    }

    const { sendMail } = await import("@/lib/mail.server");
    return sendMail({
      to: [inbox()],
      replyTo: data.email.trim(),
      subject: `Privacy request (${data.requestType}) from ${data.name.trim()}`,
      text: [
        `Type: ${typeLabel(data.requestType)}`,
        `Name: ${data.name.trim()}`,
        `Email: ${data.email.trim()}`,
        `Reference: ${id}`,
        "",
        data.detail.trim() || "(no extra detail)",
        "",
        "Respond within one month. Verify identity before releasing or deleting data.",
      ].join("\n"),
    });
  });
