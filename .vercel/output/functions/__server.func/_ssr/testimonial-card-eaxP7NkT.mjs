import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/testimonial-card-eaxP7NkT.js
var import_jsx_runtime = require_jsx_runtime();
function TestimonialCard({ quote, name, note }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: "flex h-full flex-col rounded-md bg-surface p-6 shadow-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
			className: "text-base leading-relaxed text-fg",
			children: [
				"“",
				quote,
				"”"
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-fg",
				children: name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-wider text-muted",
				children: note
			})]
		})]
	});
}
//#endregion
export { TestimonialCard as t };
