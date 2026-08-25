import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getConsent, resetConsent, setConsent, subscribeConsent } from "@/lib/consent";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(getConsent() == null);
    return subscribeConsent(() => setShow(getConsent() == null));
  }, []);

  if (!show) return null;

  function choose(analytics: boolean, marketing: boolean) {
    setShow(false);
    setConsent({ analytics, marketing });
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-bg/95 p-4 shadow-border backdrop-blur-md sm:p-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Cookies</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Essential cookies run the site. Analytics and marketing cookies only if you say yes. We
            do not treat scrolling as a yes.{" "}
            <Link to="/cookies" className="text-fg hover:text-accent">
              Cookie policy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => choose(false, false)}>
            Essential only
          </Button>
          <Button type="button" onClick={() => choose(true, true)}>
            Accept optional cookies
          </Button>
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
