import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Photo, i as PageHero, n as Display, o as Section, r as Kicker, t as Container } from "./page-hero-CuyeBklg.mjs";
import { t as EnquireForm } from "./enquire-form-DB-DK_qm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/padel-Y_wD4jXX.js
var import_jsx_runtime = require_jsx_runtime();
function PadelPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			compact: true,
			image: "/images/padel.jpg",
			alt: "Padel courts",
			kicker: "Padel · Mallorca 2027",
			title: "Mallorca. 5 to 9 April.",
			sub: "A spring padel week in Capdepera. Coaching, match play, and the island around it. Pre-register while the full package is being locked."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
			className: "grid items-start gap-12 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Coming into view" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
					className: "mt-2 text-5xl",
					children: "Same Hybrid idea. Different racket."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-base leading-relaxed text-muted",
					children: "Four days on Mallorca built around padel. Coaching and match play sit at the centre. Stay, extras, and final pricing will be published once they are confirmed. We will not guess them here."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-8 space-y-4 text-sm text-fg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "border-t border-border pt-4",
							children: "Dates: 5 to 9 April 2027"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "border-t border-border pt-4",
							children: "Location: Capdepera, Mallorca"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "border-t border-border pt-4",
							children: "Status: pre-register only"
						})
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
				src: "/images/ocean.jpg",
				alt: "Mallorca coastline",
				className: "aspect-4/5 w-full rounded-lg"
			})]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			className: "bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				className: "grid items-start gap-12 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Pre-register" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
						className: "mt-2 text-5xl",
						children: "Tell us you want in"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-muted",
						children: "Drop your name and we will follow up when the package is ready. No payment now."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquireForm, { defaultInterest: "padel" })]
			})
		})
	] });
}
//#endregion
export { PadelPage as component };
