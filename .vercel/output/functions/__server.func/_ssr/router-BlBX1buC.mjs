import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, f as createRouter, g as createRootRoute, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent, v as useRouter, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Instagram, n as TriangleAlert, r as Menu, t as X } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BlBX1buC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-accent",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl tracking-wide",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var site = {
	name: "Hybrid Vacations",
	tagline: "Travel Through What You Love",
	positioning: "Sport × Travel × Community × Adventure",
	email: "support@hybridvacations.com",
	instagram: "https://www.instagram.com/hybridvacations/",
	instagramHandle: "@hybridvacations"
};
var coaches = [
	{
		slug: "mark",
		name: "Mark Garcia-Kidd",
		handle: "@mgarciakidd",
		url: "https://www.instagram.com/mgarciakidd/",
		role: "Founder and coach",
		bio: "Former England beach volleyball international and founder of Hybrid. Mark has competed for England on the world circuit and is known as one of the UK's strongest setters and coaches. He built Hybrid around quality coaching, real community, and destinations worth travelling for.",
		image: "/images/portrait-1.png"
	},
	{
		slug: "martha",
		name: "Martha Bullen",
		handle: "@_marthab",
		url: "https://www.instagram.com/_marthab/",
		role: "England player and coach",
		bio: "England beach volleyball player and Hybrid coach. Martha competes on the UKBT and Beach Pro Tour, has represented England at senior level, and plays indoor for Richmond. Her coaching is direct, purposeful, and focused on the fundamentals that win points.",
		image: "/images/portrait-2.png"
	},
	{
		slug: "issa",
		name: "Issa Batrane",
		handle: "@issabatrane",
		url: "https://www.instagram.com/issabatrane/",
		role: "England international",
		bio: "England beach volleyball international and Hybrid coach. Issa competes on the Beach Pro Tour with partner Freddie Bialokoz. He brings high-level competitive experience and a clear focus on effort, defence, and player development.",
		image: "/images/coach-1.jpg"
	},
	{
		slug: "dave",
		name: "Dave Panah",
		handle: "@lifeofdavoud",
		url: "https://www.instagram.com/lifeofdavoud/",
		role: "Coach",
		bio: "Coach with more than twenty years in volleyball and international experience representing Wales. Dave has coached indoor and beach from beginners through to national-level athletes. Sessions are energetic and built around confidence and clear progress.",
		image: "/images/coach-2.jpg"
	},
	{
		slug: "marco",
		name: "Marco Bonaria",
		handle: "@beachvolleycamps.ch",
		url: "https://www.instagram.com/beachvolleycamps.ch/",
		role: "Swiss coach and camp organiser",
		bio: "Swiss coach and camp organiser with long experience in the European beach volleyball scene. Marco brings structure and the Swiss coaching network behind Hybrid's collaboration with beachvolleycamps.ch.",
		image: "/images/camp-3.jpg"
	},
	{
		slug: "katya",
		name: "Katya Kate",
		handle: "@katyasteps",
		url: "https://www.instagram.com/katyasteps/",
		role: "Hybrid coach",
		bio: "Part of the Hybrid coaching group. Full public bio to be confirmed with preferred wording.",
		image: "/images/set-1.jpg"
	},
	{
		slug: "david",
		name: "David Silva",
		handle: "@nave_dave_",
		url: "https://www.instagram.com/nave_dave_/",
		role: "Hybrid coach",
		bio: "Hybrid coach on the website roster. Short approved bio to be confirmed with David before a longer profile goes live.",
		image: "/images/set-2.jpg"
	}
];
var testimonials = [
	{
		quote: "Proper training environment. Coaches take you seriously even as a junior. Sessions were hard, specific, and I left with clear things to work on for the next tournament.",
		name: "Lewis Bunton",
		note: "Junior athlete, pro tour"
	},
	{
		quote: "Not a holiday camp. Real volume, real feedback, and people who care about getting better. Exactly the kind of week you need between events.",
		name: "Bailey Harsum",
		note: "Junior athlete, pro tour"
	},
	{
		quote: "Level of coaching was high. Same coach all week meant the progress actually stuck. Sideout and defence work was proper, not generic drills.",
		name: "Jordan Blake",
		note: "High level UK player"
	},
	{
		quote: "Strong group of players and coaches who know the UK and international scene. Training was sharp and the competitive standard pushed me.",
		name: "Gerda Berštautaitė",
		note: "High level UK player"
	},
	{
		quote: "Came for the standard of coaching and stayed for the atmosphere. Hard sessions, good recovery, and a group that wants to compete. Would go again.",
		name: "Ella Watson",
		note: "High level competitor"
	}
];
var experiences = [
	{
		slug: "lanzarote",
		sport: "Beach Volleyball",
		title: "Lanzarote Beach Volleyball Camp",
		destination: "Playa Grande, Puerto del Carmen",
		dates: "Jan – Feb 2027",
		weeks: [
			"Week 1: 30/31 Jan to 6/7 Feb",
			"Week 2: 6/7 Feb to 13/14 Feb",
			"Week 3: 13/14 Feb to 20/21 Feb"
		],
		status: "bookable",
		priceFrom: "From £425",
		image: "/images/card-lanzarote.jpg",
		href: "/vacations/lanzarote",
		cta: "View camp",
		blurb: "Train on golden sand with the same dedicated coach all week. Then recover, explore, and play with a European community."
	},
	{
		slug: "tennis",
		sport: "Tennis",
		title: "Mallorca Tennis Camp",
		destination: "Font de Sa Cala, Capdepera",
		dates: "April 2027",
		weeks: ["April 2027"],
		status: "preregister",
		priceFrom: "Pre-register",
		image: "/images/tennis-court.jpg",
		href: "/vacations/tennis",
		cta: "Pre-register",
		blurb: "Clay courts minutes from the coast. Serious sessions, island living, and a social week around the game."
	},
	{
		slug: "padel",
		sport: "Padel",
		title: "Mallorca Padel Camp",
		destination: "Capdepera, Mallorca",
		dates: "5 – 9 April 2027",
		weeks: ["5 to 9 April 2027"],
		status: "preregister",
		priceFrom: "Pre-register",
		image: "/images/padel.jpg",
		href: "/vacations/padel",
		cta: "Pre-register",
		blurb: "Premium coaching, match play, and a spring week on Mallorca. Full package details coming as we lock pricing."
	},
	{
		slug: "golf",
		sport: "Golf",
		title: "Golf Camp",
		destination: "Location to be confirmed",
		dates: "2028",
		weeks: ["Coming 2028"],
		status: "coming",
		priceFrom: "Coming 2028",
		image: "/images/aerial.jpg",
		href: "/enquire",
		interest: "golf",
		cta: "Get notified",
		blurb: "World-class golf. Incredible destinations. The Hybrid experience on the fairways."
	}
];
var lanzarote = {
	included: [
		"9 structured training sessions (16+ hours) with the same dedicated coach",
		"2 afternoon social tournaments",
		"Welcome pack plus Lanzarote vest top or sports bra",
		"Coach-led sunset stretches",
		"Pro exhibition games",
		"Camp dinner and farewell party",
		"Training balls provided"
	],
	optional: [
		"Weekend tournament with local club partner Playa Grande Volley",
		"Custom playing shorts",
		"Wednesday evening camp excursion",
		"Airport transfers"
	],
	notIncluded: [
		"Flights (arrange your own, or ask the Hybrid travel desk)",
		"Travel insurance",
		"Visas if required",
		"Transport to Lanzarote unless arranged separately"
	],
	packages: [
		{
			name: "Camp only",
			detail: "General sale from £425 per person"
		},
		{
			name: "Camp + accommodation",
			detail: "From £780 per person, shared 2-bed for 4"
		},
		{
			name: "2-bed (3 people)",
			detail: "£850 per person"
		},
		{
			name: "1-bed (2 people)",
			detail: "£870 per person"
		},
		{
			name: "1-bed solo",
			detail: "£1,215 per person"
		}
	],
	payment: [
		"£100 non-refundable deposit to hold your place",
		"Accommodation balance due 1 January 2027",
		"Camp balance due 15 January 2027"
	],
	partners: [
		{
			name: "beachvolleycamps.ch",
			note: "Swiss co-organiser and European coaching network"
		},
		{
			name: "Playa Grande Volley",
			note: "Local club partner for weekend tournament play"
		},
		{
			name: "Moraña Apartments",
			note: "Seafront stay with a heated winter pool"
		}
	],
	faqs: [
		{
			q: "Are flights included?",
			a: "No. Flights are not part of the camp package. Book your own, or ask us to help through the Hybrid travel desk."
		},
		{
			q: "Can I come solo?",
			a: "Yes. Solo players are welcomed and integrated. We match partners in sessions so you are never left looking for a game."
		},
		{
			q: "What level do I need?",
			a: "Improver through to advanced. Groups are organised so you train with people at the right standard, not a mixed free-for-all."
		},
		{
			q: "Is it the same coach all week?",
			a: "Yes. Your group keeps the same dedicated coach across the nine sessions so the work builds, rather than resetting every day."
		},
		{
			q: "Where do we stay?",
			a: "Camp-only is training and community. Camp plus accommodation is at Moraña, seafront in Puerto del Carmen, with a heated winter pool."
		},
		{
			q: "How do I hold a place?",
			a: "A £100 non-refundable deposit holds your week. Accommodation balance is due 1 January 2027. Camp balance is due 15 January 2027."
		}
	]
};
var coachingOffers = [
	{
		title: "Private sessions",
		body: "One-to-one or pairs work around London and the South East. Technical, tactical, or match prep. Tell us what you need."
	},
	{
		title: "Clinics",
		body: "Short, focused group sessions. A lower-commitment way to train with Hybrid coaches and meet the community."
	},
	{
		title: "Mini-camps",
		body: "A condensed camp format in the UK. Volume, feedback, and a group, without booking a flight."
	}
];
var enquireInterests = [
	{
		value: "lanzarote",
		label: "Lanzarote beach volleyball"
	},
	{
		value: "tennis",
		label: "Mallorca tennis"
	},
	{
		value: "padel",
		label: "Mallorca padel"
	},
	{
		value: "golf",
		label: "Golf 2028"
	},
	{
		value: "coaching",
		label: "UK coaching"
	},
	{
		value: "travel",
		label: "Travel desk / quote"
	},
	{
		value: "other",
		label: "Something else"
	}
];
var nav = [
	{
		label: "Camps",
		href: "/vacations"
	},
	{
		label: "UK Coaching",
		href: "/coaching"
	},
	{
		label: "Coaches",
		href: "/coaches"
	},
	{
		label: "Travel Agency",
		href: "/travel"
	},
	{
		label: "About",
		href: "/about"
	}
];
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-border bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl text-fg",
					children: "HYBRID"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 max-w-xs text-sm leading-relaxed text-muted",
					children: [site.tagline, ". Sport, travel, and community in one week."]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-widest text-muted",
					children: "Explore"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-2",
					children: [nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.href,
						className: "inline-flex min-h-11 items-center text-sm text-fg hover:text-accent",
						children: item.label
					}) }, item.href)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/enquire",
						className: "inline-flex min-h-11 items-center text-sm text-fg hover:text-accent",
						children: "Enquire"
					}) })]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-widest text-muted",
						children: "Contact"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: `mailto:${site.email}`,
						className: "mt-4 block text-sm text-fg hover:text-accent",
						children: site.email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: site.instagram,
						target: "_blank",
						rel: "noreferrer",
						className: "mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-fg hover:text-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "size-4" }), site.instagramHandle]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-xs leading-relaxed text-muted",
						children: "Camp deposits are non-refundable. Payment dates sit on each camp page. Flights are not included unless arranged through the travel desk."
					})
				] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border/80 py-4 text-center text-xs text-muted",
			children: site.positioning
		})]
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold tracking-wide uppercase transition-[color,background-color,border-color,transform] duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:bg-accent-hover",
			secondary: "border border-fg/70 bg-transparent text-fg hover:border-accent hover:text-accent",
			ghost: "text-fg hover:text-accent",
			dark: "bg-surface text-fg border border-border hover:border-accent"
		},
		size: {
			default: "h-11 px-5",
			lg: "h-12 px-7 text-base",
			sm: "h-9 px-3 text-xs"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function SiteHeader() {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 border-b border-border/70 bg-bg/90 backdrop-blur-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-3",
					onClick: () => setOpen(false),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/images/logo.png",
						alt: "Hybrid Vacations",
						className: "h-10 w-10 rounded-full"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl tracking-wide text-fg",
						children: "HYBRID"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-7 lg:flex",
					children: nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.href,
						className: "text-sm text-muted transition-colors hover:text-fg",
						children: item.label
					}, item.href))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden lg:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/vacations/lanzarote",
							children: "Book a camp"
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "inline-flex size-11 items-center justify-center rounded-sm text-fg lg:hidden",
					"aria-label": open ? "Close menu" : "Open menu",
					onClick: () => setOpen((v) => !v),
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-6" })
				})
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border bg-bg px-4 py-4 lg:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex flex-col gap-1",
				children: [nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.href,
					className: "rounded-sm px-3 py-3 text-fg hover:bg-surface",
					onClick: () => setOpen(false),
					children: item.label
				}, item.href)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-3 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/vacations/lanzarote",
						onClick: () => setOpen(false),
						children: "Book a camp"
					})
				})]
			})
		}) : null]
	});
}
function SiteShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
var styles_default = "/assets/styles-CotAcUJR.css";
var APP_NAME = "Hybrid Vacations";
var Route$10 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Hybrid Vacations. Sport, travel, and community. Beach volleyball camps in Lanzarote, tennis and padel in Mallorca, UK coaching, and a travel desk built around the sports you love."
			},
			{
				name: "theme-color",
				content: "#0D0E10"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	notFoundComponent: NotFound,
	component: RootDocument
});
function RootDocument() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
function NotFound() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-4 py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold uppercase tracking-[0.2em] text-accent",
				children: "404"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-6xl text-fg",
				children: "This page is off court"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-md text-sm leading-relaxed text-muted",
				children: "That link does not exist. Head back to camps, coaching, or send us a note."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						children: "Home"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/vacations",
						children: "Camps"
					})
				})]
			})
		]
	});
}
var $$splitComponentImporter$9 = () => import("./routes-Dm6YyII4.mjs");
var Route$9 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./about-vbcIqyqO.mjs");
var Route$8 = createFileRoute("/about")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./coaches-jfyliecx.mjs");
var Route$7 = createFileRoute("/coaches")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./coaching-FQYgXCw1.mjs");
var Route$6 = createFileRoute("/coaching")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./enquire-VzQhqBR5.mjs");
var Route$5 = createFileRoute("/enquire")({
	validateSearch: (search) => ({ interest: typeof search.interest === "string" ? search.interest : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./travel-BNTWPs3g.mjs");
var Route$4 = createFileRoute("/travel")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./vacations-rkz20vuN.mjs");
var Route$3 = createFileRoute("/vacations/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./lanzarote-BrMC9BtJ.mjs");
var Route$2 = createFileRoute("/vacations/lanzarote")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./padel-Y_wD4jXX.mjs");
var Route$1 = createFileRoute("/vacations/padel")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./tennis-DK9-T-Ls.mjs");
var Route = createFileRoute("/vacations/tennis")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$9.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$10
});
var AboutRoute = Route$8.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$10
});
var CoachesRoute = Route$7.update({
	id: "/coaches",
	path: "/coaches",
	getParentRoute: () => Route$10
});
var CoachingRoute = Route$6.update({
	id: "/coaching",
	path: "/coaching",
	getParentRoute: () => Route$10
});
var EnquireRoute = Route$5.update({
	id: "/enquire",
	path: "/enquire",
	getParentRoute: () => Route$10
});
var TravelRoute = Route$4.update({
	id: "/travel",
	path: "/travel",
	getParentRoute: () => Route$10
});
var VacationsIndexRoute = Route$3.update({
	id: "/vacations/",
	path: "/vacations/",
	getParentRoute: () => Route$10
});
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	CoachesRoute,
	CoachingRoute,
	EnquireRoute,
	TravelRoute,
	VacationsLanzaroteRoute: Route$2.update({
		id: "/vacations/lanzarote",
		path: "/vacations/lanzarote",
		getParentRoute: () => Route$10
	}),
	VacationsPadelRoute: Route$1.update({
		id: "/vacations/padel",
		path: "/vacations/padel",
		getParentRoute: () => Route$10
	}),
	VacationsTennisRoute: Route.update({
		id: "/vacations/tennis",
		path: "/vacations/tennis",
		getParentRoute: () => Route$10
	}),
	VacationsIndexRoute
};
var routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { coaches as a, experiences as c, testimonials as d, cn as i, lanzarote as l, Route$5 as n, coachingOffers as o, Button as r, enquireInterests as s, router_exports as t, site as u };
