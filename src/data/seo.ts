import { BOOK_PACKAGES, BOOK_WEEKS } from "./book";
import { communityImages } from "./community";
import { scenes } from "./scenes";
import { coaches, liveClinics, site } from "./site";
import { sportHero } from "./sport-images";

export const SITE_ORIGIN = "https://hybridvacations.com";
export const SITEMAP_LASTMOD = "2026-08-31";
/** Hex key hosted at /{key}.txt for Bing IndexNow. */
export const INDEXNOW_KEY = "8f2c4e91b6a04d7f9c1e5b83a0d2467e";

export const publicPages = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/vacations", changefreq: "weekly", priority: "0.9" },
  { path: "/vacations/lanzarote", changefreq: "weekly", priority: "0.9" },
  { path: "/vacations/tennis", changefreq: "monthly", priority: "0.6" },
  { path: "/vacations/padel", changefreq: "monthly", priority: "0.6" },
  { path: "/vacations/golf", changefreq: "monthly", priority: "0.6" },
  { path: "/coaching", changefreq: "monthly", priority: "0.8" },
  { path: "/coaches", changefreq: "monthly", priority: "0.7" },
  { path: "/travel", changefreq: "monthly", priority: "0.6" },
  { path: "/book", changefreq: "weekly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.5" },
  { path: "/playing-levels", changefreq: "monthly", priority: "0.5" },
  { path: "/kit/sizes", changefreq: "monthly", priority: "0.4" },
  { path: "/story-time", changefreq: "monthly", priority: "0.6" },
  { path: "/community", changefreq: "weekly", priority: "0.7" },
  { path: "/community/club", changefreq: "monthly", priority: "0.7" },
  { path: "/community/club/performance", changefreq: "monthly", priority: "0.7" },
  { path: "/community/club/team", changefreq: "monthly", priority: "0.6" },
  { path: "/community/partners", changefreq: "monthly", priority: "0.5" },
  { path: "/community/coaching", changefreq: "monthly", priority: "0.6" },
  { path: "/community/club/hall-of-fame", changefreq: "monthly", priority: "0.5" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/cookies", changefreq: "yearly", priority: "0.3" },
  { path: "/security", changefreq: "yearly", priority: "0.3" },
  { path: "/privacy/request", changefreq: "yearly", priority: "0.2" },
] as const;

export const PAGE_SEO: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Hybrid Vacations | Beach Volleyball, Tennis, Padel and Golf",
    description:
      "Beach Volleyball camps in Lanzarote, Tennis and Padel in Mallorca, UK coaching, and Golf in 2028. Train, travel, and come back with the people.",
  },
  "/vacations": {
    title: "Camps · Hybrid Vacations",
    description:
      "Lanzarote Beach Volleyball is open for 2027. Tennis and Padel in Mallorca are open to pre-register. Golf lands in 2028.",
  },
  "/vacations/lanzarote": {
    title: "Lanzarote Beach Volleyball 2027 · Hybrid Vacations",
    description:
      "Train on Playa Grande, Puerto del Carmen. Same dedicated coach all week. Three weeks from 30 January to 21 February 2027. From £425.",
  },
  "/vacations/tennis": {
    title: "Mallorca Tennis 2027 · Hybrid Vacations",
    description:
      "Clay in Capdepera, minutes from Font de Sa Cala. A training-focused Tennis week in April 2027. Pre-register and we will send the full week when it is ready.",
  },
  "/vacations/padel": {
    title: "Mallorca Padel 2027 · Hybrid Vacations",
    description:
      "A spring Padel week in Capdepera, Mallorca, 5 to 9 April 2027. Coaching, match play, and the island around it. Pre-register now.",
  },
  "/vacations/golf": {
    title: "Golf 2028 · Hybrid Vacations",
    description:
      "Golf, the Hybrid way. Train, travel, community. Destination follows in 2028. Get notified when the week is ready.",
  },
  "/book": {
    title: "Book Lanzarote 2027 · Hybrid Vacations",
    description:
      "Hold a place on the Lanzarote Beach Volleyball camp. Camp only from £425, or camp plus stay. £100 deposit per person per week.",
  },
  "/coaches": {
    title: "Coaches · Hybrid Vacations",
    description:
      "Mark Garcia-Kidd, Martha Bullen, Issa Batrane, Dave Panah, Marco Bonaria, Katya Kate, Ella Watson, and David Silva. The coaches behind Hybrid camps and UK sessions.",
  },
  "/coaching": {
    title: "Clinics & Mini-Camps · Hybrid Vacations",
    description:
      "Hybrid clinics and mini-camps around the UK. Group sessions and longer blocks, closer to home.",
  },
  "/travel": {
    title: "Travel, flights and stay · Hybrid Vacations",
    description:
      "Help with flights, stay, and extras around a Hybrid week. Tell us the camp and we will come back with a clear next step.",
  },
  "/about": {
    title: "About Hybrid · Hybrid Vacations",
    description:
      "Hybrid is sport and travel. Performance and adventure. Mark Garcia-Kidd started it after years competing for England. Beach Volleyball is home. Tennis, Padel, and Golf follow.",
  },
  "/playing-levels": {
    title: "Playing levels · Hybrid Vacations",
    description:
      "How Hybrid groups Beach Volleyball camps from improver to advanced, and how Tennis, Padel, and Golf levels work.",
  },
  "/kit/sizes": {
    title: "Size guide · Hybrid Vacations",
    description:
      "Hybrid kit sizes in centimetres and inches. Men’s vest and shorts, women’s shorts, and sports bra. XS to XL.",
  },
  "/story-time": {
    title: "Story Time · Hybrid Vacations",
    description: "Sixteen months from a name to a world-tour court. The Hybrid story.",
  },
  "/community": {
    title: "Community · Hybrid Vacations",
    description:
      "The people that make Hybrid. Come for the sport. Stay for the people. Leave with memories.",
  },
  "/community/club": {
    title: "The Club · Hybrid Vacations",
    description:
      "The Club is the doorway to Performance Squad, Team Hybrid, and the Hall of Fame.",
  },
  "/community/club/performance": {
    title: "Performance Squad 2027 · Hybrid Vacations",
    description:
      "Being built for 2027. An 18-week UKBT 4★ Beach Volleyball programme, May to September. Enquire by 25 March.",
  },
  "/community/club/team": {
    title: "Team Hybrid · Hybrid Vacations",
    description:
      "The athletes who compete at the highest level and stand for more than results. Passion, commitment, community, positivity.",
  },
  "/community/partners": {
    title: "Partners · Hybrid Vacations",
    description:
      "Fireball Beach Volleyball, beachvolleycamps.ch, Playa Grande Volley, and La Moraña Apartments. The people we build camps and weeks with.",
  },
  "/community/coaching": {
    title: "Private Coaching · Hybrid Vacations",
    description:
      "Beach Volleyball private coaching with Hybrid. 1-to-1 through to a group of 8. Technical work, match prep, or a reset.",
  },
  "/community/club/hall-of-fame": {
    title: "Hall of Fame · Hybrid Vacations",
    description:
      "The people who showed up first. A growing record of the first Hybrid camps, squads, and weeks.",
  },
  "/contact": {
    title: "Contact us · Hybrid Vacations",
    description:
      "Camps, UK coaching, or a trip around the sport. Send the form and we will come back with a clear next step.",
  },
  "/terms": {
    title: "Terms & Conditions · Hybrid Vacations",
    description: "Booking terms for Hybrid camps, UK coaching, deposits, cancellation, and how a week is run.",
  },
  "/privacy": {
    title: "Privacy Policy · Hybrid Vacations",
    description: "How Hybrid Vacations Ltd handles personal data for this site and for bookings. Written for UK GDPR.",
  },
  "/cookies": {
    title: "Cookie Policy · Hybrid Vacations",
    description: "How Hybrid uses cookies. Essential cookies run the site. Analytics and marketing only if you say yes.",
  },
  "/security": {
    title: "Security and compliance · Hybrid Vacations",
    description:
      "How Hybrid Vacations Ltd maps this website to ISO 27001:2022 Annex A, Zero Trust, UK GDPR, and SOC 2-style controls. Not a HIPAA covered entity.",
  },
  "/privacy/request": {
    title: "Your data rights · Hybrid Vacations",
    description: "Ask Hybrid Vacations Ltd for access, correction, erasure, or a copy of your personal data.",
  },
};

const PRIVATE_PREFIXES = [
  "/ops",
  "/camp",
  "/portal",
  "/coaches-corner",
  "/book/thanks",
  "/health",
  "/healthz",
  "/livez",
  "/readyz",
  "/login",
  "/api",
];

const PAGE_IMAGES: Record<string, readonly string[]> = {
  "/": ["/og.jpg", "/images/hero-home.jpg", "/images/group.jpg"],
  "/vacations": [
    "/images/camp-1.jpg",
    sportHero("Beach Volleyball"),
    sportHero("Tennis"),
    sportHero("Padel"),
    sportHero("Golf"),
  ],
  "/vacations/lanzarote": ["/images/hero-lanzarote.jpg", "/images/group.jpg"],
  "/vacations/tennis": [sportHero("Tennis")],
  "/vacations/padel": [sportHero("Padel")],
  "/vacations/golf": [sportHero("Golf")],
  "/book": ["/images/hero-lanzarote.jpg"],
  "/coaches": ["/images/coach-mark.jpg", "/images/coach-martha.jpg"],
  "/coaching": ["/images/coach-mark-action.jpg"],
  "/about": ["/images/coach-mark-hero.jpg"],
  "/playing-levels": ["/images/action-2.jpg"],
  "/kit/sizes": ["/images/action-2.jpg"],
  "/community": communityImages,
  "/community/club": ["/images/group.jpg"],
  "/community/club/team": ["/images/team/door.jpg"],
  "/community/partners": ["/images/partners/fireball.jpg", "/images/partner-1.jpg"],
  "/community/club/performance": ["/images/action-2.jpg"],
  "/community/club/hall-of-fame": ["/images/group.jpg"],
  "/story-time": ["/og-story.jpg", "/art/00-title.jpg"],
};

const PAGE_LABELS: Record<string, string> = {
  "/": "Home",
  "/vacations": "Camps",
  "/vacations/lanzarote": "Lanzarote Beach Volleyball",
  "/vacations/tennis": "Mallorca Tennis",
  "/vacations/padel": "Mallorca Padel",
  "/vacations/golf": "Golf",
  "/book": "Book",
  "/coaches": "Coaches",
  "/coaching": "Clinics & Mini-Camps",
  "/travel": "Travel",
  "/about": "About",
  "/playing-levels": "Playing levels",
  "/kit/sizes": "Size guide",
  "/story-time": "Story Time",
  "/community": "Community",
  "/community/club": "The Club",
  "/community/club/performance": "Performance Squad",
  "/community/club/team": "Team Hybrid",
  "/community/partners": "Partners",
  "/community/coaching": "Private Coaching",
  "/community/club/hall-of-fame": "Hall of Fame",
  "/contact": "Contact",
  "/terms": "Terms",
  "/privacy": "Privacy",
  "/cookies": "Cookies",
  "/security": "Security",
  "/privacy/request": "Your data rights",
};

export function normalizePath(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  const clean = pathname.split("?")[0].split("#")[0];
  return clean.length > 1 ? clean.replace(/\/+$/, "") : "/";
}

export function isIndexable(pathname: string) {
  const path = normalizePath(pathname);
  return !PRIVATE_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export function canonicalUrl(pathname: string) {
  const path = normalizePath(pathname);
  return path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;
}

export function assetUrl(path: string) {
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export function indexNowKeyUrl() {
  return `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`;
}

export function publicPageUrls() {
  return publicPages.map((page) => canonicalUrl(page.path));
}

export function pageImage(pathname: string) {
  const images = PAGE_IMAGES[normalizePath(pathname)];
  return images?.[0] ? assetUrl(images[0]) : assetUrl("/og.jpg");
}

export function pageSeo(pathname: string) {
  const path = normalizePath(pathname);
  const seo = PAGE_SEO[path] ?? PAGE_SEO["/"];
  if (path === "/coaching") {
    const next = liveClinics()[0];
    if (next) {
      return {
        ...seo,
        description: `${next.title} at ${next.venue}, ${next.dateLabel}. ${next.level}. ${next.cost}. Book with SideOut. Hybrid clinics and mini-camps around the UK.`,
      };
    }
  }
  return seo;
}

export function headFor(path: string) {
  const seo = pageSeo(path);
  const image = pageImage(path);
  return {
    meta: [
      { title: seo.title },
      { name: "description", content: seo.description },
      { property: "og:title", content: seo.title },
      { property: "og:description", content: seo.description },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: seo.title },
      { name: "twitter:description", content: seo.description },
      { name: "twitter:image", content: image },
    ],
  };
}

function imageTags(path: string) {
  const images = PAGE_IMAGES[path];
  if (!images?.length) return "";
  return images
    .map(
      (src) => `    <image:image>
      <image:loc>${assetUrl(src)}</image:loc>
    </image:image>`,
    )
    .join("\n");
}

export function sitemapXml(lastmod = SITEMAP_LASTMOD) {
  const urls = publicPages
    .map((page) => {
      const images = imageTags(page.path);
      return `  <url>
    <loc>${canonicalUrl(page.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${images ? `\n${images}` : ""}
  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`;
}

export function robotsTxt() {
  return `User-agent: *
Allow: /
Allow: /book
Allow: /vacations
Allow: /community
Allow: /story-time
Allow: /images/
Allow: /art/
Disallow: /ops
Disallow: /camp
Disallow: /portal
Disallow: /coaches-corner
Disallow: /book/thanks
Disallow: /health
Disallow: /healthz
Disallow: /livez
Disallow: /readyz
Disallow: /login
Disallow: /api

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Disallow: /
User-agent: ChatGPT-User
Disallow: /
User-agent: Google-Extended
Disallow: /
User-agent: CCBot
Disallow: /
User-agent: anthropic-ai
Disallow: /
User-agent: ClaudeBot
Disallow: /
User-agent: Claude-Web
Disallow: /
User-agent: Bytespider
Disallow: /
User-agent: Amazonbot
Disallow: /
User-agent: Applebot-Extended
Disallow: /
User-agent: cohere-ai
Disallow: /
User-agent: PerplexityBot
Disallow: /
User-agent: AhrefsBot
Disallow: /
User-agent: SemrushBot
Disallow: /
User-agent: DotBot
Disallow: /
User-agent: MJ12bot
Disallow: /
User-agent: PetalBot
Disallow: /
User-agent: FacebookBot
Disallow: /

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;
}

export function jsonLdGraph(pathname = "/") {
  const path = normalizePath(pathname);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "SportsActivityLocation",
      "@id": `${SITE_ORIGIN}/#org`,
      name: site.name,
      url: `${SITE_ORIGIN}/`,
      email: site.email,
      logo: assetUrl("/images/logo.png"),
      sameAs: [site.instagram, site.facebook],
      sport: ["Beach Volleyball", "Tennis", "Padel", "Golf"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_ORIGIN}/#site`,
      name: site.name,
      url: `${SITE_ORIGIN}/`,
      publisher: { "@id": `${SITE_ORIGIN}/#org` },
      inLanguage: "en-GB",
    },
  ];

  const crumbs = breadcrumbs(path);
  if (crumbs.length > 1) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.item,
      })),
    });
  }

  if (path === "/vacations/lanzarote" || path === "/book") {
    graph.push(
      ...BOOK_WEEKS.map((week, index) => ({
        "@type": "SportsEvent",
        name: `Hybrid Lanzarote Beach Volleyball Camp ${week.label} 2027`,
        description:
          "Beach Volleyball camp on Playa Grande, Puerto del Carmen. Same dedicated coach all week.",
        startDate: ["2027-01-30", "2027-02-06", "2027-02-13"][index],
        endDate: ["2027-02-07", "2027-02-14", "2027-02-21"][index],
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        image: assetUrl("/images/hero-lanzarote.jpg"),
        location: {
          "@type": "Place",
          name: "Playa Grande, Puerto del Carmen, Lanzarote",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Puerto del Carmen",
            addressRegion: "Lanzarote",
            addressCountry: "ES",
          },
        },
        organizer: { "@id": `${SITE_ORIGIN}/#org` },
        offers: {
          "@type": "Offer",
          url: canonicalUrl("/book"),
          price: "425.00",
          priceCurrency: "GBP",
          availability: "https://schema.org/InStock",
        },
      })),
    );
  }

  if (path === "/book") {
    graph.push({
      "@type": "ItemList",
      name: "Lanzarote camp packages",
      itemListElement: BOOK_PACKAGES.map((pack, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Offer",
          name: pack.name,
          description: pack.note,
          price: (pack.priceEach / 100).toFixed(2),
          priceCurrency: "GBP",
          url: canonicalUrl("/book"),
        },
      })),
    });
  }

  if (path === "/coaches") {
    graph.push({
      "@type": "ItemList",
      name: "Hybrid coaches",
      itemListElement: coaches.map((coach, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Person",
          name: coach.name,
          jobTitle: coach.role,
          ...(coach.image ? { image: assetUrl(coach.image) } : {}),
          ...(coach.url ? { url: coach.url } : {}),
          worksFor: { "@id": `${SITE_ORIGIN}/#org` },
        },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

function breadcrumbs(path: string) {
  const crumbs = [{ name: "Home", item: canonicalUrl("/") }];
  if (path === "/") return crumbs;
  const parts = path.split("/").filter(Boolean);
  let acc = "";
  for (const part of parts) {
    acc += `/${part}`;
    crumbs.push({
      name: PAGE_LABELS[acc] ?? part.replace(/-/g, " "),
      item: canonicalUrl(acc),
    });
  }
  return crumbs;
}
