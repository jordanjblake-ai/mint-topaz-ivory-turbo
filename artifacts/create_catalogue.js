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
function h3(t) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text: t, bold: true, size: 22, font: "Arial", color: "1A3A45" })]
  });
}
function body(t) {
  return new Paragraph({
    spacing: { after: 110, line: 276 },
    children: [new TextRun({ text: t, size: 20, font: "Arial", color: BLACK })]
  });
}
function bold(t) {
  return new Paragraph({
    spacing: { after: 110, line: 276 },
    children: [new TextRun({ text: t, size: 20, font: "Arial", color: BLACK, bold: true })]
  });
}
function bullet(t) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 45, line: 276 },
    children: [new TextRun({ text: t, size: 20, font: "Arial", color: BLACK })]
  });
}
function numbered(t, ref) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 55, line: 276 },
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
            margins: { top: 110, bottom: 110, left: 150, right: 150 },
            children: [
              new Paragraph({
                spacing: { after: 50 },
                children: [new TextRun({ text: title, bold: true, size: 18, font: "Arial", color: BLACK })]
              }),
              ...lines.map(t => new Paragraph({
                spacing: { after: 25 },
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
            margins: { top: 110, bottom: 110, left: 170, right: 130 },
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
function kv(label, value) {
  return new TableRow({
    children: [
      new TableCell({
        borders: greyBorders,
        width: { size: 2800, type: WidthType.DXA },
        shading: { fill: LIGHT_MINT, type: ShadingType.CLEAR },
        margins: { top: 45, bottom: 45, left: 90, right: 90 },
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 16, font: "Arial", color: BLACK })] })]
      }),
      new TableCell({
        borders: greyBorders,
        width: { size: 6560, type: WidthType.DXA },
        margins: { top: 45, bottom: 45, left: 90, right: 90 },
        children: [new Paragraph({ children: [new TextRun({ text: value, size: 16, font: "Arial", color: BLACK })] })]
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
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Arial", color: "1A3A45" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "actions", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "priority", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
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
              new TextRun({ text: "  ·  Experience Catalogue & Next Actions", size: 15, font: "Arial", color: MED_GREY })
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
              new TextRun({ text: "Working document  ·  20 August 2026  ·  Page ", size: 15, font: "Arial", color: MED_GREY }),
              new TextRun({ children: [PageNumber.CURRENT], size: 15, font: "Arial", color: MED_GREY })
            ]
          })
        ]
      })
    },
    children: [
      // COVER
      spacer(450),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "HYBRID VACATIONS", bold: true, size: 40, font: "Arial", color: BLACK })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 140 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 16, color: MINT, space: 1 } },
        children: [new TextRun({ text: " ", size: 6 })]
      }),
      spacer(60),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "Experience Catalogue", size: 28, font: "Arial", color: BLACK })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 180 },
        children: [new TextRun({ text: "& Prioritised Next Actions", size: 20, font: "Arial", color: MED_GREY })]
      }),
      callout("Purpose", [
        "Structured product records drawn from public website and partner data — ready for website experience pages, sales conversations, and future AI knowledge base.",
        "Plus a short prioritised action list based on everything reviewed to date."
      ]),
      spacer(180),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "SPORT  ×  TRAVEL  ×  COMMUNITY", bold: true, size: 16, font: "Arial", color: MINT })]
      }),
      new Paragraph({ children: [new PageBreak()] }),

      // EXPERIENCE 1
      h1("1. Lanzarote Beach Volleyball Camp"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2800, 6560],
        rows: [
          kv("Sport", "Beach Volleyball"),
          kv("Destination", "Playa Grande, Puerto del Carmen, Lanzarote"),
          kv("Dates 2027", "Week 1: 30/31 Jan – 6/7 Feb  ·  Week 2: 6/7 – 13/14 Feb  ·  Week 3: 13/14 – 20/21 Feb"),
          kv("Primary partner", "beachvolleycamps.ch (Swiss) — co-organiser"),
          kv("Local partner", "Playa Grande Volley (weekend tournaments)"),
          kv("Accommodation partner", "Moraña / La Moraña Apartments (seafront, heated winter pool)"),
          kv("Skill levels", "Improver to advanced — grouped by Hybrid Playing Levels Guide"),
          kv("Solo friendly", "Yes — partner matching and group integration offered")
        ]
      }),
      spacer(120),
      h3("Packages & Pricing (public)"),
      bold("Camp only"),
      bullet("Early Bird from £390 pp (until 1 August)"),
      bullet("General sale from £425 pp"),
      bold("Camp + Accommodation"),
      bullet("From £780 pp"),
      bullet("2-bed (4 people): £780 pp  ·  2-bed (3 people): £850 pp"),
      bullet("1-bed (2 people): £870 pp  ·  1-bed solo: £1,215 pp"),
      bold("Payment"),
      bullet("£100 non-refundable deposit"),
      bullet("Camp balance due 15 Jan 2027  ·  Accommodation balance due 1 Jan 2027"),
      h3("What’s included"),
      bullet("9 structured training sessions (16+ hrs) with the same dedicated coach for the group"),
      bullet("2 afternoon social tournaments"),
      bullet("Welcome pack + Lanzarote vest top / sports bra"),
      bullet("Coach-led sunset stretches, pro exhibition games, camp dinner, farewell party"),
      h3("Optional / not included"),
      bullet("Weekend tournament (Playa Grande Volley), custom shorts, Wednesday excursion, airport transfers"),
      bullet("Flights, travel insurance, visas — participant responsibility (clearly stated)"),
      h3("Key differentiators to surface"),
      bullet("Same coach with your group all week — progressive, not rotating"),
      bullet("UK–Swiss collaboration + European player community"),
      bullet("Solo travellers welcomed and integrated"),
      bullet("Half-day Wednesday for island exploration / recovery"),

      // EXPERIENCE 2
      h1("2. Mallorca Tennis Camp"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2800, 6560],
        rows: [
          kv("Sport", "Tennis"),
          kv("Destination", "Capdepera / Font de Sa Cala, Mallorca"),
          kv("Timing (public)", "May 2026 (site); April 2027 signals also present on social"),
          kv("Accommodation", "Hotel Na Taconera (4★) — ~2-minute walk to courts"),
          kv("Court surface", "Clay (9 courts referenced)"),
          kv("Positioning", "Pre-season / training-focused tennis escape with social layer")
        ]
      }),
      spacer(120),
      h3("Training package pricing (public)"),
      bullet("Individual (1:1 focus): £750 pp"),
      bullet("Pairs (2 players): £610 pp"),
      bullet("Group (up to 4 players): £475 pp"),
      h3("Included with every option"),
      bullet("7 coached sessions on clay"),
      bullet("2 afternoon tournaments + Camp Championships entry"),
      bullet("Open court play (~9am–5/6pm)"),
      bullet("Welcome pack + camp match shirt + coastal recovery stretch"),
      h3("Accommodation"),
      bullet("From £525 for 7 nights half-board (breakfast + dinner buffet + soft drinks)"),
      bullet("Full-board plus available"),
      h3("Notes for website / sales"),
      bullet("Clear modular structure (choose training intensity + accommodation)"),
      bullet("Supports “Coastlines & Courtlines” positioning already used in content"),
      bullet("Padel expansion for Mallorca April 2027 already in social — keep brand architecture ready"),

      // EXPERIENCE 3 PLACEHOLDER
      h1("3. Emerging / Partially Public"),
      h3("Mallorca Padel"),
      body("April 2027 messaging live on Instagram (“WELCOME to HYBRID Padel — MALLORCA 5th to 9th April 2027”). Full package page and pricing not yet public on hybridvacations.com at time of research. Treat as confirmed direction; structure experience record once details publish."),
      h3("Junior / Performance Beach Volleyball"),
      body("February half-term 2026 junior camp referenced in Instagram feed. Further performance / junior programmes flagged strategically in Master Profile but limited public package detail yet."),
      h3("Gstaad Beach Volleyball"),
      body("Strong historical and visual presence via partner ecosystem. Specific Hybrid-branded 2027 public dates not confirmed on Hybrid site at research time."),
      h3("UK Coaching, Clinics & Mini-Camps"),
      body("Strategically central (London / South East bridge to international camps). No public price list or fixed clinic calendar found on the main Hybrid site — recommend prioritising a clear Coaching section and booking path."),

      // STRUCTURED FIELDS TEMPLATE
      h1("4. Recommended Experience Data Fields"),
      body("For every future Hybrid experience, capture at minimum:"),
      bullet("Sport  ·  Destination  ·  Exact dates  ·  Skill level range"),
      bullet("Package types & prices (camp-only / camp+accom / training intensity)"),
      bullet("What’s included  ·  What’s optional  ·  What’s not included (especially flights)"),
      bullet("Primary coaches  ·  Partner organisations  ·  Accommodation partner"),
      bullet("Solo / group / club suitability  ·  Typical group size if known"),
      bullet("Booking link / deposit rules  ·  Key FAQ answers"),
      bullet("Hero images / video  ·  2–3 customer proof points when available"),
      callout("Knowledge-base tip", [
        "These fields map directly to the Experience Finder and Lead Agent concepts in the Master Profile. Populate them once and both human sales and future AI can use the same source of truth."
      ]),

      // NEXT ACTIONS
      new Paragraph({ children: [new PageBreak()] }),
      h1("5. Prioritised Next Actions"),
      body("Based on the curated Master Profile, Instagram intelligence, and public research:"),
      h2("Immediate (this month)"),
      numbered("Publish or finalise full public package pages for Mallorca Padel (and any remaining Tennis detail) so pricing and inclusions match Lanzarote clarity.", "actions"),
      numbered("Create short verified coach profiles (Mark + Martha, Issa, Dave, Marco at minimum) for website About / Coaches section — public credentials already support Mark strongly.", "actions"),
      numbered("Add a clear Coaching / Clinics entry point on the site (even if “enquire for London sessions”) so the local-to-international flywheel is visible.", "actions"),
      numbered("Collect 5–8 post-camp testimonials (text + optional short video) and place 2–3 on the Lanzarote page immediately.", "actions"),
      h2("Near term (next 4–8 weeks)"),
      numbered("Build a single live product calendar (all sports, all destinations) for internal use and a simplified public version.", "priority"),
      numbered("Draft the Experience Finder question set (sport, level, dates, solo/group, performance vs social) using the modular pricing already live.", "priority"),
      numbered("Formalise the ambassador / referral framework around existing coach codes (Dave15, Katie15, Martha15, etc.) with tracking and simple landing pages.", "priority"),
      numbered("Light competitor watchlist: note pricing and messaging of beachvolleycamps.ch (partner), Beach me, Active Away, and 1–2 other BV camps for ongoing differentiation checks.", "priority"),
      h2("Strategic (alongside website redesign)"),
      numbered("Keep “Travel Through What You Love / Sport. Travel. Community.” as the master narrative; ensure every experience page answers: train, explore, connect.", "priority"),
      numbered("Surface the dual nature of Hybrid (owned sports experiences + travel-agency capability) without diluting the sports-community heart.", "priority"),
      numbered("Prepare structured experience records in a simple shared sheet or CMS so AI content and lead tools can read them later.", "priority"),

      spacer(120),
      quote("You already have a coherent strategy, live pricing architecture, a real partner ecosystem, and social proof of community. The highest-leverage work now is making the public product and coach story as clear and modular as the strategy document."),
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
  fs.writeFileSync("/home/workdir/artifacts/Hybrid_Experience_Catalogue.docx", buffer);
  console.log("Document created successfully");
});
