const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
        BorderStyle, WidthType, ShadingType, PageNumber } = require("docx");
const fs = require("fs");

const MINT = "70CFCB";
const BLACK = "12272F";
const LIGHT_MINT = "E8F7F6";
const SOFT_GREY = "F5F7F8";
const MED_GREY = "6B7C85";
const AMBER = "B45309";

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
function ruleBox(lines) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 12, color: AMBER },
              bottom: { style: BorderStyle.SINGLE, size: 12, color: AMBER },
              left: { style: BorderStyle.SINGLE, size: 12, color: AMBER },
              right: { style: BorderStyle.SINGLE, size: 12, color: AMBER }
            },
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: "FFF7ED", type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: [
              new Paragraph({
                spacing: { after: 60 },
                children: [new TextRun({ text: "STANDING RULE — MARKETING & CONTENT", bold: true, size: 18, font: "Arial", color: AMBER })]
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
function row(name, handle, conf) {
  return new TableRow({
    children: [
      new TableCell({
        borders: greyBorders,
        width: { size: 3200, type: WidthType.DXA },
        margins: { top: 50, bottom: 50, left: 90, right: 90 },
        children: [new Paragraph({ children: [new TextRun({ text: name, bold: true, size: 17, font: "Arial", color: BLACK })] })]
      }),
      new TableCell({
        borders: greyBorders,
        width: { size: 3200, type: WidthType.DXA },
        margins: { top: 50, bottom: 50, left: 90, right: 90 },
        children: [new Paragraph({ children: [new TextRun({ text: handle, size: 17, font: "Arial", color: BLACK })] })]
      }),
      new TableCell({
        borders: greyBorders,
        width: { size: 2960, type: WidthType.DXA },
        margins: { top: 50, bottom: 50, left: 90, right: 90 },
        children: [new Paragraph({ children: [new TextRun({ text: conf, size: 16, font: "Arial", color: MED_GREY })] })]
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
              new TextRun({ text: "  ·  Coach Handles & Content Rules", size: 15, font: "Arial", color: MED_GREY })
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
              new TextRun({ text: "Internal reference  ·  20 August 2026  ·  Page ", size: 15, font: "Arial", color: MED_GREY }),
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
        children: [new TextRun({ text: "HYBRID VACATIONS", bold: true, size: 36, font: "Arial", color: BLACK })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 16, color: MINT, space: 1 } },
        children: [new TextRun({ text: " ", size: 6 })]
      }),
      spacer(40),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: "Coach Instagram Handles", size: 26, font: "Arial", color: BLACK })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: "& Standing Content Rule", size: 18, font: "Arial", color: MED_GREY })]
      }),

      ruleBox([
        "Deep Dish (including Deep Dish Beach, Deep Dish Vacations, Deep Dish Crystal Palace, or any related branding) must NOT appear in any Hybrid Vacations marketing, website copy, social content, sales materials, coach bios intended for public Hybrid use, or customer-facing communications.",
        "Historical association may exist in internal research documents only. It is classified as HISTORICAL and must never transfer into external Hybrid messaging.",
        "When writing coach profiles for Hybrid, describe playing and coaching credentials without naming Deep Dish as a current or past affiliation in public copy."
      ]),
      spacer(200),

      h1("1. Instagram handles (public)"),
      body("Handles below are the clearest public accounts identified from tags, athlete pages and official posts. Confirm with each coach before publishing on Hybrid channels."),
      spacer(80),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3200, 3200, 2960],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: greyBorders,
                width: { size: 3200, type: WidthType.DXA },
                shading: { fill: LIGHT_MINT, type: ShadingType.CLEAR },
                margins: { top: 50, bottom: 50, left: 90, right: 90 },
                children: [new Paragraph({ children: [new TextRun({ text: "Coach", bold: true, size: 16, font: "Arial", color: BLACK })] })]
              }),
              new TableCell({
                borders: greyBorders,
                width: { size: 3200, type: WidthType.DXA },
                shading: { fill: LIGHT_MINT, type: ShadingType.CLEAR },
                margins: { top: 50, bottom: 50, left: 90, right: 90 },
                children: [new Paragraph({ children: [new TextRun({ text: "Instagram", bold: true, size: 16, font: "Arial", color: BLACK })] })]
              }),
              new TableCell({
                borders: greyBorders,
                width: { size: 2960, type: WidthType.DXA },
                shading: { fill: LIGHT_MINT, type: ShadingType.CLEAR },
                margins: { top: 50, bottom: 50, left: 90, right: 90 },
                children: [new Paragraph({ children: [new TextRun({ text: "Confidence", bold: true, size: 16, font: "Arial", color: BLACK })] })]
              })
            ]
          }),
          row("Mark Garcia-Kidd", "@mgarciakidd", "High — used in Hybrid/partner content"),
          row("Martha Bullen", "@_marthab", "High — tagged by Volleyball England & camp posts"),
          row("Issa Batrane", "@issabatrane", "High — official athlete account"),
          row("Dave Panah", "Confirm with Dave", "No single clear personal handle locked publicly in research"),
          row("Marco Bonaria", "Confirm with Marco", "No prominent personal handle found; appears via partner channels"),
          row("Katya / Katya Kate", "Confirm with Katya", "Appears in Hybrid codes (Katya15); handle not confirmed")
        ]
      }),
      spacer(120),
      body("Also useful for tagging in Hybrid camp content when appropriate:"),
      bullet("@hybridvacations — main Hybrid account"),
      bullet("@beachvolleycamps.ch — confirmed collaboration partner (safe to reference)"),

      h1("2. How to use handles in Hybrid content"),
      bullet("Tag coaches on relevant camp announcement and coach-spotlight posts"),
      bullet("Include handles on website coach cards only with their permission"),
      bullet("Do not auto-assume handles remain current — re-check before major campaigns"),
      bullet("When in doubt, ask the coach for the handle they want Hybrid to use"),

      h1("3. Content rule reminder (apply to all future work)"),
      bold("Allowed in public Hybrid materials"),
      bullet("England / GB / Wales / Swiss playing credentials"),
      bullet("FIVB / Beach Pro Tour / UKBT results"),
      bullet("Hybrid camp coaching roles"),
      bullet("beachvolleycamps.ch collaboration (current partner)"),
      bullet("Club playing (e.g. Richmond) where the coach is happy to publish it"),
      bold("Not allowed in public Hybrid materials"),
      bullet("Any mention of Deep Dish as employer, partner, history, or affiliation"),
      bullet("Phrasing that implies Hybrid is an extension of, or successor to, Deep Dish"),
      body("Internal research docs may retain historical context for the team’s own understanding. Customer-facing and marketing outputs must stay clean of it."),

      spacer(160),
      callout("Action", [
        "Add the Deep Dish exclusion to any content checklist or brand guidelines used by Hybrid or freelancers.",
        "When requesting bios from coaches, ask for a Hybrid-ready version that omits organisations Hybrid does not wish to surface.",
        "Confirm Dave, Marco and Katya preferred Instagram handles directly before first public use."
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
  fs.writeFileSync("/home/workdir/artifacts/Hybrid_Coach_Handles_Content_Rules.docx", buffer);
  console.log("Document created successfully");
});
