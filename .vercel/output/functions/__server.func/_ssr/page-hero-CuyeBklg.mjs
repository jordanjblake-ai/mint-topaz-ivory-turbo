import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as cn } from "./router-BlBX1buC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/page-hero-CuyeBklg.js
var import_jsx_runtime = require_jsx_runtime();
function Container({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className),
		children
	});
}
function Section({ className, children, id }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id,
		className: cn("py-16 sm:py-24", className),
		children
	});
}
function Kicker({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs font-semibold uppercase tracking-[0.2em] text-accent",
		children
	});
}
function Display({ as: Tag = "h2", children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		className: cn("font-display tracking-wide text-fg", className),
		children
	});
}
function Photo({ src, alt, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt,
		className: cn("object-cover outline outline-1 -outline-offset-1 outline-fg/10", className)
	});
}
function PageHero({ image, alt, kicker, title, sub, actions, compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("relative isolate overflow-hidden", compact ? "min-h-[52vh]" : "min-h-[88vh]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
				src: image,
				alt,
				className: "absolute inset-0 size-full"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-overlay" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-linear-to-t from-bg via-bg/30 to-bg/20" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				className: cn("relative flex flex-col justify-end pb-12 sm:pb-16", compact ? "min-h-[52vh] pt-28" : "min-h-[88vh] pt-32"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: kicker }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
						as: "h1",
						className: cn("mt-3 max-w-4xl leading-[0.9]", compact ? "text-5xl sm:text-7xl" : "text-6xl sm:text-8xl lg:text-9xl"),
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-xl text-base leading-relaxed text-fg/85 sm:text-lg",
						children: sub
					}),
					actions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: actions
					}) : null
				]
			})
		]
	});
}
//#endregion
export { Photo as a, PageHero as i, Display as n, Section as o, Kicker as r, Container as t };
