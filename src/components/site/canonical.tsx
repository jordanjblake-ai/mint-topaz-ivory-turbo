import { useRouterState } from "@tanstack/react-router";
import { BING_SITE_VERIFICATION, GOOGLE_SITE_VERIFICATION } from "@/lib/consent";
import { canonicalUrl, isIndexable, jsonLdGraph, pageImage, pageSeo } from "@/data/seo";

export function Canonical() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const indexable = isIndexable(pathname);
  const seo = pageSeo(pathname);
  const image = pageImage(pathname);
  return (
    <>
      {GOOGLE_SITE_VERIFICATION ? (
        <meta name="google-site-verification" content={GOOGLE_SITE_VERIFICATION} />
      ) : null}
      {BING_SITE_VERIFICATION ? (
        <meta name="msvalidate.01" content={BING_SITE_VERIFICATION} />
      ) : null}
      {indexable ? (
        <>
          <link rel="canonical" href={canonicalUrl(pathname)} />
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          <meta property="og:url" content={canonicalUrl(pathname)} />
          <meta property="og:type" content="website" />
          <meta property="og:locale" content="en_GB" />
          <meta property="og:site_name" content="Hybrid Vacations" />
          <meta property="og:title" content={seo.title} />
          <meta property="og:description" content={seo.description} />
          <meta property="og:image" content={image} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seo.title} />
          <meta name="twitter:description" content={seo.description} />
          <meta name="twitter:image" content={image} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph(pathname)) }} />
        </>
      ) : (
        <meta name="robots" content="noindex, nofollow" />
      )}
    </>
  );
}
