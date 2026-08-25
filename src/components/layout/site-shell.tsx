import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CookieBanner } from "@/components/site/cookie-banner";
import { Tracking } from "@/components/site/tracking";
import { useOps } from "@/lib/ops-store";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const trackView = useOps((s) => s.trackView);
  const hydrate = useOps((s) => s.hydrate);
  const ready = useOps((s) => s.ready);
  const isPrivate =
    pathname.startsWith("/ops") ||
    pathname.startsWith("/camp") ||
    pathname.startsWith("/coaches-corner");

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (ready && !isPrivate) trackView(pathname);
  }, [pathname, isPrivate, trackView, ready]);

  if (isPrivate) {
    return <div className="min-h-dvh bg-bg text-fg">{children}</div>;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <CookieBanner />
      <Tracking />
    </div>
  );
}
