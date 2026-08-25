import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ArrowRight } from "../_libs/lucide-react.mjs";
import { a as coaches, c as experiences, d as testimonials, r as Button, u as site } from "./router-BlBX1buC.mjs";
import { a as Photo, i as PageHero, n as Display, o as Section, r as Kicker, t as Container } from "./page-hero-CuyeBklg.mjs";
import { t as CtaBand } from "./cta-band-CeylbeQL.mjs";
import { t as TestimonialCard } from "./testimonial-card-eaxP7NkT.mjs";
import { t as ExperienceCard } from "./experience-card-fSP3ZWX0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dm6YyII4.js
var import_jsx_runtime = require_jsx_runtime();
var pillars = [
	{
		title: "Train",
		body: "Same coach all week. Real sessions, not a holiday drill circuit. Improver through to advanced."
	},
	{
		title: "Explore",
		body: "Winter sun, island coast, and a Wednesday to actually see the place you flew for."
	},
	{
		title: "Connect",
		body: "Come solo. Leave with a group. UK players, European players, one camp."
	}
];
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			image: "/images/hero-home.jpg",
			alt: "Beach volleyball players training at sunset",
			kicker: site.positioning,
			title: "Travel through what you love",
			sub: "Premium sports camps and a community that actually trains. Lanzarote is open for 2027. Tennis and padel follow in Mallorca.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				size: "lg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/vacations/lanzarote",
					children: "Book Lanzarote"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				size: "lg",
				variant: "secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/vacations",
					children: "All camps"
				})
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col justify-between gap-6 sm:flex-row sm:items-end",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Upcoming" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
				className: "mt-2 text-5xl sm:text-6xl",
				children: "Find your next Hybrid"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/vacations",
				className: "inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-accent hover:text-accent-hover",
				children: ["All experiences ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-10 grid gap-6 md:grid-cols-2",
			children: experiences.map((experience) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExperienceCard, { experience }, experience.slug))
		})] }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			className: "bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "The week" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
					className: "mt-2 max-w-3xl text-5xl sm:text-6xl",
					children: "A holiday that trains. A camp that still feels like a trip."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid gap-10 md:grid-cols-3",
					children: pillars.map((pillar) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-accent/60 pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-3xl text-fg",
							children: pillar.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted",
							children: pillar.body
						})]
					}, pillar.title))
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "grid grid-cols-2 md:grid-cols-4",
			children: [
				{
					src: "/images/spike.jpg",
					alt: "Spike at the net"
				},
				{
					src: "/images/group.jpg",
					alt: "Camp group on court"
				},
				{
					src: "/images/sunset.jpg",
					alt: "Sunset after sessions"
				},
				{
					src: "/images/dig.jpg",
					alt: "Defensive dig in the sand"
				}
			].map((shot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
				src: shot.src,
				alt: shot.alt,
				className: "aspect-square size-full"
			}, shot.src))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col justify-between gap-6 sm:flex-row sm:items-end",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Coaches" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
				className: "mt-2 text-5xl sm:text-6xl",
				children: "People who still play the game"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/coaches",
				className: "inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-accent hover:text-accent-hover",
				children: ["Full roster ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4",
			children: coaches.slice(0, 4).map((coach) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/coaches",
				className: "group block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
						src: coach.image,
						alt: coach.name,
						className: "aspect-3/4 w-full rounded-md"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-display text-2xl text-fg group-hover:text-accent",
						children: coach.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wider text-muted",
						children: coach.role
					})
				]
			}, coach.slug))
		})] }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			className: "bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "From the group" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
					className: "mt-2 text-5xl sm:text-6xl",
					children: "What the week actually feels like"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-5 md:grid-cols-3",
					children: testimonials.slice(0, 3).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestimonialCard, { ...item }, item.name))
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
			className: "grid items-center gap-10 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
				src: "/images/portrait-1.png",
				alt: "Mark Garcia-Kidd, Hybrid founder",
				className: "aspect-4/5 w-full rounded-lg"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "UK coaching" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
					className: "mt-2 text-5xl sm:text-6xl",
					children: "Train here. Travel later."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 max-w-md text-base leading-relaxed text-muted",
					children: "Private sessions, clinics, and mini-camps around London and the South East. A way into Hybrid without booking a flight. Enquire and we will shape the session around you."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/coaching",
						children: "UK coaching"
					})
				})
			] })]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtaBand, {
			title: "Ready for Lanzarote?",
			body: "Three weeks in Jan and Feb 2027. Camp from £425. Deposit £100 to hold your place.",
			to: "/vacations/lanzarote",
			label: "View the camp"
		})
	] });
}
//#endregion
export { Home as component };
