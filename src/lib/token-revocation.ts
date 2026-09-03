import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";

export const revokeTokens = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ scope: z.enum(["this", "all"]) }))
  .handler(async ({ context, data }): Promise<{ ok: true; scope: "this" | "all" }> => {
    const { assertZeroTrustRequest } = await import("@/lib/zero-trust.server");
    await assertZeroTrustRequest();
    const { revokeAllSessions, revokeThisSession } = await import("@/lib/token-revocation.server");
    if (data.scope === "all") await revokeAllSessions(context.userId);
    else await revokeThisSession(context.userId);
    return { ok: true, scope: data.scope };
  });
