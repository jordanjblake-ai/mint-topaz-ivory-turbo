import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as cn, r as Button } from "./router-BlBX1buC.mjs";
import { a as Photo } from "./page-hero-CuyeBklg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/experience-card-fSP3ZWX0.js
var import_jsx_runtime = require_jsx_runtime();
var labels = {
	bookable: "Bookable",
	preregister: "Pre-register",
	coming: "Coming 2028"
};
function StatusBadge({ status, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold uppercase tracking-wider", status === "bookable" && "bg-accent text-accent-fg", status === "preregister" && "border border-fg/40 bg-bg/50 text-fg", status === "coming" && "border border-border bg-surface text-muted", className),
		children: labels[status]
	});
}
function ExperienceCard({ experience }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group flex h-full flex-col overflow-hidden rounded-lg bg-surface shadow-border transition-shadow duration-150 hover:shadow-border-hover",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardLink, {
			experience,
			className: "relative block aspect-4/3 overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
					src: experience.image,
					alt: experience.title,
					className: "size-full transition-transform duration-500 ease-out group-hover:scale-105"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-linear-to-t from-bg/80 via-transparent to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
					status: experience.status,
					className: "absolute top-3 left-3"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-3 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-widest text-accent",
					children: experience.sport
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-2xl leading-none text-fg",
					children: experience.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						experience.destination,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-2 text-border",
							children: "·"
						}),
						experience.dates
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-fg/85",
					children: experience.blurb
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto flex items-center justify-between pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-fg",
						children: experience.priceFrom
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardLink, {
							experience,
							children: experience.cta
						})
					})]
				})
			]
		})]
	});
}
function CardLink({ experience, className, children }) {
	if (experience.href === "/enquire") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/enquire",
		search: { interest: experience.interest ?? experience.slug },
		className,
		children
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: experience.href,
		className,
		children
	});
}
//#endregion
export { ExperienceCard as t };
