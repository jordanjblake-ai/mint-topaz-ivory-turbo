const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
        BorderStyle, WidthType, ShadingType, PageNumber, PageBreak } = require("docx");
const fs = require("fs");

const MINT = "70CFCB";
const BLACK = "12272F";
const LIGHT_MINT = "E8F7F6";
const SOFT_GREY = "F5F7F8";
const MED_GREY = "6B7C85";
const AMBER = "B45309";
const RED = "B91C1C";

const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: MINT };
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
function issue(t) {
  return new Paragraph({
    numbering: { reference: "issues", level: 0 },
    spacing: { after: 45, line: 276 },
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
function problemBox(lines) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 8, color: AMBER },
              bottom: { style: BorderStyle.SINGLE, size: 8, color: AMBER },
              left: { style: BorderStyle.SINGLE, size: 8, color: AMBER },
              right: { style: BorderStyle.SINGLE, size: 8, color: AMBER }
            },
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: "FFF7ED", type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 140, right: 140 },
            children: lines.map(t => new Paragraph({
              spacing: { after: 30 },
              children: [new TextRun({ text: t, size: 17, font: "Arial", color: BLACK })]
            }))
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
      { reference: "issues", levels: [{ level: 0, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1260, right: 1260, bottom: 1260, left: 1260 } }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: MINT, space: 4 } },
            spacing: { after: 80 },
            children: [
              new TextRun({ text: "HYBRID VACATIONS", bold: true, size: 15, font: "Arial", color: BLACK }),
              new TextRun({ text: "  ·  Website Current-State Audit (Baseline)", size: 15, font: "Arial", color: MED_GREY })
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
              new TextRun({ text: "Baseline for redesign comparison  ·  Audited 20 August 2026  ·  Page ", size: 15, font: "Arial", color: MED_GREY }),
              new TextRun({ children: [PageNumber.CURRENT], size: 15, font: "Arial", color: MED_GREY })
            ]
          })
        ]
      })
    },
    children: [
      spacer(300),
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
      spacer(40),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: "Website Current-State Audit", size: 28, font: "Arial", color: BLACK })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 },
        children: [new TextRun({ text: "Baseline snapshot · Gaps · Design issues · Redesign comparison tool", size: 18, font: "Arial", color: MED_GREY })]
      }),
      callout("Purpose of this document", [
        "Record how hybridvacations.com stands today so the next version can be measured against a clear before.",
        "Use for redesign brief, stakeholder demos, and before/after case studies.",
        "Screenshots referenced from live capture 20 August 2026. Re-capture if the live site changes before redesign starts."
      ]),
      spacer(100),
      new Paragraph({ children: [new PageBreak()] }),

      h1("1. Site map (as live)"),
      body("Primary domain: https://www.hybridvacations.com"),
      bold("Confirmed pages"),
      bullet("Home — /"),
      bullet("Our Vacations — /our-vacations"),
      bullet("Lanzarote Beach Volleyball Camp — /lanzarote-camp"),
      bullet("Lanzarote booking / confirmation flow — /lanzarote-booking-page (+ confirmation)"),
      bullet("About — /about"),
      bullet("Travel Agency — /travel-agency (links out to InteleTravel booking platform)"),
      bullet("Pre-registration — /pre-registration (Tennis, Padel, Golf)"),
      bullet("Request a quote — /request-a-quote"),
      bullet("Playing Levels Guide PDF — hosted file"),
      body("Navigation (header): Logo · Our Vacations · About. Minimal. No Coaching, Coaches, or Instagram link in primary nav on capture."),

      h1("2. Homepage — current state"),
      h3("What it does"),
      bullet("Full-bleed beach aerial hero with headline: “FIND YOUR NEXT EXCEPTIONAL VACATION” (mint text)"),
      bullet("Circular Hybrid logo top-left"),
      bullet("Short “What is Hybrid Vacations?” block: travel agency + signature sports camps"),
      bullet("Two pillars: Sporting Vacations → Our Vacations; Travel Agency → Travel Agency page"),
      h3("Design / UX issues"),
      issue("Large empty white space below the hero — page feels unfinished / sparse"),
      issue("Headline is generic (“exceptional vacation”) — does not lead with Sport × Travel × Community or “Travel Through What You Love”"),
      issue("No product cards, dates, or social proof on the home fold"),
      issue("No coach faces, no testimonials, no Instagram feed or social proof"),
      issue("Dual identity (camps + travel agency) is stated but not prioritised — visitor may not know which path to take first"),
      issue("Nav is very thin; easy to miss depth of offer"),
      h3("Content gaps vs strategy"),
      issue("Missing: upcoming experiences strip, coach teaser, 1–2 testimonials, Coaching enquire CTA, Instagram handle"),

      h1("3. Our Vacations — current state"),
      h3("What it does"),
      bullet("Lists four products: Lanzarote BV (Feb 2027), Padel Mallorca (Apr 2027), Tennis Mallorca (Apr 2027), Golf (2028)"),
      bullet("Lanzarote → Find out more (full camp page)"),
      bullet("Padel / Tennis / Golf → Pre-register"),
      h3("Design / UX issues"),
      issue("Typo: “Puerto del Carman” (should be Carmen)"),
      issue("Typo / inconsistency: “Font de Sa Gala” vs Sa Cala"),
      issue("Cards feel sparse — limited imagery hierarchy, little differentiation between live bookable and pre-register"),
      issue("No pricing teaser on Lanzarote card; no “from £…” despite live packages existing"),
      issue("Golf “LOCATION TBC | TBC” looks incomplete on a public page"),
      h3("Content gaps"),
      issue("No coach names, no level guidance, no solo-friendly badge, no social proof on listing level"),

      h1("4. Lanzarote Camp page — current state"),
      h3("What works"),
      bullet("Most complete product page on the site"),
      bullet("Clear dates (3 weeks Jan–Feb 2027)"),
      bullet("Packages: Camp only (from £425 / EB £390) and Camp + Accommodation (from £780) with apartment tiers"),
      bullet("Inclusions list, optional extras, training philosophy (“same coach all week”), tournaments, sunset recovery, community"),
      bullet("Accommodation detail (Moraña / La Moraña), FAQ block, levels guide PDF link"),
      bullet("Solo-friendly messaging present"),
      h3("Design / UX issues"),
      issue("Long scrolling page; hierarchy and visual breaks could be stronger"),
      issue("Coach names not featured with photos/bios on this page (big missed conversion and trust moment)"),
      issue("No testimonials block despite strong community claims"),
      issue("“World-class” repeated; Instagram-style energy is weaker than the actual social feed"),
      issue("Some copy density; scannability for mobile could improve"),
      h3("Content gaps"),
      issue("Named coaches + short bios + Instagram handles"),
      issue("2–3 real testimonials"),
      issue("Clearer visual schedule / day-in-the-life"),
      issue("Stronger photo set of actual Hybrid groups (rights permitting)"),

      h1("5. About page — current state"),
      h3("What it does"),
      bullet("Positions Hybrid as travel + sport + community"),
      bullet("Founder story: Mark Garcia-Kidd, international sport, organising own travel"),
      bullet("“Why Hybrid?” name explanation"),
      bullet("Contact: support@hybridvacations.com + follow links (sparse on capture)"),
      h3("Design / UX issues"),
      issue("Very short; large empty vertical space"),
      issue("No founder photo, no coach team, no values visual, no timeline"),
      issue("Does not introduce the wider coaching team"),
      h3("Content gaps"),
      issue("Team / coaches section"),
      issue("Link to Instagram @hybridvacations"),
      issue("Stronger “what we believe” block matching Voice brief"),

      h1("6. Travel Agency page — current state"),
      h3("What it does"),
      bullet("Explains search vs request-a-quote"),
      bullet("BOOK NOW → external InteleTravel platform (hybridvacations.inteletravel.uk)"),
      bullet("REQUEST A QUOTE → on-site form page"),
      h3("Design / UX issues"),
      issue("Feels thin and secondary to the sports camps story"),
      issue("External booking platform may break brand continuity (different UI)"),
      issue("Risk of confusing the primary Hybrid narrative (sport communities) with generic travel retail"),
      h3("Strategic note"),
      body("Keep dual capability visible without letting the agency product dilute the sports-community heart of the brand (per Master Profile)."),

      h1("7. Cross-site design patterns that need work"),
      problemBox([
        "Sparse layouts and large empty regions — site feels under-built rather than premium-minimal.",
        "Inconsistent place-name spelling (Carman / Carmen, Sa Gala / Sa Cala).",
        "Weak social proof: almost no testimonials, no coach faces, limited community imagery on key pages.",
        "Brand line “Travel Through What You Love” / Sport × Travel × Community underused vs generic “exceptional vacation”.",
        "Nav too thin for the real product set (Coaching, Coaches, Instagram not surfaced).",
        "Mobile scannability of long Lanzarote FAQ/content blocks can be improved with clearer subheads and cards.",
        "Pre-register products sit next to live bookable without strong visual status differentiation."
      ]),

      h1("8. Missing pages / sections (vs strategy)"),
      bullet("Coaching / Clinics (UK) — simple Enquire page still needed"),
      bullet("Coaches index (Mark, Martha, Issa, Dave, Marco, Katya with bios + handles)"),
      bullet("Testimonials / community proof section (site-wide)"),
      bullet("Experience Finder or guided “which camp?” path"),
      bullet("Stronger Instagram / social entry points"),
      bullet("Consistent footer with contact, T&Cs, Instagram, key CTAs"),

      h1("9. What is already strong (protect in redesign)"),
      bullet("Lanzarote product depth: dates, packages, inclusions, same-coach model, solo-friendly, FAQs"),
      bullet("Clear dual model (owned camps + travel agency capability)"),
      bullet("Founder story on About is authentic"),
      bullet("Mint / black palette direction already present in logo and hero type"),
      bullet("Pre-register approach for Tennis/Padel while pricing is unfinished — correct restraint"),

      h1("10. How to use this as a before/after tool"),
      body("When the new site ships, capture matching screenshots of:"),
      bullet("Homepage (above the fold + mid-page)"),
      bullet("Our Vacations listing"),
      bullet("Lanzarote camp page (hero + packages + coaches block)"),
      bullet("About / Coaches"),
      bullet("Coaching Enquire (new)"),
      body("Score each against: clarity of offer, social proof, coach visibility, brand line usage, density vs emptiness, typos fixed, mobile scan, CTA strength. This audit is the baseline scorecard."),

      spacer(120),
      callout("Screenshot note", [
        "Desktop homepage hero was captured live on 20 August 2026 (beach aerial, circular logo, mint headline, thin nav).",
        "Re-capture full-page scrolls of Home, Our Vacations, Lanzarote, About, and Travel Agency before design kickoff so the redesign team has pixel evidence of the baseline.",
        "Store captures in the Hybrid Drive folder alongside this document."
      ]),
      spacer(140),
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
  fs.writeFileSync("/home/workdir/artifacts/Hybrid_Website_Current_State_Audit.docx", buffer);
  console.log("Audit created");
});
