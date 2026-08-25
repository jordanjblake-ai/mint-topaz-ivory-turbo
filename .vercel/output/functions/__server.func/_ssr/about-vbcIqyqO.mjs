import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as coaches, d as testimonials, r as Button, u as site } from "./router-BlBX1buC.mjs";
import { a as Photo, i as PageHero, n as Display, o as Section, r as Kicker, t as Container } from "./page-hero-CuyeBklg.mjs";
import { t as CtaBand } from "./cta-band-CeylbeQL.mjs";
import { t as TestimonialCard } from "./testimonial-card-eaxP7NkT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-vbcIqyqO.js
var import_jsx_runtime = require_jsx_runtime();
var ideas = [
	{
		title: "Sport + Travel",
		body: "You go because of the game. The place is the other half of the week, not a backdrop."
	},
	{
		title: "Training + Holiday",
		body: "Improve without treating the trip like a monastery. Sessions in the morning. Island in the afternoon."
	},
	{
		title: "Individual + Community",
		body: "Arrive on your own. Train in a group. Leave with people you will see at the next event."
	}
];
function AboutPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			compact: true,
			image: "/images/group.jpg",
			alt: "Hybrid camp community",
			kicker: "About Hybrid",
			title: site.tagline,
			sub: "A sports and travel company built around coaching, destinations, and a group you actually want to spend a week with."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
			className: "grid items-center gap-12 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
				src: "/images/portrait-2.png",
				alt: "Hybrid founder and coaches",
				className: "aspect-4/5 w-full rounded-lg"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "The name" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
					className: "mt-2 text-5xl",
					children: "Hybrid is the combination"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-base leading-relaxed text-muted",
					children: "Sport and travel. Performance and adventure. Local coaching and international camps. Mark Garcia-Kidd started Hybrid after years competing for England and organising the kind of trips he wanted to take himself: serious training, in a place worth flying to, with people who care about the game."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-base leading-relaxed text-muted",
					children: "Beach volleyball is the home sport. Tennis and padel are next. Golf is on the 2028 horizon. UK coaching sits underneath all of it, so the community does not only exist one week a year."
				})
			] })]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			className: "bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "What we mean" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
					className: "mt-2 text-5xl",
					children: "The Hybrid idea"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-8 md:grid-cols-3",
					children: ideas.map((idea) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-accent/60 pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-3xl text-fg",
							children: idea.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted",
							children: idea.body
						})]
					}, idea.title))
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col justify-between gap-6 sm:flex-row sm:items-end",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "People" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
				className: "mt-2 text-5xl",
				children: "The coaching group"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/coaches",
					children: "Full roster"
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-10 grid grid-cols-2 gap-4 md:grid-cols-4",
			children: coaches.slice(0, 4).map((coach) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
					src: coach.image,
					alt: coach.name,
					className: "aspect-3/4 w-full rounded-md"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 font-display text-2xl text-fg",
					children: coach.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-wider text-muted",
					children: coach.role
				})
			] }, coach.slug))
		})] }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			className: "bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "From the group" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
					className: "mt-2 text-5xl",
					children: "What players say"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3",
					children: testimonials.slice(0, 3).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestimonialCard, { ...item }, item.name))
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtaBand, {
			title: "Come for a week",
			body: "Lanzarote 2027 is open. Or enquire for UK coaching if you want to start closer to home.",
			to: "/vacations",
			label: "See camps"
		})
	] });
}
//#endregion
export { AboutPage as component };
