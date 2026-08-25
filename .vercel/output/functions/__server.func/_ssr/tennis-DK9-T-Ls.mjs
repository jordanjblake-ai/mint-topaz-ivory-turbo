import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Photo, i as PageHero, n as Display, o as Section, r as Kicker, t as Container } from "./page-hero-CuyeBklg.mjs";
import { t as EnquireForm } from "./enquire-form-DB-DK_qm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tennis-DK9-T-Ls.js
var import_jsx_runtime = require_jsx_runtime();
function TennisPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			compact: true,
			image: "/images/tennis-court.jpg",
			alt: "Clay tennis courts near the Mallorca coast",
			kicker: "Tennis · Mallorca 2027",
			title: "Coastlines and courtlines",
			sub: "Clay in Capdepera, minutes from Font de Sa Cala. A training-focused week with island living around it. Pre-register while we lock the full package."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
			className: "grid items-start gap-12 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "April 2027" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
					className: "mt-2 text-5xl",
					children: "Serious sessions. Mediterranean week."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-base leading-relaxed text-muted",
					children: "Clay courts a short walk from the coast. Hotel Na Taconera sits next to the club, so the day is train, recover, swim, eat. This is not a sightseeing tour with a racket on the side."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-8 space-y-4 text-sm text-fg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "border-t border-border pt-4",
							children: "Location: Font de Sa Cala, Capdepera"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "border-t border-border pt-4",
							children: "Surface: clay"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "border-t border-border pt-4",
							children: "Stay: Hotel Na Taconera, a few minutes from the courts"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "border-t border-border pt-4",
							children: "Status: pre-register. Pricing publishes when the package is locked."
						})
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
				src: "/images/tennis.png",
				alt: "Tennis training week in Mallorca",
				className: "aspect-4/5 w-full rounded-lg"
			})]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			className: "bg-surface",
			id: "register",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				className: "grid items-start gap-12 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Pre-register" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
						className: "mt-2 text-5xl",
						children: "Get on the list"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-muted",
						children: "We will contact you when dates, training options, and stay details are confirmed. No deposit asked at this stage."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquireForm, { defaultInterest: "tennis" })]
			})
		})
	] });
}
//#endregion
export { TennisPage as component };
