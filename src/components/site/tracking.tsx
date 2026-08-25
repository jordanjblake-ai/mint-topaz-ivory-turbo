import { useRouterState } from "@tanstack/react-router";
import { useEffect, useSyncExternalStore } from "react";
import { GA_ID, META_PIXEL_ID, getConsent, subscribeConsent } from "@/lib/consent";

function loadScript(src: string, id: string) {
  if (document.getElementById(id)) return;
  const el = document.createElement("script");
  el.id = id;
  el.async = true;
  el.src = src;
  document.head.appendChild(el);
}

function bootGa(pagePath: string) {
  if (!GA_ID) return;
  if (window.gtag) {
    window.gtag("config", GA_ID, { page_path: pagePath, anonymize_ip: true });
    return;
  }
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { anonymize_ip: true, page_path: pagePath });
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`, "hybrid-ga");
}

function bootMeta() {
  if (!META_PIXEL_ID) return;
  if (window.fbq) {
    window.fbq("track", "PageView");
    return;
  }
  const fbq = function (...args: unknown[]) {
    (fbq.q = fbq.q ?? []).push(args);
  } as ((...args: unknown[]) => void) & { q?: unknown[]; loaded?: boolean };
  fbq.q = [];
  window.fbq = fbq;
  window.fbq("init", META_PIXEL_ID);
  window.fbq("track", "PageView");
  loadScript("https://connect.facebook.net/en_US/fbevents.js", "hybrid-meta");
}

export function Tracking() {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, () => null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!consent) return;
    if (consent.analytics) bootGa(pathname);
    if (consent.marketing) bootMeta();
  }, [consent, pathname]);

  return null;
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    fbq: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}
