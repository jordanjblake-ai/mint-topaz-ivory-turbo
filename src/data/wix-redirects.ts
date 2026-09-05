/**
 * 301 map from the live Wix site (hybridvacations.com pages + store + services
 * sitemaps, Aug 2026) onto this site. Unknown /post/, /product-page/,
 * /category/, and /service-page/ URLs still land somewhere public so Google
 * and old links do not 404.
 */
export const WIX_REDIRECTS: Record<string, string> = {
  "/our-vacations": "/vacations",
  "/copy-of-our-vacations": "/vacations",
  "/copy-of-our-vacations-1": "/vacations",
  "/copy-of-our-beach-volleyball-vacation": "/vacations/lanzarote",

  "/lanzarote": "/vacations/lanzarote",
  "/lanzarote-camp": "/vacations/lanzarote",
  "/half-term-beach-volleyball-lanzarote": "/vacations/lanzarote",
  "/beach-volleyball-lanzarote-performance-camp": "/vacations/lanzarote",
  "/hybrid-beach-performance": "/vacations/lanzarote",
  "/bv-playinglevels": "/playing-levels",
  "/lanzarote-booking-page": "/book",
  "/hybrid-beach-registration": "/book",
  "/lanzarote-booking-confirmation": "/book/thanks",
  "/lanzarote-performance-booking-confirmation": "/book/thanks",

  "/tennis-mallorca": "/vacations/tennis",
  "/mallorca-booking-page": "/vacations/tennis",
  "/mallorca-booking-confirmation": "/contact?interest=tennis",
  "/pre-registration": "/vacations/tennis",

  "/gstaad-camp": "/vacations",
  "/gstaad-booking-confirmation": "/contact",

  "/travel-agency": "/travel",
  "/copy-of-travel-agency": "/travel",
  "/request-a-quote": "/travel",
  "/bvc-travelquote": "/travel",
  "/inquiry-services-page": "/contact",

  "/about": "/about",
  "/history": "/story-time",
  "/community/history": "/story-time",
  "/community/performance": "/community/club/performance",
  "/community/team": "/community/club/team",
  "/community/hall-of-fame": "/community/club/hall-of-fame",
  "/team-4": "/coaches",

  "/termsandconditions": "/terms",
  "/privacy-policy": "/privacy",
  "/legal": "/terms",

  "/book-online": "/book",

  "/product-page/men-s-hybrid-t-shirt": "/",
  "/product-page/men-s-hybrid-t-shirt-topaz": "/",
  "/category/mens-t-shirts": "/",

  "/service-page/group-sports-trip": "/travel",
  "/service-page/group-travel-consultation": "/travel",
  "/service-page/package-holiday-design": "/travel",
  "/service-page/sports-vacation-planning": "/travel",

  "/pricing-plans/list": "/book",
};

const PREFIXES: [string, string][] = [
  ["/post/", "/"],
  ["/blog/", "/"],
  ["/product-page/", "/"],
  ["/category/", "/"],
  ["/service-page/", "/travel"],
  ["/event/", "/vacations"],
  ["/event-details/", "/vacations"],
  ["/booking-calendar/", "/book"],
  ["/bookings/", "/book"],
  ["/plans-pricing", "/book"],
  ["/pricing-plans/", "/book"],
];

export function wixTarget(pathname: string) {
  const path = (pathname.split("?")[0].split("#")[0] || "/").replace(/\/+$/, "") || "/";
  if (WIX_REDIRECTS[path]) return WIX_REDIRECTS[path];
  const prefix = PREFIXES.find(([from]) => path === from.replace(/\/+$/, "") || path.startsWith(from));
  return prefix ? prefix[1] : null;
}
