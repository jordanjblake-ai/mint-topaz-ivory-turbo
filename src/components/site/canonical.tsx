import { useRouterState } from "@tanstack/react-router";
import { GOOGLE_SITE_VERIFICATION } from "@/lib/consent";
import { canonicalUrl, isIndexable } from "@/data/seo";

export function Canonical() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <>
      {GOOGLE_SITE_VERIFICATION ? (
        <meta name="google-site-verification" content={GOOGLE_SITE_VERIFICATION} />
      ) : null}
      {isIndexable(pathname) ? (
        <>
          <link rel="canonical" href={canonicalUrl(pathname)} />
          <meta property="og:url" content={canonicalUrl(pathname)} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Hybrid Vacations" />
        </>
      ) : (
        <meta name="robots" content="noindex, nofollow" />
      )}
    </>
  );
}
