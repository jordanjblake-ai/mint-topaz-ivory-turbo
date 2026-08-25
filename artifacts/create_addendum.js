const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
        BorderStyle, WidthType, ShadingType, PageNumber, PageBreak } = require("docx");
const fs = require("fs");

const MINT = "70CFCB";
const BLACK = "12272F";
const LIGHT_MINT = "E8F7F6";
const SOFT_GREY = "F5F7F8";
const MED_GREY = "6B7C85";

const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: MINT };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const mintBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const greyBorder = { style: BorderStyle.SINGLE, size: 4, color: "D0D7DB" };
const greyBorders = { top: greyBorder, bottom: greyBorder, left: greyBorder, right: greyBorder };

function h1(t) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: MINT, space: 8 } },
    children: [new TextRun({ text: t, bold: true, size: 32, font: "Arial", color: BLACK })]
  });
}
function h2(t) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ text: t, bold: true, size: 26, font: "Arial", color: BLACK })]
  });
}
function body(t) {
  return new Paragraph({
    spacing: { after: 120, line: 276 },
    children: [new TextRun({ text: t, size: 20, font: "Arial", color: BLACK })]
  });
}
function bold(t) {
  return new Paragraph({
    spacing: { after: 120, line: 276 },
    children: [new TextRun({ text: t, size: 20, font: "Arial", color: BLACK, bold: true })]
  });
}
function bullet(t) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 50, line: 276 },
    children: [new TextRun({ text: t, size: 20, font: "Arial", color: BLACK })]
  });
}
function spacer(a = 100) {
  return new Paragraph({ spacing: { after: a }, children: [] });
}
function callout(title, lines) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: mintBorders,
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: LIGHT_MINT, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: [
              new Paragraph({
                spacing: { after: 60 },
                children: [new TextRun({ text: title, bold: true, size: 18, font: "Arial", color: BLACK })]
              }),
              ...lines.map(t => new Paragraph({
                spacing: { after: 30 },
                children: [new TextRun({ text: t, size: 17, font: "Arial", color: BLACK })]
              }))
            ]
          })
        ]
      })
    ]
  });
}
function quote(t) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: noBorder, bottom: noBorder,
              left: { style: BorderStyle.SINGLE, size: 24, color: MINT },
              right: noBorder
            },
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: SOFT_GREY, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 180, right: 140 },
            children: [
              new Paragraph({
                children: [new TextRun({ text: t, size: 18, font: "Arial", color: BLACK, italics: true })]
              })
            ]
          })
        ]
      })
    ]
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 20 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: BLACK },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: BLACK },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 } }
    ]
  },
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
    }]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1260, right: 1260, bottom: 1260, left: 1260 }
      }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: MINT, space: 4 } },
            spacing: { after: 80 },
            children: [
              new TextRun({ text: "HYBRID VACATIONS", bold: true, size: 15, font: "Arial", color: BLACK }),
              new TextRun({ text: "  ·  Intelligence Addendum", size: 15, font: "Arial", color: MED_GREY })
            ]
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 6, color: MINT, space: 4 } },
            spacing: { before: 60 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Public research  ·  20 August 2026  ·  Page ", size: 15, font: "Arial", color: MED_GREY }),
              new TextRun({ children: [PageNumber.CURRENT], size: 15, font: "Arial", color: MED_GREY })
            ]
          })
        ]
      })
    },
    children: [
      spacer(500),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: "HYBRID VACATIONS", bold: true, size: 40, font: "Arial", color: BLACK })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 140 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 16, color: MINT, space: 1 } },
        children: [new TextRun({ text: " ", size: 6 })]
      }),
      spacer(80),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: "Intelligence Addendum", size: 28, font: "Arial", color: BLACK })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: "Public Research Fill for Identified Gaps", size: 18, font: "Arial", color: MED_GREY })]
      }),
      callout("Scope & Confidence", [
        "This addendum fills publicly researchable gaps identified after reviewing the Master Profile and Instagram Scrape.",
        "Sources: hybridvacations.com (Lanzarote & Mallorca pages), beachvolleycamps.ch, FIVB/bvbinfo player records, competitor sites, public social references.",
        "Internal-only items (volumes, CRM, paid media, full legal/ops) remain marked as such."
      ]),
      spacer(200),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "SPORT  ×  TRAVEL  ×  COMMUNITY", bold: true, size: 16, font: "Arial", color: MINT })]
      }),
      new Paragraph({ children: [new PageBreak()] }),

      h1("1. Pricing & Package Architecture (Public)"),
      h2("Lanzarote Beach Volleyball Camp — Jan/Feb 2027"),
      body("Location: Playa Grande, Puerto del Carmen. Collaboration with beachvolleycamps.ch."),
      bold("Dates (public):"),
      bullet("Week 1: 30/31 Jan – 6/7 Feb 2027"),
      bullet("Week 2: 6/7 Feb – 13/14 Feb 2027"),
      bullet("Week 3: 13/14 Feb – 20/21 Feb 2027"),
      bold("Camp-only pricing:"),
      bullet("Early Bird: from £390 (until 1 August)"),
      bullet("General sale: from £425 per person"),
      bold("Camp + Accommodation (Moraña / La Moraña Apartments):"),
      bullet("From £780 per person"),
      bullet("2-bed apartment (4 people): £780 pp"),
      bullet("2-bed apartment (3 people): £850 pp"),
      bullet("1-bed apartment (2 people): £870 pp"),
      bullet("1-bed apartment (solo): £1,215 pp"),
      bold("What’s included (camp):"),
      bullet("9 training sessions (16+ hrs) with dedicated coach for the group"),
      bullet("2 afternoon social tournaments"),
      bullet("Welcome pack + Lanzarote vest top / sports bra"),
      bullet("Coach-led sunset stretches, pro exhibition games, camp dinner, farewell party"),
      bold("Optional extras:"),
      bullet("Weekend tournament via local partner Playa Grande Volley"),
      bullet("Custom playing shorts, Wednesday evening excursion, airport transfers"),
      bold("Payment mechanics (from booking confirmation page):"),
      bullet("£100 non-refundable deposit"),
      bullet("Final balance due by 15 January 2027 (payment link sent ~15 Dec 2026)"),
      bullet("Accommodation deposit separate; remaining balance due 1 January 2027"),
      bold("Explicitly not included:"),
      bullet("Flights, travel insurance, visas, transfers (unless requested/optional)"),
      callout("Clarity note", [
        "The site already states flights are the participant’s responsibility. This supports the Master Profile recommendation to keep the sports-experience vs travel-logistics distinction crystal clear."
      ]),

      h2("Mallorca Tennis Camp"),
      body("Location: Capdepera / Font de Sa Cala. Hotel Na Taconera (4★), ~2-minute walk to courts."),
      bold("Training package pricing (public):"),
      bullet("Individual (1:1 focus): £750 per person"),
      bullet("Pairs (2 players): £610 per person"),
      bullet("Group (up to 4 players): £475 per person"),
      bold("Included with every training option:"),
      bullet("7 coached sessions on clay courts"),
      bullet("2 afternoon tournaments + Camp Championships entry"),
      bullet("Open court play (approx. 9am–5/6pm)"),
      bullet("Welcome pack + Mallorca camp match shirt + coastal recovery stretch"),
      bold("Accommodation (public starting price):"),
      bullet("Hotel Na Taconera: from £525 for 7 nights half-board (breakfast + dinner buffet + soft drinks)"),
      bullet("Full-board plus option also listed"),
      body("Site listing also shows May 2026 timing on the Our Vacations page; Instagram activity references April 2027 for padel/tennis expansion."),

      h1("2. Product Calendar (Public Announcements)"),
      bullet("Lanzarote BV Camp 2027: three consecutive weeks late Jan – mid Feb (see above)"),
      bullet("Mallorca Tennis: May 2026 (site); further April 2027 messaging on social for tennis/padel"),
      bullet("Junior beach volleyball camp: February half-term 2026 (referenced in Instagram scrape)"),
      bullet("Gstaad beach volleyball: historically important via partner ecosystem; specific 2027 Hybrid dates not confirmed on public Hybrid pages at time of research"),
      body("Recommendation: maintain a single live calendar view (website + knowledge base) as more dates are released."),

      h1("3. Accommodation & On-Ground Partners"),
      h2("Confirmed public partners"),
      bullet("beachvolleycamps.ch (Swiss) — explicit co-organiser of Lanzarote camp; Mark Garcia-Kidd described as long-time coach and Hybrid founder (2025)"),
      bullet("Moraña / La Moraña Apartments, Puerto del Carmen — partner accommodation for Lanzarote (seafront, heated pool in winter, near Playa Grande)"),
      bullet("Hotel Na Taconera, Capdepera / Font de Sa Cala — Mallorca tennis base"),
      bullet("Playa Grande Volley (local Lanzarote club) — weekend tournament partner"),
      body("Courts: up to ~20 wind-protected courts at Playa Grande (per partner site)."),

      h1("4. Coach Roster — Public Layer"),
      h2("Mark Garcia-Kidd (ENG)"),
      bullet("Founder, Hybrid Vacations (founded 2025 per partner statement)"),
      bullet("Long-time coach with beachvolleycamps.ch"),
      bullet("England beach volleyball player — FIVB / bvbinfo profile exists (international results including 9th-place finishes; active FIVB seasons ~2018–2021+)"),
      bullet("Height listed 6'3\"; home town Dorset, resides London"),
      body("Public record supports the Master Profile emphasis on sporting credibility and “built by people who have lived the sport.”"),
      h2("Named Lanzarote coaching team (partner site)"),
      bullet("Martha Mullen (ENG)"),
      bullet("Issa Batrane (ENG)"),
      bullet("Dave Panah (ENG)"),
      bullet("Marco Bonaria (SUI)"),
      body("Additional coaches noted as joining. Full individual bios/credentials for the wider Instagram roster remain thin in public sources — recommend short verified profiles before website claims."),

      h1("5. Competitor Landscape (Sample)"),
      body("Relevant public operators for context (not exhaustive):"),
      bold("Specialist beach-volleyball camps"),
      bullet("beachvolleycamps.ch — Swiss-led; now partnering with Hybrid on Lanzarote; also runs other European camps"),
      bullet("Beach me (Germany) — Tenerife, Sardinia, Castelldefels, etc."),
      bullet("Sunset Beach Volley Camps — Gran Canaria"),
      bullet("Beachboard — Tenerife Hacienda all-inclusive style"),
      bullet("Volley4fun / Beach Volley Europe — e.g. Malaga packages"),
      bullet("Kzero12, More Than Camps — private / junior / performance focused"),
      bold("Broader racket / active holidays"),
      bullet("Active Away — tennis, padel, pickleball multi-destination hosted holidays"),
      bullet("Mark Warner — tennis (and some padel) within wider activity-holiday portfolio"),
      body("Hybrid’s differentiation still rests on: UK–Swiss collaboration, Mark’s personal brand + coaching network, multi-sport expansion (BV + tennis + padel), and the local-to-international coaching flywheel. Most pure BV camps lack the travel-agency + UK coaching layer; most UK tennis holidays lack the specialist beach-volleyball community depth."),

      h1("6. Customer Voice & Reviews"),
      body("Public third-party review volume (Google, Trustpilot, independent sites) remains low at the time of research. Most visible social proof is Instagram UGC, partner reposts, and camp announcement engagement."),
      body("Recommendation: prioritise systematic collection of post-camp testimonials and short video stories; surface 3–5 strong quotes on experience pages once available."),

      h1("7. Website & Content Baseline (Public)"),
      bullet("Homepage dual pitch: Sporting Vacations + Travel Agency capability"),
      bullet("Clear camp landing pages with packages, FAQs, inclusions, accommodation detail"),
      bullet("Booking confirmation flows already spell out deposits, balances, and flight responsibility"),
      bullet("Playing Levels Guide PDF referenced for BV grouping"),
      bullet("Support email: support@hybridvacations.com"),
      body("SEO opportunity terms already listed in Master Profile remain valid; current public footprint is still modest outside branded and camp-specific pages."),

      h1("8. Still Internal / Not Publicly Available"),
      bullet("Booking volumes, conversion rates, average order value, seasonality curves"),
      bullet("Email list size, CRM platform, historical email performance"),
      bullet("Paid media spend and results"),
      bullet("Full insurance, safeguarding policy detail, ATOL/ABTA or equivalent status"),
      bullet("Internal team structure and capacity beyond Mark and named coaches"),
      bullet("Unpublished rates or private partner commercial terms"),
      callout("Next useful internal inputs", [
        "1) Confirmed 2026–2027 full calendar across sports",
        "2) Sample of recent customer feedback / NPS",
        "3) Current tech stack (site platform, booking engine, analytics)",
        "4) Any existing coach bio pack for website use"
      ]),

      h1("9. Strategic Implications for the Knowledge Base"),
      body("The public data strengthens several Master Profile positions:"),
      bullet("Flights are already clearly excluded — good foundation for “Build Your Hybrid” modular messaging"),
      bullet("Pricing architecture is modular (camp-only vs camp+accom; training intensity tiers on tennis) — supports experience-finder logic"),
      bullet("Partner collaboration with beachvolleycamps.ch is explicit and mutual — valuable third-party validation"),
      bullet("Coach continuity (same coach with group all week) is a stated differentiator — keep this prominent"),
      bullet("Solo travellers are already accommodated in FAQs and grouping language"),
      quote("Public product and pricing detail is now sufficient to begin structured experience records and clearer website package presentation. Remaining commercial and operational gaps require internal data."),
      spacer(160),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: "HYBRID", bold: true, size: 26, font: "Arial", color: BLACK })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Travel Through What You Love.", size: 16, font: "Arial", color: MED_GREY })]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/workdir/artifacts/Hybrid_Intelligence_Addendum.docx", buffer);
  console.log("Document created successfully");
});
