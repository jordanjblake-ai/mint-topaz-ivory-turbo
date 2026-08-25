const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, LevelFormat, BorderStyle, WidthType,
        ShadingType, PageNumber, PageBreak, VerticalAlign } = require('docx');
const fs = require('fs');

const MINT = "70CFCB";
const OBSIDIAN = "12272F";
const MUTED = "6B7C85";
const PURPOSE_BG = "E8F7F6";
const ALT_ROW = "F4FBFA";
const WHITE = "FFFFFF";
const LIGHT_LINE = "D0E8E6";

const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_LINE };
const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const borders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const purposeBorders = {
  top: { style: BorderStyle.SINGLE, size: 4, color: MINT },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: MINT },
  left: { style: BorderStyle.SINGLE, size: 24, color: MINT },
  right: { style: BorderStyle.SINGLE, size: 4, color: MINT },
};

function purposeBox(title, body) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        borders: purposeBorders,
        width: { size: 9360, type: WidthType.DXA },
        shading: { fill: PURPOSE_BG, type: ShadingType.CLEAR },
        margins: { top: 140, bottom: 140, left: 180, right: 180 },
        children: [
          new Paragraph({
            spacing: { after: 60 },
            children: [new TextRun({ text: title, bold: true, font: "Arial", size: 18, color: OBSIDIAN })]
          }),
          new Paragraph({
            children: [new TextRun({ text: body, font: "Arial", size: 18, color: OBSIDIAN })]
          }),
        ]
      })]
    })]
  });
}

function callout(text) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        borders: {
          top: noBorder, bottom: noBorder, right: noBorder,
          left: { style: BorderStyle.SINGLE, size: 18, color: MINT },
        },
        width: { size: 9360, type: WidthType.DXA },
        shading: { fill: PURPOSE_BG, type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 160, right: 140 },
        children: [new Paragraph({
          children: [new TextRun({ text, font: "Arial", size: 18, color: OBSIDIAN })]
        })]
      })]
    })]
  });
}

function cell(text, opts = {}) {
  const { bold = false, fill = null, width = 2340, color = OBSIDIAN, fontSize = 16 } = opts;
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: fill ? { fill, type: ShadingType.CLEAR } : undefined,
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      children: [new TextRun({ text, bold, font: "Arial", size: fontSize, color })]
    })]
  });
}

function h1(text) {
  return new Paragraph({
    heading: "Heading1",
    spacing: { before: 360, after: 160 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 28, color: OBSIDIAN })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: "Heading2",
    spacing: { before: 240, after: 100 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 22, color: OBSIDIAN })]
  });
}

function body(text) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, font: "Arial", size: 20, color: OBSIDIAN })]
  });
}

function bullet(text, ref = "bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 20, color: OBSIDIAN })]
  });
}

function spacer() {
  return new Paragraph({ spacing: { after: 80 }, children: [] });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 20, color: OBSIDIAN } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: OBSIDIAN },
        paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Arial", color: OBSIDIAN },
        paragraph: { spacing: { before: 240, after: 100 }, outlineLevel: 1 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets2", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets3", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets4", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets5", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets6", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets7", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets8", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: MINT, space: 6 } },
          spacing: { after: 60 },
          children: [
            new TextRun({ text: "HYBRID VACATIONS", bold: true, font: "Arial", size: 16, color: OBSIDIAN }),
            new TextRun({ text: "  ·  Brand Design Foundations", font: "Arial", size: 16, color: MUTED })
          ]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: LIGHT_LINE, space: 6 } },
          spacing: { before: 60 },
          children: [
            new TextRun({ text: "Travel Through What You Love  ·  Page ", font: "Arial", size: 14, color: MUTED }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 14, color: MUTED })
          ]
        })]
      })
    },
    children: [
      // Title
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: "HYBRID VACATIONS", bold: true, font: "Arial", size: 36, color: OBSIDIAN })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: "Brand Design Foundations & Website Visual Direction", bold: true, font: "Arial", size: 24, color: OBSIDIAN })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: "Version 1.1  ·  August 2026", font: "Arial", size: 18, color: MUTED })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: "Working Master Document", font: "Arial", size: 18, color: MUTED })]
      }),

      purposeBox(
        "Purpose",
        "Set out the brand identity, colour palette, typography, graphics, photography direction, UI components, and website visual architecture for Hybrid Vacations. This is the reference for the website redesign and digital content across channels."
      ),
      spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 240 },
        children: [new TextRun({ text: "SPORT  ×  TRAVEL  ×  COMMUNITY  ×  ADVENTURE", bold: true, font: "Arial", size: 18, color: MINT })]
      }),

      h1("1. Executive Summary & Core Brand Personality"),
      body("Hybrid Vacations combines active sport, high quality coaching, travel, and real community. The visual identity needs to sit between grassroots athletic energy and a premium, trustworthy travel brand."),
      spacer(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2400, 3480, 3480],
        rows: [
          new TableRow({ children: [
            cell("Personality", { bold: true, fill: OBSIDIAN, color: WHITE, width: 2400, fontSize: 15 }),
            cell("Visual expression", { bold: true, fill: OBSIDIAN, color: WHITE, width: 3480, fontSize: 15 }),
            cell("Strategic alignment", { bold: true, fill: OBSIDIAN, color: WHITE, width: 3480, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("Competitive sport", { bold: true, width: 2400, fontSize: 15 }),
            cell("Bold condensed headlines, high contrast action imagery", { width: 3480, fontSize: 15 }),
            cell("Appeals to improvers and performance players", { width: 3480, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("Beach and surf culture", { bold: true, fill: ALT_ROW, width: 2400, fontSize: 15 }),
            cell("Golden light, sand texture, hand brushed accents", { fill: ALT_ROW, width: 3480, fontSize: 15 }),
            cell("Authentic coastal destinations", { fill: ALT_ROW, width: 3480, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("International travel", { bold: true, width: 2400, fontSize: 15 }),
            cell("Full bleed destination photography, clear package tiers", { width: 3480, fontSize: 15 }),
            cell("Builds booking trust", { width: 3480, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("Grassroots community", { bold: true, fill: ALT_ROW, width: 2400, fontSize: 15 }),
            cell("Candid social photos, coach spotlights, real camp moments", { fill: ALT_ROW, width: 3480, fontSize: 15 }),
            cell("Warmth, accessibility, solo friendly", { fill: ALT_ROW, width: 3480, fontSize: 15 }),
          ]}),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      h1("2. Colour System & Palette Rules"),
      body("Website and digital product use deep charcoal backgrounds, aqua accents, and white type. That frame sits behind full colour outdoor photography."),
      h2("2.1 Master brand palette (website)"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2000, 1400, 1600, 2200, 2160],
        rows: [
          new TableRow({ children: [
            cell("Colour", { bold: true, fill: OBSIDIAN, color: WHITE, width: 2000, fontSize: 14 }),
            cell("HEX", { bold: true, fill: OBSIDIAN, color: WHITE, width: 1400, fontSize: 14 }),
            cell("RGB", { bold: true, fill: OBSIDIAN, color: WHITE, width: 1600, fontSize: 14 }),
            cell("Role", { bold: true, fill: OBSIDIAN, color: WHITE, width: 2200, fontSize: 14 }),
            cell("Usage", { bold: true, fill: OBSIDIAN, color: WHITE, width: 2160, fontSize: 14 }),
          ]}),
          new TableRow({ children: [
            cell("Hybrid Charcoal", { bold: true, width: 2000, fontSize: 14 }),
            cell("#0D0E10", { width: 1400, fontSize: 14 }),
            cell("13, 14, 16", { width: 1600, fontSize: 14 }),
            cell("Primary dark bg", { width: 2200, fontSize: 14 }),
            cell("Heroes, footers, dark cards", { width: 2160, fontSize: 14 }),
          ]}),
          new TableRow({ children: [
            cell("Hybrid Aqua", { bold: true, fill: ALT_ROW, width: 2000, fontSize: 14 }),
            cell("#52D6C7", { fill: ALT_ROW, width: 1400, fontSize: 14 }),
            cell("82, 214, 199", { fill: ALT_ROW, width: 1600, fontSize: 14 }),
            cell("Signature accent", { fill: ALT_ROW, width: 2200, fontSize: 14 }),
            cell("CTAs, highlights, nav states", { fill: ALT_ROW, width: 2160, fontSize: 14 }),
          ]}),
          new TableRow({ children: [
            cell("Pure White", { bold: true, width: 2000, fontSize: 14 }),
            cell("#FFFFFF", { width: 1400, fontSize: 14 }),
            cell("255, 255, 255", { width: 1600, fontSize: 14 }),
            cell("High contrast text", { width: 2200, fontSize: 14 }),
            cell("Body and headlines on dark", { width: 2160, fontSize: 14 }),
          ]}),
          new TableRow({ children: [
            cell("Deep Slate", { bold: true, fill: ALT_ROW, width: 2000, fontSize: 14 }),
            cell("#1A232A", { fill: ALT_ROW, width: 1400, fontSize: 14 }),
            cell("26, 35, 42", { fill: ALT_ROW, width: 1600, fontSize: 14 }),
            cell("Secondary dark", { fill: ALT_ROW, width: 2200, fontSize: 14 }),
            cell("Cards, forms, alt panels", { fill: ALT_ROW, width: 2160, fontSize: 14 }),
          ]}),
        ]
      }),
      h2("2.2 Sub brand accents"),
      bullet("Beach volleyball: Hybrid Aqua (#52D6C7) plus Sunshine Yellow (#FFD166)"),
      bullet("Tennis: Clay Court Orange (#FF5A36)"),
      bullet("Padel: Electric Mint (#38EF7D)"),
      bullet("Coaching and performance: white and aqua on dark charcoal"),
      h2("2.3 Colour states (for build)"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2400, 2400, 4560],
        rows: [
          new TableRow({ children: [
            cell("State", { bold: true, fill: OBSIDIAN, color: WHITE, width: 2400, fontSize: 15 }),
            cell("Suggested value", { bold: true, fill: OBSIDIAN, color: WHITE, width: 2400, fontSize: 15 }),
            cell("Use", { bold: true, fill: OBSIDIAN, color: WHITE, width: 4560, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("CTA default", { bold: true, width: 2400, fontSize: 15 }),
            cell("#52D6C7", { width: 2400, fontSize: 15 }),
            cell("Primary buttons", { width: 4560, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("CTA hover", { bold: true, fill: ALT_ROW, width: 2400, fontSize: 15 }),
            cell("#3FC4B4 (slightly deeper)", { fill: ALT_ROW, width: 2400, fontSize: 15 }),
            cell("Hover and focus on primary buttons", { fill: ALT_ROW, width: 4560, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("CTA disabled", { bold: true, width: 2400, fontSize: 15 }),
            cell("#52D6C7 at 40% opacity", { width: 2400, fontSize: 15 }),
            cell("Inactive or loading buttons", { width: 4560, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("Success", { bold: true, fill: ALT_ROW, width: 2400, fontSize: 15 }),
            cell("#38EF7D or soft green", { fill: ALT_ROW, width: 2400, fontSize: 15 }),
            cell("Form success, booking confirmed", { fill: ALT_ROW, width: 4560, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("Error", { bold: true, width: 2400, fontSize: 15 }),
            cell("#E85D4C or soft red", { width: 2400, fontSize: 15 }),
            cell("Form errors, validation", { width: 4560, fontSize: 15 }),
          ]}),
        ]
      }),
      spacer(),
      callout("Contrast: white text on charcoal and dark text on aqua should meet WCAG AA for body and large text. Test primary CTAs and form labels before launch."),
      h2("2.4 Framing vs content"),
      callout("Hybrid supplies the frame. Photography supplies the colour. UI stays on charcoal, aqua, slate, and white. Warmth comes through unfiltered images."),

      new Paragraph({ children: [new PageBreak()] }),

      h1("3. Typography Hierarchy"),
      body("Three roles only. Brush accents are rare. Condensed headlines carry energy. Clean geometric type carries everything else."),
      h2("3.1 Families and roles"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2200, 3200, 3960],
        rows: [
          new TableRow({ children: [
            cell("Level", { bold: true, fill: OBSIDIAN, color: WHITE, width: 2200, fontSize: 15 }),
            cell("Recommended font", { bold: true, fill: OBSIDIAN, color: WHITE, width: 3200, fontSize: 15 }),
            cell("Application", { bold: true, fill: OBSIDIAN, color: WHITE, width: 3960, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("Display / accent", { bold: true, width: 2200, fontSize: 15 }),
            cell("Permanent Marker / Caveat", { width: 3200, fontSize: 15 }),
            cell("Hero accents, coach badges, promo overlays only", { width: 3960, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("Athletic headline", { bold: true, fill: ALT_ROW, width: 2200, fontSize: 15 }),
            cell("Bebas Neue / Anton", { fill: ALT_ROW, width: 3200, fontSize: 15 }),
            cell("Section titles, camp titles, card headlines", { fill: ALT_ROW, width: 3960, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("Body and UI", { bold: true, width: 2200, fontSize: 15 }),
            cell("Inter / Montserrat", { width: 3200, fontSize: 15 }),
            cell("Paragraphs, lists, forms, navigation, footers", { width: 3960, fontSize: 15 }),
          ]}),
        ]
      }),
      h2("3.2 Type scale (implementation)"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1800, 1800, 1400, 1400, 1400, 1560],
        rows: [
          new TableRow({ children: [
            cell("Role", { bold: true, fill: OBSIDIAN, color: WHITE, width: 1800, fontSize: 13 }),
            cell("Font", { bold: true, fill: OBSIDIAN, color: WHITE, width: 1800, fontSize: 13 }),
            cell("Weight", { bold: true, fill: OBSIDIAN, color: WHITE, width: 1400, fontSize: 13 }),
            cell("Desktop", { bold: true, fill: OBSIDIAN, color: WHITE, width: 1400, fontSize: 13 }),
            cell("Mobile", { bold: true, fill: OBSIDIAN, color: WHITE, width: 1400, fontSize: 13 }),
            cell("Line height", { bold: true, fill: OBSIDIAN, color: WHITE, width: 1560, fontSize: 13 }),
          ]}),
          new TableRow({ children: [
            cell("Display accent", { bold: true, width: 1800, fontSize: 13 }),
            cell("Caveat / Marker", { width: 1800, fontSize: 13 }),
            cell("Regular", { width: 1400, fontSize: 13 }),
            cell("28–36px", { width: 1400, fontSize: 13 }),
            cell("22–28px", { width: 1400, fontSize: 13 }),
            cell("1.1", { width: 1560, fontSize: 13 }),
          ]}),
          new TableRow({ children: [
            cell("H1 athletic", { bold: true, fill: ALT_ROW, width: 1800, fontSize: 13 }),
            cell("Bebas Neue", { fill: ALT_ROW, width: 1800, fontSize: 13 }),
            cell("Regular", { fill: ALT_ROW, width: 1400, fontSize: 13 }),
            cell("48–64px", { fill: ALT_ROW, width: 1400, fontSize: 13 }),
            cell("32–40px", { fill: ALT_ROW, width: 1400, fontSize: 13 }),
            cell("1.0", { fill: ALT_ROW, width: 1560, fontSize: 13 }),
          ]}),
          new TableRow({ children: [
            cell("H2", { bold: true, width: 1800, fontSize: 13 }),
            cell("Bebas or Inter", { width: 1800, fontSize: 13 }),
            cell("Bold 700", { width: 1400, fontSize: 13 }),
            cell("28–32px", { width: 1400, fontSize: 13 }),
            cell("22–24px", { width: 1400, fontSize: 13 }),
            cell("1.15", { width: 1560, fontSize: 13 }),
          ]}),
          new TableRow({ children: [
            cell("Body", { bold: true, fill: ALT_ROW, width: 1800, fontSize: 13 }),
            cell("Inter", { fill: ALT_ROW, width: 1800, fontSize: 13 }),
            cell("Regular 400", { fill: ALT_ROW, width: 1400, fontSize: 13 }),
            cell("16–18px", { fill: ALT_ROW, width: 1400, fontSize: 13 }),
            cell("15–16px", { fill: ALT_ROW, width: 1400, fontSize: 13 }),
            cell("1.5–1.6", { fill: ALT_ROW, width: 1560, fontSize: 13 }),
          ]}),
          new TableRow({ children: [
            cell("Small / UI", { bold: true, width: 1800, fontSize: 13 }),
            cell("Inter", { width: 1800, fontSize: 13 }),
            cell("Medium 500", { width: 1400, fontSize: 13 }),
            cell("12–14px", { width: 1400, fontSize: 13 }),
            cell("12–13px", { width: 1400, fontSize: 13 }),
            cell("1.4", { width: 1560, fontSize: 13 }),
          ]}),
        ]
      }),
      h2("3.3 Loading and fallbacks"),
      bullet("Load Inter, Bebas Neue, and Caveat from Google Fonts (or self host if preferred)."),
      bullet("Fallback stack example: Inter, system-ui, -apple-system, sans-serif"),
      bullet("Brush fonts never appear in body copy, long headings, or form fields."),
      bullet("Keep letter spacing tight on athletic headlines. Avoid all caps on long body lines."),

      new Paragraph({ children: [new PageBreak()] }),

      h1("4. Logo Rules & Brand Architecture"),
      bullet("Master badge: circular dark badge with aqua and white HYBRID Vacations text. Use for social avatars and hero overlays."),
      bullet("Horizontal header mark: brushed HYBRID with sub brand for slim navigation."),
      bullet("Sub brand marks for Beach Volleyball, Tennis, Padel, and Coaching."),
      h2("4.1 Clear space and contrast"),
      bullet("Keep a clear margin of at least half the badge diameter on all sides."),
      bullet("Place the mark on dark backgrounds or dark translucent overlays."),
      bullet("Do not place the aqua or white logo on bright sand without a dark backing panel."),
      h2("4.2 Logo asset checklist"),
      bullet("SVG master badge (preferred for web)"),
      bullet("PNG master badge at 512px and 1024px (transparent)"),
      bullet("Horizontal lockup SVG and PNG"),
      bullet("Social avatar crop (square) matching Instagram profile"),
      bullet("Favicon 32px and 180px apple touch"),
      bullet("Confirm light on dark and dark on light versions if any light sections are used"),
      callout("Until final logo files are locked, use the existing Hybrid badge from the site and Drive assets folder. Do not redraw from memory."),

      new Paragraph({ children: [new PageBreak()] }),

      h1("5. Spacing, Layout & Motion"),
      h2("5.1 Spacing tokens"),
      bullet("Base unit: 8px"),
      bullet("Common steps: 8, 16, 24, 32, 48, 64"),
      bullet("Section padding desktop: 64–96px vertical"),
      bullet("Section padding mobile: 40–56px vertical"),
      bullet("Card internal padding: 16–24px"),
      bullet("Max content width: around 1120–1200px for main columns"),
      h2("5.2 Radius and elevation"),
      bullet("Buttons and small chips: 4px radius"),
      bullet("Cards: 8px radius"),
      bullet("Shadows: soft and low. Prefer a light lift on cards, not heavy drop shadows."),
      h2("5.3 Motion"),
      bullet("Hero: prefer a short muted video loop with a still image fallback."),
      bullet("Button hover: colour shift and slight opacity change. No bounce."),
      bullet("Page transitions: keep calm and fast. Avoid playful or decorative animation."),
      bullet("Respect reduced motion preferences in the browser."),

      h1("6. Graphic & Shape Library"),
      bullet("Dark translucent panels: rgba(13, 14, 16, 0.85) over action photos for readable text."),
      bullet("Angled cutlines: 15 degree slash section dividers, linked to Coastlines and Courtlines."),
      bullet("Halftone textures behind secondary callouts for a sports print feel."),
      bullet("Badge and sticker callouts for EARLY BIRD, USE CODE, POPULAR."),

      new Paragraph({ children: [new PageBreak()] }),

      h1("7. Photography Rules"),
      h2("Priority"),
      bullet("Real action: spiking, diving, serving, competing."),
      bullet("Human connection: high fives, group celebrations, coach feedback, dinners."),
      bullet("Environment and sun: golden hour, court lines, palms, ocean."),
      h2("Avoid"),
      bullet("Generic staged stock on the live site."),
      bullet("Washed out or flat pastel filters."),
      bullet("Empty courts with no people."),
      callout("Stock images are fine for early design mockups only. Prefer Hybrid owned and Instagram assets for production."),

      h1("8. Social Media & Instagram Templates"),
      bullet("Coach spotlight: portrait, dark gradient, brushed name, discount code where relevant."),
      bullet("Camp launch: full bleed location, translucent container, destination title, aqua CTA."),
      bullet("Reel cover: action frame, diagonal accent, bold white athletic header."),
      spacer(),
      callout("Standing rule: Deep Dish must not appear in any public Hybrid marketing, website copy, social posts, coach bios, or customer communications. Use national squad results, world tour results, and club records only."),

      new Paragraph({ children: [new PageBreak()] }),

      h1("9. Website Design System & UI"),
      h2("Buttons"),
      bullet("Primary CTA: solid Hybrid Aqua fill, charcoal bold text, all caps, 4px radius."),
      bullet("Secondary CTA: dark slate fill, 1px white or aqua border, pure white text."),
      bullet("Filter chips: dark background, aqua border when selected."),
      h2("Experience cards"),
      body("Dark slate backgrounds (#1A232A). Top half: action photo and sport badge. Bottom half: destination, dates, inclusions, From price, CTA."),
      h2("Navigation"),
      body("Fixed dark charcoal header with backdrop blur. Logo left. Links centre: Camps, UK Coaching, Coaches, Travel Agency, About. Aqua Book A Camp on the right."),

      h1("10. Brand Voice & Copy"),
      body("Authentic, energetic, direct, athletic, community first. Speaks like a player and coach, not a corporate brochure."),
      bullet("Hero slogan: Travel Through What You Love", "bullets5"),
      bullet("Core positioning: Sport × Travel × Community × Adventure", "bullets5"),
      bullet("Destination line: Train beach volleyball where summer never ends.", "bullets5"),
      bullet("Differentiator: Train with the same dedicated coach all week. Progressive growth, not rotating sessions.", "bullets5"),

      h1("11. Website Visual Direction"),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { after: 80 },
        children: [new TextRun({ text: "Hero: full bleed action video, vignette, brushed headline, dual CTAs", font: "Arial", size: 20, color: OBSIDIAN })]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { after: 80 },
        children: [new TextRun({ text: "Core pillars: TRAIN, PLAY, COMPETE, TRAVEL", font: "Arial", size: 20, color: OBSIDIAN })]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { after: 80 },
        children: [new TextRun({ text: "Experience grid: bookable Lanzarote vs pre register Tennis and Padel", font: "Arial", size: 20, color: OBSIDIAN })]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { after: 80 },
        children: [new TextRun({ text: "UK coaching bridge: London and UK clinics", font: "Arial", size: 20, color: OBSIDIAN })]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { after: 80 },
        children: [new TextRun({ text: "Coach roster: Mark, Martha, Issa, Dave, Marco, Katya, David Silva", font: "Arial", size: 20, color: OBSIDIAN })]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { after: 80 },
        children: [new TextRun({ text: "Social proof: real camper photos, sunset stretches, tournaments", font: "Arial", size: 20, color: OBSIDIAN })]
      }),

      new Paragraph({
        spacing: { before: 400 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Travel Through What You Love.", italics: true, font: "Arial", size: 18, color: MINT })]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/home/workdir/artifacts/Hybrid_Brand_Foundations_v1_1.docx", buf);
  console.log("Created Brand Foundations v1.1");
});
