export type OutboundMail = {
  to: string[];
  cc?: string[];
  replyTo?: string;
  subject: string;
  text: string;
};

export type MailResult = { status: "sent" | "logged"; id?: string };

function fromAddress() {
  return process.env.MAIL_FROM?.trim() || "Hybrid Camp <support@hybridvacations.com>";
}

export async function sendMail(mail: OutboundMail): Promise<MailResult> {
  const to = [...new Set(mail.to.map((item) => item.trim().toLowerCase()).filter(Boolean))];
  const cc = [...new Set((mail.cc ?? []).map((item) => item.trim().toLowerCase()).filter(Boolean))].filter(
    (item) => !to.includes(item),
  );
  if (!to.length) return { status: "logged" };

  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return { status: "logged" };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress(),
      to,
      cc: cc.length ? cc : undefined,
      reply_to: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(detail || "Email did not send.");
  }
  const payload = (await res.json().catch(() => ({}))) as { id?: string };
  return { status: "sent", id: payload.id };
}
