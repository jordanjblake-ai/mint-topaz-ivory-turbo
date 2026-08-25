import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SITE_ORIGIN } from "@/data/seo";

export const PURGE_SCOPES = ["html", "images", "calendar", "meta", "all"] as const;
export type PurgeScope = (typeof PURGE_SCOPES)[number];

const SCOPE_TAGS: Record<PurgeScope, string[]> = {
  html: ["html", "marketing"],
  images: ["image", "derived"],
  calendar: ["calendar"],
  meta: ["meta"],
  all: ["html", "marketing", "image", "derived", "calendar", "meta", "redirect"],
};

const hits = new Map<string, { n: number; t: number }>();

function limited(key: string, max = 8, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const row = hits.get(key);
  if (!row || now - row.t > windowMs) {
    hits.set(key, { n: 1, t: now });
    return false;
  }
  row.n += 1;
  return row.n > max;
}

function env(name: string) {
  return typeof process !== "undefined" ? process.env[name]?.trim() : "";
}

type ProviderResult = { provider: string; ok: boolean; mode: "purged" | "dry" | "skipped"; detail: string };

async function purgeCloudflare(tags: string[], everything: boolean): Promise<ProviderResult> {
  const token = env("CF_API_TOKEN") || env("CLOUDFLARE_API_TOKEN");
  const zone = env("CF_ZONE_ID") || env("CLOUDFLARE_ZONE_ID");
  if (!token || !zone) {
    return { provider: "cloudflare", ok: true, mode: "skipped", detail: "No Cloudflare token on this host." };
  }
  const body = everything ? { purge_everything: true } : { tags };
  const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zone}/purge_cache`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    return { provider: "cloudflare", ok: false, mode: "purged", detail: text.slice(0, 240) };
  }
  return { provider: "cloudflare", ok: true, mode: "purged", detail: everything ? "everything" : tags.join(", ") };
}

async function purgeVercel(tags: string[]): Promise<ProviderResult> {
  const token = env("VERCEL_ACCESS_TOKEN") || env("VERCEL_TOKEN");
  const team = env("VERCEL_TEAM_ID");
  if (!token) {
    return { provider: "vercel", ok: true, mode: "skipped", detail: "No Vercel token on this host." };
  }
  const url = new URL("https://api.vercel.com/v1/edge-cache/invalidate-by-tags");
  if (team) url.searchParams.set("teamId", team);
  const res = await fetch(url, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ tags }),
  });
  if (res.status === 404 || res.status === 405) {
    return { provider: "vercel", ok: true, mode: "skipped", detail: "This Vercel project has no tag purge API." };
  }
  const text = await res.text();
  if (!res.ok) {
    return { provider: "vercel", ok: false, mode: "purged", detail: text.slice(0, 240) };
  }
  return { provider: "vercel", ok: true, mode: "purged", detail: tags.join(", ") };
}

export async function purgeByScope(scope: PurgeScope): Promise<{
  ok: boolean;
  scope: PurgeScope;
  tags: string[];
  origin: string;
  soft: string;
  providers: ProviderResult[];
}> {
  const tags = SCOPE_TAGS[scope];
  const everything = scope === "all";
  const providers = await Promise.all([purgeCloudflare(tags, everything), purgeVercel(tags)]);
  const hard = providers.some((item) => item.mode === "purged");
  return {
    ok: providers.every((item) => item.ok),
    scope,
    tags,
    origin: SITE_ORIGIN,
    soft: hard
      ? "Edge copies for those tags were dropped."
      : scope === "html"
        ? "No purge API is configured. Public pages revalidate within 5 minutes on their own."
        : "No purge API is configured. Photos refresh on the next deploy id, or within their CDN TTL.",
    providers,
  };
}

function authorised(request: Request) {
  const secret = env("CACHE_PURGE_SECRET");
  if (!secret) return false;
  const header = request.headers.get("authorization") || request.headers.get("x-hybrid-purge") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : header.trim();
  return token === secret;
}

export async function handlePurgeRequest(request: Request) {
  if (!authorised(request)) {
    return new Response(JSON.stringify({ ok: false, error: "Unauthorised." }), {
      status: 401,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  }
  if (limited("api")) {
    return new Response(JSON.stringify({ ok: false, error: "Too many purges." }), {
      status: 429,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  }
  let scope: PurgeScope = "html";
  try {
    const body = (await request.json()) as { scope?: string };
    if (body.scope && (PURGE_SCOPES as readonly string[]).includes(body.scope)) {
      scope = body.scope as PurgeScope;
    }
  } catch {
    /* default html */
  }
  const result = await purgeByScope(scope);
  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 502,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export const purgeHybridCache = createServerFn({ method: "POST" })
  .validator(z.object({ scope: z.enum(PURGE_SCOPES) }))
  .handler(async ({ data }) => {
    if (limited("desk")) throw new Error("Too many purges this hour.");
    return purgeByScope(data.scope);
  });
