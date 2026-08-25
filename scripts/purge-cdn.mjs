#!/usr/bin/env node
/**
 * Post-deploy cache invalidation.
 *   CACHE_PURGE_SECRET=… node scripts/purge-cdn.mjs html
 *   CF_API_TOKEN=… CF_ZONE_ID=… node scripts/purge-cdn.mjs images
 */
const scope = process.argv[2] || "html";
const origin = process.env.BETTER_AUTH_URL || process.env.SITE_ORIGIN || "http://127.0.0.1:8080";
const secret = process.env.CACHE_PURGE_SECRET || "";

if (!secret) {
  console.log(JSON.stringify({ ok: true, mode: "soft", scope, note: "No CACHE_PURGE_SECRET. Pages revalidate in 5 minutes." }));
  process.exit(0);
}

const res = await fetch(`${origin.replace(/\/$/, "")}/api/cache/purge`, {
  method: "POST",
  headers: {
    authorization: `Bearer ${secret}`,
    "content-type": "application/json",
  },
  body: JSON.stringify({ scope }),
});
const body = await res.text();
if (!res.ok) {
  console.error(body);
  process.exit(1);
}
console.log(body);
