import { Link, useRouterState } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { getConsent, resetConsent, setConsent, subscribeConsent } from "@/lib/consent";

const COOKIE_VAR = "--cookie-banner";

export function CookieBanner() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const story = pathname.startsWith("/story-time") || pathname === "/history";
  const [show, setShow] = useState(false);
  const [scrolled, setScrolled] = useState(!story);
  const [customise, setCustomise] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShow(getConsent() == null);
    return subscribeConsent(() => setShow(getConsent() == null));
  }, []);

  useEffect(() => {
    if (!story) {
      setScrolled(true);
      return;
    }
    setScrolled(window.scrollY > 24);
    const onScroll = () => {
      if (window.scrollY > 24) setScrolled(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [story]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!show || story) {
      if (story) root.style.removeProperty(COOKIE_VAR);
      if (!show) root.style.removeProperty(COOKIE_VAR);
      return;
    }
    const el = rootRef.current;
    if (!el) return;
    const apply = () => root.style.setProperty(COOKIE_VAR, `${el.offsetHeight}px`);
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty(COOKIE_VAR);
    };
  }, [show, customise, story]);

  if (!show || (story && !scrolled)) return null;

  function choose(nextAnalytics: boolean, nextMarketing: boolean) {
    setShow(false);
    setCustomise(false);
    setConsent({ analytics: nextAnalytics, marketing: nextMarketing });
  }

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label="Cookie choices"
      className={
        story
          ? "fixed inset-x-0 top-0 z-50 border-b border-border bg-bg/95 px-3 py-2 backdrop-blur-sm"
          : "fixed inset-x-0 bottom-0 z-50 border-t border-border bg-bg p-3 sm:p-4"
      }
    >
      <div className="mx-auto flex max-w-6xl items-start gap-3 sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-snug text-muted">
            Essential cookies run the site. Optional analytics and marketing only if you say yes.{" "}
            <Link to="/cookies" className="text-fg hover:text-accent">
              Cookie policy
            </Link>
          </p>
          {customise ? (
            <div className="mt-3 grid gap-2 text-sm text-fg sm:grid-cols-2">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 size-4 accent-accent"
                />
                <span>Analytics</span>
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="mt-1 size-4 accent-accent"
                />
                <span>Marketing</span>
              </label>
            </div>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <Button type="button" size="sm" variant="secondary" onClick={() => choose(false, false)}>
            Essential only
          </Button>
          {customise ? (
            <Button type="button" size="sm" onClick={() => choose(analytics, marketing)}>
              Save
            </Button>
          ) : (
            <>
              <Button type="button" size="sm" variant="ghost" onClick={() => setCustomise(true)}>
                Customise
              </Button>
              <Button type="button" size="sm" onClick={() => choose(true, true)}>
                Accept
              </Button>
            </>
          )}
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center text-muted hover:text-fg"
            aria-label="Dismiss, essential cookies only"
            onClick={() => choose(false, false)}
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        resetConsent();
        window.location.reload();
      }}
    >
      Cookie settings
    </button>
  );
}
