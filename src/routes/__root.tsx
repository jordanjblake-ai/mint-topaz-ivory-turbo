import { createRootRoute, HeadContent, Link, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Canonical } from "@/components/site/canonical";
import { FONT_STYLESHEET, cdnPreconnectLinks } from "@/lib/cdn";
import { shareCardUrls } from "@/lib/og/share-host";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import appCss from "../styles.css?url";

const APP_NAME = "Hybrid Vacations";

export const Route = createRootRoute({
  head: () => {
    const { ogImage, xBanner } = shareCardUrls();
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: APP_NAME },
        {
          name: "description",
          content:
            "Hybrid Vacations. Sport, travel, and community. Beach Volleyball camps in Lanzarote, Tennis and Padel in Mallorca, UK coaching, and trips built around the sports you love.",
        },
        { name: "theme-color", content: "#0D0E10" },
        { property: "og:site_name", content: APP_NAME },
        ...(ogImage
          ? [
              { property: "og:image", content: ogImage },
              { property: "og:image:width", content: "1200" },
              { property: "og:image:height", content: "630" },
            ]
          : []),
        ...(xBanner ? [{ property: "x:game:image", content: xBanner }] : []),
      ],
      links: [
        ...cdnPreconnectLinks(),
        { rel: "stylesheet", href: FONT_STYLESHEET },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "stylesheet", href: appCss },
        { rel: "manifest", href: "/__grok/manifest.webmanifest" },
        { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
        { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
      ],
    };
  },
  notFoundComponent: NotFound,
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
        <Canonical />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <SiteShell>
            <Outlet />
          </SiteShell>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-4 py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">404</p>
      <h1 className="mt-3 font-display text-6xl text-fg">This page is off court</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        That link does not exist. Head back to camps, coaching, or send us a note.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/">Home</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/vacations">Camps</Link>
        </Button>
      </div>
    </main>
  );
}
