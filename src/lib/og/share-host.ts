/** Hostname suitable for absolute og:image / x:game:image URLs. */
export function publicShareHost(hostHeader = ""): string {
  const env = String(import.meta.env.VITE_PUBLIC_HOSTNAME ?? "").trim();
  const raw = (env || hostHeader)
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
  if (!raw || !/^[a-z0-9.-]+$/.test(raw) || !raw.includes(".")) return "";
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(raw)) return "";
  return raw;
}

export function shareCardUrls(hostHeader = "") {
  const host = publicShareHost(hostHeader);
  if (!host) return { host: "", ogImage: "", xBanner: "" };
  return {
    host,
    ogImage: `https://${host}/og.jpg`,
    xBanner: `https://${host}/x-banner.jpg`,
  };
}
