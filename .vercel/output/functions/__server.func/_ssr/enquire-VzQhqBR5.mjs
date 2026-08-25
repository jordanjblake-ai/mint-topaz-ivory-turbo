import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Route$5, u as site } from "./router-BlBX1buC.mjs";
import { i as PageHero, n as Display, o as Section, r as Kicker, t as Container } from "./page-hero-CuyeBklg.mjs";
import { t as EnquireForm } from "./enquire-form-DB-DK_qm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/enquire-VzQhqBR5.js
var import_jsx_runtime = require_jsx_runtime();
function EnquirePage() {
	const { interest } = Route$5.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		compact: true,
		image: "/images/sunset.jpg",
		alt: "End of a camp day",
		kicker: "Enquire",
		title: "Tell us what you want from the week",
		sub: "Camps, UK coaching, or a travel quote. We reply from support@hybridvacations.com."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
		className: "grid items-start gap-12 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Contact" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
				className: "mt-2 text-5xl",
				children: "We will come back with a clear next step"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-base leading-relaxed text-muted",
				children: "Lanzarote places are held with a £100 deposit once we confirm your week. Tennis, padel, and golf are pre-register or notify only until those packages are locked. UK coaching is scoped before anything is booked."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: `mailto:${site.email}`,
				className: "mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-accent hover:text-accent-hover",
				children: site.email
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquireForm, { defaultInterest: interest ?? "lanzarote" })]
	}) })] });
}
//#endregion
export { EnquirePage as component };
