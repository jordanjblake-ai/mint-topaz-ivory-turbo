import { INDEXNOW_KEY, SITE_ORIGIN, indexNowKeyUrl, publicPageUrls } from "@/data/seo";

const ENDPOINT = "https://api.indexnow.org/indexnow";

export async function submitIndexNow(urls: string[] = publicPageUrls()) {
  const host = new URL(SITE_ORIGIN).host;
  const list = [...new Set(urls)].filter((url) => url.startsWith(SITE_ORIGIN)).slice(0, 10_000);
  if (!list.length) return { ok: true, submitted: 0, detail: "Nothing to submit." };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      keyLocation: indexNowKeyUrl(),
      urlList: list,
    }),
  });
  const detail = await res.text().catch(() => "");
  if (!res.ok && res.status !== 202) {
    return { ok: false, submitted: 0, status: res.status, detail: detail.slice(0, 240) };
  }
  return { ok: true, submitted: list.length, status: res.status, detail: detail.slice(0, 120) };
}
