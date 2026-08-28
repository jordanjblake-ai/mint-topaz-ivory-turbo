import { sameText } from "./guard";

export const BOT_KEY_HEADER = "x-hybrid-bot-key";

export type BotDecision =
  | { action: "allow"; reason: string }
  | { action: "deny"; status: 403 | 404 | 413 | 429; reason: string; retryAfter?: number };

const SEARCH_BOT =
  /\b(googlebot|google-inspectiontool|bingbot|adidxbot|duckduckbot|slurp|applebot|yandex(bot|images)|baiduspider)\b/i;
const SOCIAL_PREVIEW =
  /\b(facebookexternalhit|facebot|meta-externalagent|twitterbot|linkedinbot|whatsapp|telegrambot|slackbot|discordbot|pinterestbot|redditbot|iframely)\b/i;
const ATTACK_TOOL =
  /\b(sqlmap|nikto|nessus|masscan|zgrab|nmap(?:\s|\/)|nuclei|dirbuster|wpscan|havij|acunetix|openvas|fuzzfaster|httpx\/|gobuster|ffuf|wfuzz|zaproxy|burpsuite|zmap|slowloris|hydra|medusa)\b/i;
const ABUSE_CRAWLER =
  /\b(bytespider|petalbot|semrushbot|ahrefsbot|mj12bot|dotbot|megaindex|blexbot|dataforseobot|serpstatbot|majestic12|seekport|zoominfobot|amazonbot|gptbot|chatgpt-user|ccbot|claudebot|claude-web|anthropic-ai|cohere-ai|perplexitybot|youbot|google-extended|applebot-extended|facebookbot)\b/i;

const PROBE_PATH =
  /(?:^|\/)(?:wp-admin|wp-login|wp-content|wordpress|xmlrpc\.php|phpmyadmin|pma|adminer|cgi-bin|vendor\/phpunit|actuator|manager\/html|solr|owa|remote\/login)(?:\/|$)/i;
const PROBE_FILE = /(?:\/(?:\.env|\.git|\.svn|\.htaccess|\.aws|id_rsa)(?:\/|$))|\.(?:php|asp|aspx|jsp|cgi)(?:$|\?)/i;

const HEALTH_PATH = /^\/(?:health(?:z|\/live|\/ready)?|livez|readyz)$/;
const STATIC_PATH =
  /^\/(?:assets|images|calendar|__grok|favicon\.svg|og\.jpg|og\.png|x-banner\.jpg|robots\.txt|sitemap\.xml)(?:\/|$)/;

const hits = new Map<string, number[]>();

function env(name: string) {
  return typeof process !== "undefined" ? String(process.env[name] ?? "").trim() : "";
}

function configuredBotKey() {
  return env("HYBRID_BOT_KEY") || env("BOT_ACCESS_KEY");
}

export function isLoopbackIp(ip: string) {
  const value = ip.trim().toLowerCase();
  return (
    value === "127.0.0.1" ||
    value === "::1" ||
    value === "localhost" ||
    value.startsWith("127.") ||
    value === "::ffff:127.0.0.1"
  );
}

export function headerValue(
  headers: Headers | Record<string, string | string[] | undefined>,
  name: string,
) {
  const lower = name.toLowerCase();
  if (headers instanceof Headers) return headers.get(name) ?? headers.get(lower) ?? "";
  const raw = headers[name] ?? headers[lower];
  if (Array.isArray(raw)) return raw[0] ?? "";
  return raw ?? "";
}

export function clientIp(headers: Headers | Record<string, string | string[] | undefined>) {
  const cf = headerValue(headers, "cf-connecting-ip").split(",")[0].trim();
  if (cf) return cf;
  const real = headerValue(headers, "x-real-ip") || headerValue(headers, "x-vercel-forwarded-for");
  if (real) return real.split(",")[0].trim();
  const forwarded = headerValue(headers, "x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "";
}

export function presentedBotKey(headers: Headers | Record<string, string | string[] | undefined>) {
  const dedicated = headerValue(headers, BOT_KEY_HEADER).trim();
  if (dedicated) return dedicated;
  const auth = headerValue(headers, "authorization").trim();
  if (/^bearer\s+/i.test(auth)) return auth.replace(/^bearer\s+/i, "").trim();
  return "";
}

function hasValidBotKey(presented: string) {
  const expected = configuredBotKey();
  if (!expected || !presented) return false;
  return sameText(expected, presented);
}

function prune(now: number) {
  if (hits.size < 4000) return;
  for (const [key, stamps] of hits) {
    const recent = stamps.filter((stamp) => now - stamp < 60_000);
    if (recent.length) hits.set(key, recent);
    else hits.delete(key);
  }
}

function limited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  prune(now);
  const recent = (hits.get(key) ?? []).filter((stamp) => now - stamp < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > max;
}

function enforceRateLimits() {
  if (typeof process === "undefined") return false;
  return Boolean(process.env.VERCEL) || process.env.NODE_ENV === "production";
}

export function inspectRequest(input: {
  method: string;
  path: string;
  ip: string;
  userAgent: string;
  botKey: string;
  contentLength?: number;
}): BotDecision {
  const method = input.method.toUpperCase();
  const path = input.path.split("?")[0] || "/";
  const ua = input.userAgent.trim();
  const ip = input.ip.trim() || "unknown";

  if (hasValidBotKey(input.botKey)) {
    return { action: "allow", reason: "bot-key" };
  }

  if (HEALTH_PATH.test(path) || STATIC_PATH.test(path)) {
    return { action: "allow", reason: "public-asset" };
  }

  if (PROBE_PATH.test(path) || PROBE_FILE.test(path)) {
    return { action: "deny", status: 404, reason: "probe-path" };
  }

  if (Number(input.contentLength) > 1_000_000) {
    return { action: "deny", status: 413, reason: "payload" };
  }

  if (ATTACK_TOOL.test(ua)) {
    return { action: "deny", status: 403, reason: "attack-tool" };
  }

  if (ABUSE_CRAWLER.test(ua) && !SEARCH_BOT.test(ua) && !SOCIAL_PREVIEW.test(ua)) {
    return { action: "deny", status: 403, reason: "blocked-crawler" };
  }

  const local = isLoopbackIp(ip);
  if (!ua && enforceRateLimits() && !local && method !== "OPTIONS") {
    return { action: "deny", status: 403, reason: "empty-ua" };
  }

  if (SEARCH_BOT.test(ua) || SOCIAL_PREVIEW.test(ua)) {
    return { action: "allow", reason: "known-bot" };
  }

  if (!enforceRateLimits() || local || method === "OPTIONS" || method === "HEAD") {
    return { action: "allow", reason: "ok" };
  }

  const write = method !== "GET";
  const sensitive = path.startsWith("/api") || path.startsWith("/login") || path.startsWith("/ops");
  const max = write ? 20 : sensitive ? 40 : 180;
  const bucket = write ? "write" : sensitive ? "sensitive" : "read";
  if (limited(`${ip}:${bucket}`, max, 60_000)) {
    return { action: "deny", status: 429, reason: "rate", retryAfter: 60 };
  }

  return { action: "allow", reason: "ok" };
}

export function denyResponse(decision: Extract<BotDecision, { action: "deny" }>) {
  const headers = new Headers({
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "private, no-store",
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
  });
  if (decision.retryAfter) headers.set("retry-after", String(decision.retryAfter));
  const body =
    decision.status === 429
      ? "Too Many Requests"
      : decision.status === 413
        ? "Payload Too Large"
        : decision.status === 404
          ? "Not Found"
          : "Forbidden";
  return new Response(body, { status: decision.status, headers });
}

export function logBotDecision(
  decision: BotDecision,
  path: string,
  ip: string,
  userAgent: string,
) {
  if (decision.action !== "deny") return;
  console.warn(
    `[bot-guard] ${decision.status} ${decision.reason} ${ip} ${path} ${userAgent.slice(0, 80)}`,
  );
}
