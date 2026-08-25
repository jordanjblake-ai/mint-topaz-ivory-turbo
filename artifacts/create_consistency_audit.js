const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, LevelFormat, BorderStyle, WidthType,
        ShadingType, PageNumber, PageBreak, VerticalAlign } = require('docx');
const fs = require('fs');

const AQUA = "52D6C7";
const CHARCOAL = "0D0E10";
const LIGHT_GRAY = "F5F7F8";
const MID_GRAY = "CCCCCC";
const WARN = "FFF3CD";
const OK = "D4EDDA";

const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: MID_GRAY };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const aquaBorder = { style: BorderStyle.SINGLE, size: 12, color: AQUA };
const borders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const aquaLeft = { top: noBorder, bottom: noBorder, left: aquaBorder, right: noBorder };

function cell(text, opts = {}) {
  const { bold = false, fill = null, width = 2340, color = CHARCOAL, fontSize = 17 } = opts;
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: fill ? { fill, type: ShadingType.CLEAR } : undefined,
    margins: { top: 70, bottom: 70, left: 90, right: 90 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      children: [new TextRun({ text, bold, font: "Arial", size: fontSize, color })]
    })]
  });
}

function callout(text, fill = LIGHT_GRAY) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        borders: aquaLeft,
        width: { size: 9360, type: WidthType.DXA },
        shading: { fill, type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 140, right: 140 },
        children: [new Paragraph({
          children: [new TextRun({ text, font: "Arial", size: 18, color: CHARCOAL })]
        })]
      })]
    })]
  });
}

function h1(text) {
  return new Paragraph({
    spacing: { before: 320, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: AQUA, space: 6 } },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 26, color: CHARCOAL })]
  });
}

function h2(text) {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 22, color: CHARCOAL })]
  });
}

function body(text) {
  return new Paragraph({
    spacing: { after: 100 },
    children: [new TextRun({ text, font: "Arial", size: 19, color: CHARCOAL })]
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 70 },
    children: [new TextRun({ text, font: "Arial", size: 19, color: CHARCOAL })]
  });
}

const doc = new Document({
  styles: { default: { document: { run: { font: "Arial", size: 19 } } } },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1008, right: 1008, bottom: 1008, left: 1008 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: AQUA, space: 4 } },
          children: [
            new TextRun({ text: "HYBRID VACATIONS", bold: true, font: "Arial", size: 16, color: CHARCOAL }),
            new TextRun({ text: "  ·  Documentation Consistency Audit", font: "Arial", size: 16, color: "666666" })
          ]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: MID_GRAY, space: 4 } },
          children: [
            new TextRun({ text: "Internal  ·  Page ", font: "Arial", size: 14, color: "888888" }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 14, color: "888888" })
          ]
        })]
      })
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: "HYBRID VACATIONS", bold: true, font: "Arial", size: 32, color: CHARCOAL })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: "Documentation Consistency Audit", bold: true, font: "Arial", size: 24, color: AQUA })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: "21 August 2026  ·  Post Brand Foundations alignment", font: "Arial", size: 16, color: "666666" })]
      }),
      callout("Scope: Cross-check all Hybrid Vacations folder documents for design consistency, contradictory data, missing pieces, and readability. Wikimedia stock image removed as requested."),

      h1("1. Design system alignment"),
      body("Brand Design Foundations is now the visual source of truth. Key tokens:"),
      bullet("Hybrid Charcoal #0D0E10 · Hybrid Aqua #52D6C7 · Pure White · Deep Slate #1A232A"),
      bullet("Typography: Bebas Neue / Anton (headlines) · Inter / Montserrat (body) · brush accents sparingly"),
      bullet("Document style standard: Arial body, aqua accent rules, charcoal headers, callout boxes, page breaks between major sections"),
      callout("Older internal notes referenced Fresh Mint #70CFCB / Obsidian #12272F. Treat those as superseded. All new and revised docs should use #52D6C7 and #0D0E10."),

      new Paragraph({ children: [new PageBreak()] }),

      h1("2. Data contradictions found"),
      h2("2.1 Instagram handles (needs update)"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2200, 2800, 2200, 2160],
        rows: [
          new TableRow({ children: [
            cell("Coach", { bold: true, fill: CHARCOAL, color: "FFFFFF", width: 2200, fontSize: 15 }),
            cell("Locked (Source of Truth)", { bold: true, fill: CHARCOAL, color: "FFFFFF", width: 2800, fontSize: 15 }),
            cell("Still says “confirm”", { bold: true, fill: CHARCOAL, color: "FFFFFF", width: 2200, fontSize: 15 }),
            cell("Action", { bold: true, fill: CHARCOAL, color: "FFFFFF", width: 2160, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("Dave Panah", { width: 2200, fontSize: 15 }),
            cell("@lifeofdavoud", { width: 2800, fontSize: 15, fill: OK }),
            cell("Coach Handles + Short Bios", { width: 2200, fontSize: 15, fill: WARN }),
            cell("Update both docs", { width: 2160, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("Marco Bonaria", { width: 2200, fontSize: 15, fill: LIGHT_GRAY }),
            cell("@beachvolleycamps.ch", { width: 2800, fontSize: 15, fill: OK }),
            cell("Coach Handles + Short Bios", { width: 2200, fontSize: 15, fill: WARN }),
            cell("Update both docs", { width: 2160, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("Katya Kate", { width: 2200, fontSize: 15 }),
            cell("@katyasteps", { width: 2800, fontSize: 15, fill: OK }),
            cell("Coach Handles + Short Bios", { width: 2200, fontSize: 15, fill: WARN }),
            cell("Update both docs", { width: 2160, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("David Silva", { width: 2200, fontSize: 15, fill: LIGHT_GRAY }),
            cell("@nave_dave_", { width: 2800, fontSize: 15, fill: OK }),
            cell("Missing from some roster lists", { width: 2200, fontSize: 15, fill: WARN }),
            cell("Add to bios + Brand Foundations roster", { width: 2160, fontSize: 15 }),
          ]}),
        ]
      }),

      h2("2.2 Colour tokens"),
      body("Early curated docs used #70CFCB / #12272F. Brand Foundations locks #52D6C7 / #0D0E10. No content contradiction — design only. Adopt Foundations going forward."),

      h2("2.3 Pricing language"),
      bullet("Lanzarote packages and public “From £…” language stay on site as published."),
      bullet("Mark private coaching £50/hr is INTERNAL ONLY (Commercial Notes) — consistent with “Enquire only” on website."),
      bullet("Tennis / Padel: pre-register only, exact pricing still TBC — consistent across docs."),

      h2("2.4 Deep Dish rule"),
      body("Consistently enforced in Voice Rules, Coach Handles, Brand Foundations, and Source of Truth Content Rules. No contradiction found."),

      new Paragraph({ children: [new PageBreak()] }),

      h1("3. Missing pieces (still open)"),
      bullet("Real testimonials (drafts only exist — not for live publish)"),
      bullet("Final coach photo permissions + preferred public bio sign-off"),
      bullet("Tennis & Padel exact pricing and full package inclusions"),
      bullet("Full Instagram media archive from Hybrid account (Mark export)"),
      bullet("UK clinics calendar / locations if any fixed dates exist"),
      bullet("Golf 2028 — location TBC (correctly marked)"),
      bullet("Partners tab in Source of Truth spreadsheet (mentioned in Partnerships doc)"),

      h1("4. Document inventory & design status"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4200, 2600, 2560],
        rows: [
          new TableRow({ children: [
            cell("Document", { bold: true, fill: CHARCOAL, color: "FFFFFF", width: 4200, fontSize: 15 }),
            cell("Format", { bold: true, fill: CHARCOAL, color: "FFFFFF", width: 2600, fontSize: 15 }),
            cell("Design status", { bold: true, fill: CHARCOAL, color: "FFFFFF", width: 2560, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("Brand Design Foundations", { width: 4200, fontSize: 15 }),
            cell("Word (new)", { width: 2600, fontSize: 15, fill: OK }),
            cell("Aligned", { width: 2560, fontSize: 15, fill: OK }),
          ]}),
          new TableRow({ children: [
            cell("Master Profile", { width: 4200, fontSize: 15, fill: LIGHT_GRAY }),
            cell("Word", { width: 2600, fontSize: 15, fill: LIGHT_GRAY }),
            cell("Good — minor colour note", { width: 2560, fontSize: 15, fill: LIGHT_GRAY }),
          ]}),
          new TableRow({ children: [
            cell("Instagram Scrape", { width: 4200, fontSize: 15 }),
            cell("Word", { width: 2600, fontSize: 15 }),
            cell("Good", { width: 2560, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("Voice Rules & Website Checklist", { width: 4200, fontSize: 15, fill: LIGHT_GRAY }),
            cell("Word", { width: 2600, fontSize: 15, fill: LIGHT_GRAY }),
            cell("Good", { width: 2560, fontSize: 15, fill: LIGHT_GRAY }),
          ]}),
          new TableRow({ children: [
            cell("Coach Handles & Content Rules", { width: 4200, fontSize: 15 }),
            cell("Word", { width: 2600, fontSize: 15 }),
            cell("Update handles", { width: 2560, fontSize: 15, fill: WARN }),
          ]}),
          new TableRow({ children: [
            cell("Short Bios & Testimonials", { width: 4200, fontSize: 15, fill: LIGHT_GRAY }),
            cell("Word", { width: 2600, fontSize: 15, fill: LIGHT_GRAY }),
            cell("Update handles + David Silva", { width: 2560, fontSize: 15, fill: WARN }),
          ]}),
          new TableRow({ children: [
            cell("Commercial Notes (internal)", { width: 4200, fontSize: 15 }),
            cell("Word", { width: 2600, fontSize: 15 }),
            cell("Good", { width: 2560, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("Key Partnerships", { width: 4200, fontSize: 15, fill: LIGHT_GRAY }),
            cell("Word", { width: 2600, fontSize: 15, fill: LIGHT_GRAY }),
            cell("Good", { width: 2560, fontSize: 15, fill: LIGHT_GRAY }),
          ]}),
          new TableRow({ children: [
            cell("Experience Source of Truth", { width: 4200, fontSize: 15 }),
            cell("Excel", { width: 2600, fontSize: 15 }),
            cell("Live — handles current", { width: 2560, fontSize: 15, fill: OK }),
          ]}),
          new TableRow({ children: [
            cell("Website Current-State Audit", { width: 4200, fontSize: 15, fill: LIGHT_GRAY }),
            cell("Word", { width: 2600, fontSize: 15, fill: LIGHT_GRAY }),
            cell("Good", { width: 2560, fontSize: 15, fill: LIGHT_GRAY }),
          ]}),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      h1("5. Recommended next actions"),
      bullet("Update Coach Handles + Short Bios with locked handles (Dave, Marco, Katya, David Silva)"),
      bullet("Add David Silva short bio if missing from Short Bios doc"),
      bullet("Treat Brand Foundations colour system as mandatory for website rebuild"),
      bullet("When editing long Word docs, keep major sections starting on a new page (pageBreakBefore)"),
      bullet("Keep Source of Truth spreadsheet as the live commercial/ops list"),
      bullet("Trash original Google Doc version of Brand Foundations once Word is confirmed"),

      h1("6. Readability notes applied"),
      body("Brand Foundations Word conversion uses:"),
      bullet("Clear H1 with aqua underline separators"),
      bullet("Page breaks before major sections so content is not cut mid-block"),
      bullet("Alternating table row shading for scanability"),
      bullet("Callout boxes for critical rules (Deep Dish, purpose statements)"),
      bullet("Consistent header/footer with page numbers"),
      bullet("Tight but readable spacing — no dense walls of text"),

      new Paragraph({ spacing: { before: 360 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Travel Through What You Love.", italics: true, font: "Arial", size: 18, color: AQUA })] }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/home/workdir/artifacts/Hybrid_Documentation_Consistency_Audit.docx", buf);
  console.log("Created Consistency Audit");
});
