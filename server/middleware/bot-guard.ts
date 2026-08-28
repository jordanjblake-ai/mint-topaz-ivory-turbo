/**
 * Blocks exploit probes, attack tools, and abusive crawlers before the app
 * renders. Allowlisted Hybrid bots can skip this with `X-Hybrid-Bot-Key`
 * matching HYBRID_BOT_KEY / BOT_ACCESS_KEY.
 */
import {
  clientIp,
  denyResponse,
  inspectRequest,
  logBotDecision,
  presentedBotKey,
} from "../../src/lib/bot-guard";

interface GuardEvent {
  url: URL;
  req: { method: string; headers: Headers };
}

export default async function botGuardMiddleware(
  event: GuardEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const headers = event.req.headers;
  const decision = inspectRequest({
    method: event.req.method ?? "GET",
    path: event.url.pathname,
    ip: clientIp(headers),
    userAgent: headers.get("user-agent") ?? "",
    botKey: presentedBotKey(headers),
    contentLength: Number(headers.get("content-length") ?? 0),
  });
  if (decision.action === "deny") {
    logBotDecision(decision, event.url.pathname, clientIp(headers), headers.get("user-agent") ?? "");
    return denyResponse(decision);
  }
  return next();
}
