import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as experiences } from "./router-BlBX1buC.mjs";
import { i as PageHero, n as Display, o as Section, r as Kicker, t as Container } from "./page-hero-CuyeBklg.mjs";
import { t as CtaBand } from "./cta-band-CeylbeQL.mjs";
import { t as ExperienceCard } from "./experience-card-fSP3ZWX0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vacations-rkz20vuN.js
var import_jsx_runtime = require_jsx_runtime();
function VacationsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			compact: true,
			image: "/images/camp-1.jpg",
			alt: "Hybrid camp on the sand",
			kicker: "Camps",
			title: "Sport. Travel. Community.",
			sub: "Lanzarote is bookable now. Tennis and padel in Mallorca are open for pre-register. Golf lands in 2028."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "2027 – 2028" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
				className: "mt-2 text-5xl",
				children: "Upcoming experiences"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-6 md:grid-cols-2",
				children: experiences.map((experience) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExperienceCard, { experience }, experience.slug))
			})
		] }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtaBand, {
			title: "Not sure which week?",
			body: "Tell us your sport, level, and dates. We will point you at the right camp, or the UK coaching path.",
			to: "/enquire",
			label: "Enquire",
			search: { interest: "other" }
		})
	] });
}
//#endregion
export { VacationsPage as component };
