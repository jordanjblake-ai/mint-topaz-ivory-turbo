export const SITE_ORIGIN = "https://hybridvacations.com";

export const publicPages = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/vacations", changefreq: "weekly", priority: "0.9" },
  { path: "/vacations/lanzarote", changefreq: "weekly", priority: "0.9" },
  { path: "/vacations/tennis", changefreq: "monthly", priority: "0.6" },
  { path: "/vacations/padel", changefreq: "monthly", priority: "0.6" },
  { path: "/coaching", changefreq: "monthly", priority: "0.8" },
  { path: "/coaches", changefreq: "monthly", priority: "0.7" },
  { path: "/travel", changefreq: "monthly", priority: "0.6" },
  { path: "/book", changefreq: "weekly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.5" },
  { path: "/story-time", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/cookies", changefreq: "yearly", priority: "0.3" },
] as const;

const PRIVATE_PREFIXES = [
  "/ops",
  "/camp",
  "/portal",
  "/coaches-corner",
  "/book/thanks",
  "/health",
  "/healthz",
  "/livez",
  "/readyz",
  "/login",
  "/api",
];

export function normalizePath(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  const clean = pathname.split("?")[0].split("#")[0];
  return clean.length > 1 ? clean.replace(/\/+$/, "") : "/";
}

export function isIndexable(pathname: string) {
  const path = normalizePath(pathname);
  return !PRIVATE_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export function canonicalUrl(pathname: string) {
  const path = normalizePath(pathname);
  return path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;
}

export function sitemapXml(lastmod = "2026-08-24") {
  const urls = publicPages
    .map(
      (page) => `  <url>
    <loc>${canonicalUrl(page.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function robotsTxt() {
  return `User-agent: *
Allow: /
Disallow: /ops
Disallow: /camp
Disallow: /portal
Disallow: /coaches-corner
Disallow: /book/thanks
Disallow: /health
Disallow: /healthz
Disallow: /livez
Disallow: /readyz
Disallow: /login
Disallow: /api

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;
}
