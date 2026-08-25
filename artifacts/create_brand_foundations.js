const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, LevelFormat, BorderStyle, WidthType,
        ShadingType, PageNumber, PageBreak, VerticalAlign } = require('docx');
const fs = require('fs');

const AQUA = "52D6C7";
const CHARCOAL = "0D0E10";
const SLATE = "1A232A";
const WHITE = "FFFFFF";
const LIGHT_GRAY = "F5F7F8";
const MID_GRAY = "CCCCCC";

const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: MID_GRAY };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const aquaBorder = { style: BorderStyle.SINGLE, size: 12, color: AQUA };
const borders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const aquaLeftBorders = { top: noBorder, bottom: noBorder, left: aquaBorder, right: noBorder };

function cell(text, opts = {}) {
  const { bold = false, fill = null, width = 2340, color = CHARCOAL, fontSize = 18, align = AlignmentType.LEFT } = opts;
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: fill ? { fill, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text, bold, font: "Arial", size: fontSize, color })]
    })]
  });
}

function callout(text) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        borders: aquaLeftBorders,
        width: { size: 9360, type: WidthType.DXA },
        shading: { fill: LIGHT_GRAY, type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 160, right: 160 },
        children: [new Paragraph({
          children: [new TextRun({ text, font: "Arial", size: 18, color: CHARCOAL, italics: true })]
        })]
      })]
    })]
  });
}

function h1(text) {
  return new Paragraph({
    spacing: { before: 360, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: AQUA, space: 8 } },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 28, color: CHARCOAL })]
  });
}

function h2(text) {
  return new Paragraph({
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 24, color: CHARCOAL })]
  });
}

function body(text) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, font: "Arial", size: 20, color: CHARCOAL })]
  });
}

function bullet(text, ref = "bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 20, color: CHARCOAL })]
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 20 } } }
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets2", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
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
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "HYBRID VACATIONS", bold: true, font: "Arial", size: 16, color: CHARCOAL }),
            new TextRun({ text: "  ·  Brand Design Foundations", font: "Arial", size: 16, color: "666666" })
          ]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: MID_GRAY, space: 4 } },
          spacing: { before: 80 },
          children: [
            new TextRun({ text: "Travel Through What You Love  ·  ", font: "Arial", size: 14, color: "888888" }),
            new TextRun({ text: "Page ", font: "Arial", size: 14, color: "888888" }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 14, color: "888888" })
          ]
        })]
      })
    },
    children: [
      // Title
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: "HYBRID VACATIONS", bold: true, font: "Arial", size: 36, color: CHARCOAL })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: "Brand Design Foundations & Website Visual Direction", bold: true, font: "Arial", size: 26, color: AQUA })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: "Version 1.0  ·  August 2026  ·  Working Master Document", font: "Arial", size: 16, color: "666666" })]
      }),
      callout("Purpose: Establish the comprehensive brand identity, colour palette, typography, graphic library, photography direction, UI components, and website visual architecture. Single source of truth for the website redesign and future digital content."),
      new Paragraph({ spacing: { before: 200, after: 200 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "SPORT × TRAVEL × COMMUNITY × ADVENTURE", bold: true, font: "Arial", size: 18, color: AQUA })] }),

      h1("1. Executive Summary & Core Brand Personality"),
      body("Hybrid Vacations combines active sport, high-quality coaching, travel exploration, and authentic community connections. The visual identity must bridge high-energy grassroots athletic culture and premium, trustworthy travel experiences."),
      new Paragraph({ spacing: { after: 100 }, children: [] }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2400, 3480, 3480],
        rows: [
          new TableRow({ children: [
            cell("Personality", { bold: true, fill: CHARCOAL, color: WHITE, width: 2400, fontSize: 16 }),
            cell("Visual Expression", { bold: true, fill: CHARCOAL, color: WHITE, width: 3480, fontSize: 16 }),
            cell("Strategic Alignment", { bold: true, fill: CHARCOAL, color: WHITE, width: 3480, fontSize: 16 }),
          ]}),
          new TableRow({ children: [
            cell("Competitive Sport", { bold: true, width: 2400, fontSize: 16 }),
            cell("Bold condensed headlines, high-contrast action imagery", { width: 3480, fontSize: 16 }),
            cell("Appeals to improver–performance players", { width: 3480, fontSize: 16 }),
          ]}),
          new TableRow({ children: [
            cell("Beach & Surf Culture", { bold: true, fill: LIGHT_GRAY, width: 2400, fontSize: 16 }),
            cell("Golden lighting, sand textures, hand-brushed accents", { fill: LIGHT_GRAY, width: 3480, fontSize: 16 }),
            cell("Authentic coastal destinations", { fill: LIGHT_GRAY, width: 3480, fontSize: 16 }),
          ]}),
          new TableRow({ children: [
            cell("International Travel", { bold: true, width: 2400, fontSize: 16 }),
            cell("Full-bleed destination photography, clear package tiers", { width: 3480, fontSize: 16 }),
            cell("Builds booking trust", { width: 3480, fontSize: 16 }),
          ]}),
          new TableRow({ children: [
            cell("Grassroots Community", { bold: true, fill: LIGHT_GRAY, width: 2400, fontSize: 16 }),
            cell("Candid social photos, coach spotlights, real camp moments", { fill: LIGHT_GRAY, width: 3480, fontSize: 16 }),
            cell("Warmth, accessibility, solo-friendly", { fill: LIGHT_GRAY, width: 3480, fontSize: 16 }),
          ]}),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      h1("2. Exact Colour System & Palette Rules"),
      body("Deep charcoal backgrounds combined with high-contrast aqua accents and crisp white typography. Sleek framing for vibrant outdoor photography."),
      h2("2.1 Master Brand Palette"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2000, 1400, 1600, 2200, 2160],
        rows: [
          new TableRow({ children: [
            cell("Colour", { bold: true, fill: CHARCOAL, color: WHITE, width: 2000, fontSize: 15 }),
            cell("HEX", { bold: true, fill: CHARCOAL, color: WHITE, width: 1400, fontSize: 15 }),
            cell("RGB", { bold: true, fill: CHARCOAL, color: WHITE, width: 1600, fontSize: 15 }),
            cell("Role", { bold: true, fill: CHARCOAL, color: WHITE, width: 2200, fontSize: 15 }),
            cell("Usage", { bold: true, fill: CHARCOAL, color: WHITE, width: 2160, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("Hybrid Charcoal", { bold: true, width: 2000, fontSize: 15 }),
            cell("#0D0E10", { width: 1400, fontSize: 15 }),
            cell("13, 14, 16", { width: 1600, fontSize: 15 }),
            cell("Primary dark bg", { width: 2200, fontSize: 15 }),
            cell("Heroes, footers, dark cards", { width: 2160, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("Hybrid Aqua", { bold: true, fill: LIGHT_GRAY, width: 2000, fontSize: 15 }),
            cell("#52D6C7", { fill: LIGHT_GRAY, width: 1400, fontSize: 15 }),
            cell("82, 214, 199", { fill: LIGHT_GRAY, width: 1600, fontSize: 15 }),
            cell("Signature accent", { fill: LIGHT_GRAY, width: 2200, fontSize: 15 }),
            cell("CTAs, highlights, nav states", { fill: LIGHT_GRAY, width: 2160, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("Pure White", { bold: true, width: 2000, fontSize: 15 }),
            cell("#FFFFFF", { width: 1400, fontSize: 15 }),
            cell("255, 255, 255", { width: 1600, fontSize: 15 }),
            cell("High-contrast text", { width: 2200, fontSize: 15 }),
            cell("Body & headlines on dark", { width: 2160, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("Deep Slate", { bold: true, fill: LIGHT_GRAY, width: 2000, fontSize: 15 }),
            cell("#1A232A", { fill: LIGHT_GRAY, width: 1400, fontSize: 15 }),
            cell("26, 35, 42", { fill: LIGHT_GRAY, width: 1600, fontSize: 15 }),
            cell("Secondary dark", { fill: LIGHT_GRAY, width: 2200, fontSize: 15 }),
            cell("Cards, forms, alt panels", { fill: LIGHT_GRAY, width: 2160, fontSize: 15 }),
          ]}),
        ]
      }),
      h2("2.2 Sub-Brand Accents"),
      bullet("Beach Volleyball: Hybrid Aqua (#52D6C7) + Sunshine Yellow (#FFD166)"),
      bullet("Tennis: Clay Court Orange (#FF5A36)"),
      bullet("Padel: Electric Mint (#38EF7D)"),
      bullet("Coaching / Performance: Pure White + Hybrid Aqua on Dark Charcoal"),
      h2("2.3 Framing vs Content Principle"),
      callout("Hybrid supplies the frame; photography supplies the colour. UI sticks to charcoal, aqua, slate, and white. Full-spectrum warmth comes through unfiltered imagery."),

      new Paragraph({ children: [new PageBreak()] }),

      h1("3. Typography Hierarchy"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2200, 3200, 3960],
        rows: [
          new TableRow({ children: [
            cell("Level", { bold: true, fill: CHARCOAL, color: WHITE, width: 2200, fontSize: 16 }),
            cell("Recommended Font", { bold: true, fill: CHARCOAL, color: WHITE, width: 3200, fontSize: 16 }),
            cell("Application", { bold: true, fill: CHARCOAL, color: WHITE, width: 3960, fontSize: 16 }),
          ]}),
          new TableRow({ children: [
            cell("Display / Accent", { bold: true, width: 2200, fontSize: 16 }),
            cell("Permanent Marker / Caveat Brush", { width: 3200, fontSize: 16 }),
            cell("Hero accents, coach badges, promo overlays only", { width: 3960, fontSize: 16 }),
          ]}),
          new TableRow({ children: [
            cell("Athletic Headline", { bold: true, fill: LIGHT_GRAY, width: 2200, fontSize: 16 }),
            cell("Bebas Neue / Anton", { fill: LIGHT_GRAY, width: 3200, fontSize: 16 }),
            cell("Section titles, camp titles, card headlines", { fill: LIGHT_GRAY, width: 3960, fontSize: 16 }),
          ]}),
          new TableRow({ children: [
            cell("Body & UI Copy", { bold: true, width: 2200, fontSize: 16 }),
            cell("Inter / Montserrat", { width: 3200, fontSize: 16 }),
            cell("Paragraphs, lists, forms, navigation, footers", { width: 3960, fontSize: 16 }),
          ]}),
        ]
      }),

      h1("4. Logo Rules & Brand Architecture"),
      bullet("Master Badge Logo: Circular dark badge with Aqua/White HYBRID Vacations — social avatars, hero overlays"),
      bullet("Horizontal Header Mark: Brushed HYBRID + sub-brand for slim navigation"),
      bullet("Sub-Brand Marks: Dedicated for Beach Volleyball, Tennis, Padel, Coaching"),
      h2("Clear Space & Contrast"),
      bullet("Minimum clear margin = 50% of badge diameter on all sides"),
      bullet("Always place over dark backgrounds or dark translucent overlays"),
      bullet("Never place aqua/white logo on bright sand without a dark backing panel"),

      new Paragraph({ children: [new PageBreak()] }),

      h1("5. Graphic & Shape Library"),
      bullet("Dark Translucent Panels: rgba(13, 14, 16, 0.85) over action photos for legibility"),
      bullet("Angled / Diagonal Cutlines: 15° slash section dividers — “Coastlines & Courtlines”"),
      bullet("Halftone Textures: Subtle sports-print character behind secondary callouts"),
      bullet("Badge & Sticker Callouts: EARLY BIRD, USE CODE, POPULAR"),

      h1("6. Photography Rules"),
      h2("Priority"),
      bullet("Real action: spiking, diving, serving, competing"),
      bullet("Human connection: high-fives, group celebrations, coach feedback, dinners"),
      bullet("Environment & sun: golden hour, court lines, palms, ocean"),
      h2("Strict Avoidance"),
      bullet("No generic or staged stock photography on the final live site"),
      bullet("No washed-out or flat pastel filters"),
      bullet("No empty, lifeless courts without human activity"),
      callout("Stock placeholders may be used in design mockups only. Prefer Hybrid-owned and Instagram assets for production."),

      new Paragraph({ children: [new PageBreak()] }),

      h1("7. Social Media & Instagram Templates"),
      bullet("Coach Spotlight: Portrait + dark gradient + brushed name + discount code"),
      bullet("Camp Launch: Full-bleed location + translucent container + destination title + Aqua CTA"),
      bullet("Meme / Reel Cover: Action frame + diagonal accent + bold white athletic header"),
      new Paragraph({ spacing: { before: 160, after: 100 }, children: [] }),
      callout("CRITICAL STANDING RULE: Deep Dish must NOT appear in any public Hybrid marketing, website copy, social posts, coach bios, or customer communications. Use national squad achievements, world tour results, and club records only."),

      h1("8. Website Design System & UI Components"),
      h2("Buttons"),
      bullet("Primary CTA: Solid Hybrid Aqua fill, charcoal bold text, all-caps, 4px radius"),
      bullet("Secondary CTA: Dark slate fill, 1px white or aqua border, pure white text"),
      bullet("Filter chips: Dark bg, aqua border when selected"),
      h2("Experience Cards"),
      body("Dark slate backgrounds (#1A232A), 50/50 split: top = action photo + sport badge; bottom = destination, dates, inclusions, From £X, CTA."),
      h2("Navigation"),
      body("Fixed dark charcoal header with backdrop blur. Logo left · Camps / UK Coaching / Coaches / Travel Agency / About centre · Aqua “Book A Camp” right."),

      new Paragraph({ children: [new PageBreak()] }),

      h1("9. Brand Voice & Copywriting"),
      body("Authentic, energetic, cheeky, athletic, community-first. Speaks as a fellow player and coach, not a distant operator."),
      bullet("Hero slogan: “Travel Through What You Love”"),
      bullet("Core positioning: Sport × Travel × Community × Adventure"),
      bullet("Destination tagline: “Train beach volleyball where summer never ends.”"),
      bullet("Differentiator: “Train with the same dedicated coach all week — progressive growth, not rotating sessions.”"),

      h1("10. Complete Website Visual Direction"),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { after: 80 },
        children: [new TextRun({ text: "Hero: Full-bleed action video + vignette + brushed headline + dual CTAs", font: "Arial", size: 20, color: CHARCOAL })]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { after: 80 },
        children: [new TextRun({ text: "Core Pillars: TRAIN · PLAY · COMPETE · TRAVEL", font: "Arial", size: 20, color: CHARCOAL })]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { after: 80 },
        children: [new TextRun({ text: "Live Experience Grid: Bookable (Lanzarote) vs Pre-register (Tennis/Padel)", font: "Arial", size: 20, color: CHARCOAL })]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { after: 80 },
        children: [new TextRun({ text: "UK Coaching Bridge: London/UK clinics pipeline", font: "Arial", size: 20, color: CHARCOAL })]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { after: 80 },
        children: [new TextRun({ text: "Coach Roster: Mark, Martha, Issa, Dave, Marco, Katya, David Silva", font: "Arial", size: 20, color: CHARCOAL })]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { after: 80 },
        children: [new TextRun({ text: "Social Proof & UGC: Real camper photos, sunset stretches, tournaments", font: "Arial", size: 20, color: CHARCOAL })]
      }),

      new Paragraph({ spacing: { before: 400 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Travel Through What You Love.", italics: true, font: "Arial", size: 18, color: AQUA })] }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/home/workdir/artifacts/Hybrid_Brand_Design_Foundations.docx", buf);
  console.log("Created Brand Foundations docx");
});
