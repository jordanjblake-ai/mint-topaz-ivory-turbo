import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as coaches, d as testimonials, l as lanzarote, r as Button } from "./router-BlBX1buC.mjs";
import { a as Photo, i as PageHero, n as Display, o as Section, r as Kicker, t as Container } from "./page-hero-CuyeBklg.mjs";
import { t as CtaBand } from "./cta-band-CeylbeQL.mjs";
import { t as TestimonialCard } from "./testimonial-card-eaxP7NkT.mjs";
import { t as EnquireForm } from "./enquire-form-DB-DK_qm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lanzarote-BrMC9BtJ.js
var import_jsx_runtime = require_jsx_runtime();
var weeks = [
	{
		label: "Week 1",
		dates: "30/31 Jan to 6/7 Feb"
	},
	{
		label: "Week 2",
		dates: "6/7 Feb to 13/14 Feb"
	},
	{
		label: "Week 3",
		dates: "13/14 Feb to 20/21 Feb"
	}
];
function LanzarotePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			image: "/images/hero-lanzarote.jpg",
			alt: "Playa Grande beach volleyball courts, Lanzarote",
			kicker: "Beach volleyball · Lanzarote 2027",
			title: "Train on Playa Grande",
			sub: "Puerto del Carmen. Golden sand. The same dedicated coach all week. Then the island, the group, and winter sun.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				size: "lg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "#hold",
					children: "Hold a place"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				size: "lg",
				variant: "secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "#packages",
					children: "Packages"
				})
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-3",
			children: weeks.map((week) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md bg-surface p-6 shadow-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-widest text-accent",
					children: week.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-3xl text-fg",
					children: week.dates
				})]
			}, week.label))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-6 max-w-2xl text-sm leading-relaxed text-muted",
			children: "Camp only from £425 per person. Early bird closed 1 August. £100 non-refundable deposit holds your place. Flights are not included."
		})] }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			className: "bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				className: "grid items-center gap-12 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "The model" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
						className: "mt-2 text-5xl sm:text-6xl",
						children: "Same coach. All week."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-base leading-relaxed text-muted",
						children: "Nine sessions, 16+ hours, with one dedicated coach on your group. The work progresses. Sideout, defence, serving, and match play, not a new voice every morning."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-base leading-relaxed text-muted",
						children: "Improver through to advanced. Solo players are matched. Wednesday is a lighter day so you can see the island. Evenings are sunset stretches, a camp dinner, and a farewell that actually feels like one."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
					src: "/images/camp-2.jpg",
					alt: "Coached session on Playa Grande",
					className: "aspect-4/5 w-full rounded-lg"
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			id: "packages",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Packages" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
					className: "mt-2 text-5xl",
					children: "Camp, or camp plus stay"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-4 md:grid-cols-2",
					children: lanzarote.packages.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-4 rounded-md bg-surface p-5 shadow-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-fg",
							children: item.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-right text-sm text-muted",
							children: item.detail
						})]
					}, item.name))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-8 space-y-2 text-sm text-muted",
					children: lanzarote.payment.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line))
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			className: "bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				className: "grid gap-10 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBlock, {
						title: "Included",
						items: lanzarote.included
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBlock, {
						title: "Optional",
						items: lanzarote.optional
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBlock, {
						title: "Not included",
						items: lanzarote.notIncluded
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Partners" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
				className: "mt-2 text-5xl",
				children: "Who we run this with"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-5 md:grid-cols-3",
				children: lanzarote.partners.map((partner) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md bg-surface p-6 shadow-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl text-fg",
						children: partner.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: partner.note
					})]
				}, partner.name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
					src: "/images/partner-1.jpg",
					alt: "Lanzarote camp partner courts",
					className: "aspect-video w-full rounded-md"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
					src: "/images/partner-2.jpg",
					alt: "Seafront accommodation in Puerto del Carmen",
					className: "aspect-video w-full rounded-md"
				})]
			})
		] }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			className: "bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Coaches" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
					className: "mt-2 text-5xl",
					children: "The Hybrid group"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-2xl text-sm leading-relaxed text-muted",
					children: "Hybrid coaches and the beachvolleycamps.ch network. Your group keeps one dedicated coach across the week."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid grid-cols-2 gap-4 md:grid-cols-4",
					children: coaches.slice(0, 4).map((coach) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/coaches",
						className: "group",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
								src: coach.image,
								alt: coach.name,
								className: "aspect-3/4 w-full rounded-md"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-display text-2xl text-fg group-hover:text-accent",
								children: coach.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-wider text-muted",
								children: coach.handle
							})
						]
					}, coach.slug))
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "From camp" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
				className: "mt-2 text-5xl",
				children: "Players, not brochure quotes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-5 md:grid-cols-3",
				children: testimonials.slice(0, 3).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestimonialCard, { ...item }, item.name))
			})
		] }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "grid grid-cols-2 md:grid-cols-4",
			children: [
				"/images/gallery-1.jpg",
				"/images/gallery-2.jpg",
				"/images/action-2.jpg",
				"/images/camp-4.jpg"
			].map((src) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
				src,
				alt: "Lanzarote camp",
				className: "aspect-square size-full"
			}, src))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Questions" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
				className: "mt-2 text-5xl",
				children: "Before you book"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 divide-y divide-border border-y border-border",
				children: lanzarote.faqs.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "group py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
						className: "cursor-pointer list-none font-semibold text-fg [&::-webkit-details-marker]:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center justify-between gap-4",
							children: [item.q, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-accent group-open:rotate-45",
								children: "+"
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted",
						children: item.a
					})]
				}, item.q))
			})
		] }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			id: "hold",
			className: "bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				className: "grid items-start gap-12 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Hold a place" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Display, {
						className: "mt-2 text-5xl",
						children: "£100 deposit. We take it from there."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm leading-relaxed text-muted",
						children: [
							"Send the form and we will come back with availability on your week, accommodation options, and how to pay the deposit. Prefer email?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "text-accent hover:text-accent-hover",
								href: "mailto:support@hybridvacations.com",
								children: "support@hybridvacations.com"
							})
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquireForm, { defaultInterest: "lanzarote" })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtaBand, {
			title: "Need flights or a longer stay?",
			body: "The camp is the sport. The travel desk can help with flights, transfers, and extra nights.",
			to: "/travel",
			label: "Travel desk"
		})
	] });
}
function ListBlock({ title, items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: "font-display text-3xl text-fg",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-5 space-y-3",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
			className: "border-t border-border pt-3 text-sm leading-relaxed text-muted",
			children: item
		}, item))
	})] });
}
//#endregion
export { LanzarotePage as component };
