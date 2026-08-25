import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Button } from "./router-BlBX1buC.mjs";
import { t as Container } from "./page-hero-CuyeBklg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cta-band-CeylbeQL.js
var import_jsx_runtime = require_jsx_runtime();
function CtaBand({ title, body, to, label, search }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-t border-border bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
			className: "flex flex-col items-start justify-between gap-6 py-14 sm:flex-row sm:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-4xl text-fg sm:text-5xl",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted",
					children: body
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				size: "lg",
				children: to === "/enquire" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/enquire",
					search,
					children: label
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to,
					children: label
				})
			})]
		})
	});
}
//#endregion
export { CtaBand as t };
