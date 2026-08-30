import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { allowAttempt, isEmail } from "@/lib/guard";

const EnquiryInput = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().min(3).max(120),
  subject: z.string().trim().min(1).max(160),
  body: z.string().trim().min(1).max(4000),
  company: z.string().max(80).optional(),
});

function inbox() {
  return process.env.MAIL_TO?.trim() || "support@hybridvacations.com";
}

export const submitEnquiry = createServerFn({ method: "POST" })
  .validator(EnquiryInput)
  .handler(async ({ data }): Promise<{ status: "sent" | "logged" }> => {
    if (data.company?.trim()) return { status: "logged" };
    if (!isEmail(data.email)) throw new Error("That email does not look right.");

    const { assertSameSiteRequest } = await import("@/lib/auth/isolation.server");
    assertSameSiteRequest();

    const key = data.email.trim().toLowerCase();
    if (!allowAttempt(`enquiry:${key}`, 5, 10 * 60_000)) {
      throw new Error("Too many submissions just now. Wait a few minutes and try again.");
    }

    const { sendMail } = await import("@/lib/mail.server");
    return sendMail({
      to: [inbox()],
      replyTo: data.email.trim(),
      subject: data.subject,
      text: [
        data.body,
        "",
        `From: ${data.name}`,
        `Reply-to: ${data.email}`,
      ].join("\n"),
    });
  });
