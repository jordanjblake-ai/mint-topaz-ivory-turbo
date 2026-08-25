import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as coachingOffers, r as Button } from "./router-BlBX1buC.mjs";
import { a as Photo, i as PageHero, n as Display, o as Section, r as Kicker, t as Container } from "./page-hero-CuyeBklg.mjs";
import { t as EnquireForm } from "./enquire-form-DB-DK_qm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/coaching-FQYgXCw1.js
var import_jsx_runtime = require_jsx_runtime();
function CoachingPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			compact: true,
			image: "/images/portrait-1.png",
			alt: "Mark Garcia-Kidd coaching",
			kicker: "UK coaching",
			title: "Train here. Travel later.",
			sub: "Private sessions, clinics, and mini-camps around London and the South East. Enquire and we will set the session around you.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				size: "lg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "#enquire",
					children: "Enquire"
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
			className: "grid items-center gap-12 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Mark Garcia-Kidd" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
					className: "mt-2 text-5xl",
					children: "Former England international. Hybrid founder."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-base leading-relaxed text-muted",
					children: "Mark built Hybrid from the same place the coaching comes from: high-level beach volleyball, and a belief that people improve faster in a real group than on their own. UK sessions are the local side of that. Camps are the travel side."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "secondary",
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/coaches",
						children: "Meet the coaches"
					})
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
				src: "/images/coach-1.jpg",
				alt: "Hybrid coaching session",
				className: "aspect-4/5 w-full rounded-lg"
			})]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			className: "bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "What we run" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
					className: "mt-2 text-5xl",
					children: "Private. Clinic. Mini-camp."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-6 md:grid-cols-3",
					children: coachingOffers.map((offer) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md bg-bg p-6 shadow-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-3xl text-fg",
							children: offer.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted",
							children: offer.body
						})]
					}, offer.title))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 max-w-2xl text-sm leading-relaxed text-muted",
					children: "Primarily London and the South East, with sessions elsewhere in the UK by arrangement. Court hire is organised around the booking. Tell us the format you want."
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			id: "enquire",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				className: "grid items-start gap-12 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Enquire" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
						className: "mt-2 text-5xl",
						children: "Tell us what you need"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-muted",
						children: "We will come back with availability and a clear next step. No public price list. Every session is scoped before we confirm."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquireForm, { defaultInterest: "coaching" })]
			})
		})
	] });
}
//#endregion
export { CoachingPage as component };
