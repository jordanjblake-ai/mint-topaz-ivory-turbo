import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Button } from "./router-BlBX1buC.mjs";
import { a as Photo, i as PageHero, n as Display, o as Section, r as Kicker, t as Container } from "./page-hero-CuyeBklg.mjs";
import { t as EnquireForm } from "./enquire-form-DB-DK_qm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/travel-BNTWPs3g.js
var import_jsx_runtime = require_jsx_runtime();
var pieces = [
	{
		title: "Sports experience",
		body: "The camp, the coaching, the group. This is what Hybrid builds and runs."
	},
	{
		title: "Stay",
		body: "Camp-plus-accommodation on Lanzarote, or we help you extend nights around the week."
	},
	{
		title: "Flights and transfers",
		body: "Not bundled by default. Ask the travel desk if you want them arranged with the trip."
	},
	{
		title: "Everything else",
		body: "Extra destinations, club groups, or a holiday that is not a Hybrid camp. Request a quote."
	}
];
function TravelPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			compact: true,
			image: "/images/aerial.jpg",
			alt: "Aerial view of a coastal destination",
			kicker: "Travel agency",
			title: "Build your Hybrid",
			sub: "Camps are the sport. The travel desk sits next to that: flights, stays, transfers, and trips that are not a camp week. Clear split. No surprises on what is included."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "How it works" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
				className: "mt-2 max-w-3xl text-5xl",
				children: "The camp is not a flight-inclusive package"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 max-w-2xl text-base leading-relaxed text-muted",
				children: "Lanzarote camp pricing is training, community, and optional accommodation. Flights stay with you unless you ask us to handle them. That keeps the sports week honest, and the travel side flexible."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-6 md:grid-cols-2",
				children: pieces.map((piece) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md bg-surface p-6 shadow-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-3xl text-fg",
						children: piece.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: piece.body
					})]
				}, piece.title))
			})
		] }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			className: "bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				className: "grid items-center gap-10 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
					src: "/images/ocean.jpg",
					alt: "Atlantic coastline",
					className: "aspect-4/5 w-full rounded-lg"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Two paths" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
						className: "mt-2 text-5xl",
						children: "Search, or send a brief"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-base leading-relaxed text-muted",
						children: "If you already know the camp week, start there. If you want flights, a longer stay, a club trip, or something that is not on the camps list, send a quote request and we will come back with options."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/vacations",
								children: "See camps"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#quote",
								children: "Request a quote"
							})
						})]
					})
				] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			id: "quote",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				className: "grid items-start gap-12 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Request a quote" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
						className: "mt-2 text-5xl",
						children: "Tell us the trip"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-muted",
						children: "Dates, who is travelling, sport or not, and anything already booked. We will reply from support@hybridvacations.com."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquireForm, { defaultInterest: "travel" })]
			})
		})
	] });
}
//#endregion
export { TravelPage as component };
