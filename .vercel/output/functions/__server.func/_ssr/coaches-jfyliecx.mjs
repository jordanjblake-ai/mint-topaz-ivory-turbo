import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Instagram } from "../_libs/lucide-react.mjs";
import { a as coaches } from "./router-BlBX1buC.mjs";
import { a as Photo, i as PageHero, n as Display, o as Section, r as Kicker, t as Container } from "./page-hero-CuyeBklg.mjs";
import { t as CtaBand } from "./cta-band-CeylbeQL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/coaches-jfyliecx.js
var import_jsx_runtime = require_jsx_runtime();
function CoachesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			compact: true,
			image: "/images/set-1.jpg",
			alt: "Hybrid coaches on court",
			kicker: "The roster",
			title: "Coaches who still compete",
			sub: "England internationals, a Swiss camp organiser, and people who spend their weeks on the sand. Short bios. Confirmed handles."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Team" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
				className: "mt-2 text-5xl",
				children: "Who you train with"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 space-y-16",
				children: coaches.map((coach, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					id: coach.slug,
					className: "grid items-center gap-8 border-t border-border pt-10 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
						src: coach.image,
						alt: coach.name,
						className: `aspect-4/5 w-full rounded-lg ${index % 2 === 1 ? "lg:order-2" : ""}`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-widest text-accent",
							children: coach.role
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-5xl text-fg",
							children: coach.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-lg text-base leading-relaxed text-muted",
							children: coach.bio
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: coach.url,
							target: "_blank",
							rel: "noreferrer",
							className: "mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-fg hover:text-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "size-4" }), coach.handle]
						})
					] })]
				}, coach.slug))
			})
		] }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtaBand, {
			title: "Want a session in the UK?",
			body: "Private, clinic, or mini-camp. Enquire and we will shape it.",
			to: "/coaching",
			label: "UK coaching"
		})
	] });
}
//#endregion
export { CoachesPage as component };
