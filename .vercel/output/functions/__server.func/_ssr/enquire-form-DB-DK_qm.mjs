import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as cn, r as Button, s as enquireInterests, u as site } from "./router-BlBX1buC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/enquire-form-DB-DK_qm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg placeholder:text-muted outline-none focus-visible:ring-2 focus-visible:ring-accent", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-32 w-full rounded-sm border border-border bg-surface px-3 py-3 text-sm text-fg placeholder:text-muted outline-none focus-visible:ring-2 focus-visible:ring-accent", className),
		...props
	});
}
var weeks = [
	{
		value: "",
		label: "Not sure yet"
	},
	{
		value: "week-1",
		label: "Week 1 · 30/31 Jan to 6/7 Feb"
	},
	{
		value: "week-2",
		label: "Week 2 · 6/7 Feb to 13/14 Feb"
	},
	{
		value: "week-3",
		label: "Week 3 · 13/14 Feb to 20/21 Feb"
	}
];
function EnquireForm({ defaultInterest = "lanzarote", compact = false }) {
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [interest, setInterest] = (0, import_react.useState)(defaultInterest);
	const [week, setWeek] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [sent, setSent] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setInterest(defaultInterest);
	}, [defaultInterest]);
	function onSubmit(event) {
		event.preventDefault();
		setError("");
		if (!name.trim() || !email.trim()) {
			setError("Name and email are required.");
			return;
		}
		const interestLabel = enquireInterests.find((item) => item.value === interest)?.label ?? interest;
		const weekLabel = weeks.find((item) => item.value === week)?.label ?? "";
		const subject = encodeURIComponent(`Hybrid enquiry: ${interestLabel}`);
		const body = encodeURIComponent([
			`Name: ${name}`,
			`Email: ${email}`,
			`Interest: ${interestLabel}`,
			weekLabel ? `Week: ${weekLabel}` : "",
			"",
			message || "(no extra message)"
		].filter((line) => line !== "").join("\n"));
		window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
		setSent(true);
	}
	if (sent) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-surface p-6 shadow-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-3xl text-fg",
			children: "We have the details"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 text-sm leading-relaxed text-muted",
			children: [
				"Your email app should open a message to ",
				site.email,
				". If it does not, write to us directly and we will come back with dates, availability, and next steps."
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "name",
					children: "Name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "name",
					value: name,
					onChange: (e) => setName(e.target.value),
					autoComplete: "name",
					required: true
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "email",
					children: "Email"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "email",
					type: "email",
					value: email,
					onChange: (e) => setEmail(e.target.value),
					autoComplete: "email",
					required: true
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "interest",
				children: "I am interested in"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				id: "interest",
				value: interest,
				onChange: (e) => setInterest(e.target.value),
				className: "h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent",
				children: enquireInterests.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: item.value,
					children: item.label
				}, item.value))
			})] }),
			interest === "lanzarote" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "week",
				children: "Preferred week"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				id: "week",
				value: week,
				onChange: (e) => setWeek(e.target.value),
				className: "h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent",
				children: weeks.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: item.value,
					children: item.label
				}, item.value))
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "message",
				children: "Anything we should know"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				id: "message",
				value: message,
				onChange: (e) => setMessage(e.target.value),
				placeholder: "Level, dates, travelling solo, club group..."
			})] }),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-accent",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				size: "lg",
				className: "w-full sm:w-auto",
				children: "Send enquiry"
			})
		]
	});
}
//#endregion
export { EnquireForm as t };
