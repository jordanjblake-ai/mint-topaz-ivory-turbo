/**
 * Optional asset CDN. Preview stays same-origin.
 * On go-live set VITE_CDN_ORIGIN (e.g. https://cdn.hybridvacations.com)
 * and point that host at this app, or put Cloudflare in front of the domain.
 *
 * Set VITE_DEPLOY_ID (or VITE_CACHE_BUST) on each production build so photo
 * URLs change and old CDN copies miss without a purge.
 */
const raw = (import.meta.env.VITE_CDN_ORIGIN as string | undefined)?.trim() ?? "";
export const CDN_ORIGIN = raw.replace(/\/$/, "");

const deployRaw =
  (import.meta.env.VITE_DEPLOY_ID as string | undefined)?.trim() ||
  (import.meta.env.VITE_CACHE_BUST as string | undefined)?.trim() ||
  "";
export const DEPLOY_ID = deployRaw.slice(0, 24);

const CDN_PATHS = ["/images/", "/assets/", "/art/", "/logos/", "/calendar/", "/og.jpg", "/x-banner.jpg", "/favicon.svg"];

export function isCdnPath(path: string) {
  return CDN_PATHS.some((prefix) => (prefix.endsWith("/") ? path.startsWith(prefix) : path === prefix));
}

export function withCacheBust(url: string) {
  if (!DEPLOY_ID) return url;
  if (!url || url.startsWith("data:") || url.startsWith("blob:")) return url;
  if (/[?&]v=/.test(url)) return url;
  return `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(DEPLOY_ID)}`;
}

export function cdnUrl(path: string) {
  if (!path || path.startsWith("data:") || path.startsWith("blob:")) return path;
  if (/^https?:\/\//i.test(path) || path.startsWith("//")) return withCacheBust(path);
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (!CDN_ORIGIN || !isCdnPath(clean)) return withCacheBust(clean);
  return withCacheBust(`${CDN_ORIGIN}${clean}`);
}

export function cdnSrcSet(srcSet: string | undefined) {
  if (!srcSet) return srcSet;
  return srcSet
    .split(",")
    .map((part) => {
      const trimmed = part.trim();
      const space = trimmed.lastIndexOf(" ");
      if (space === -1) return cdnUrl(trimmed);
      return `${cdnUrl(trimmed.slice(0, space))} ${trimmed.slice(space + 1)}`;
    })
    .join(", ");
}

export function cdnPreconnectLinks(): {
  rel: string;
  href: string;
  crossOrigin?: "anonymous";
}[] {
  const links: { rel: string; href: string; crossOrigin?: "anonymous" }[] = [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  ];
  if (CDN_ORIGIN) {
    links.unshift({ rel: "preconnect", href: CDN_ORIGIN, crossOrigin: "anonymous" });
  }
  return links;
}

export const FONT_STYLESHEET =
  "https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Caveat:wght@500;600&family=Great+Vibes&family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap";
