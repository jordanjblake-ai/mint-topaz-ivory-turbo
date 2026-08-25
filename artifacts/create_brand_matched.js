const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, LevelFormat, BorderStyle, WidthType,
        ShadingType, PageNumber, PageBreak, VerticalAlign } = require('docx');
const fs = require('fs');

// Match Master Profile / folder document design system
const MINT = "70CFCB";
const OBSIDIAN = "12272F";
const MUTED = "6B7C85";
const PURPOSE_BG = "E8F7F6";
const ALT_ROW = "F4FBFA";
const WHITE = "FFFFFF";
const LIGHT_LINE = "D0E8E6";

const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_LINE };
const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const mintBorder = { style: BorderStyle.SINGLE, size: 18, color: MINT };
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
  const { bold = false, fill = null, width = 2340, color = OBSIDIAN, fontSize = 17 } = opts;
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
      // Title block matching Master Profile
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
        children: [new TextRun({ text: "Version 1.0  ·  August 2026", font: "Arial", size: 18, color: MUTED })]
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
            cell("Personality", { bold: true, fill: OBSIDIAN, color: WHITE, width: 2400, fontSize: 16 }),
            cell("Visual expression", { bold: true, fill: OBSIDIAN, color: WHITE, width: 3480, fontSize: 16 }),
            cell("Strategic alignment", { bold: true, fill: OBSIDIAN, color: WHITE, width: 3480, fontSize: 16 }),
          ]}),
          new TableRow({ children: [
            cell("Competitive sport", { bold: true, width: 2400, fontSize: 16 }),
            cell("Bold condensed headlines, high contrast action imagery", { width: 3480, fontSize: 16 }),
            cell("Appeals to improvers and performance players", { width: 3480, fontSize: 16 }),
          ]}),
          new TableRow({ children: [
            cell("Beach and surf culture", { bold: true, fill: ALT_ROW, width: 2400, fontSize: 16 }),
            cell("Golden light, sand texture, hand brushed accents", { fill: ALT_ROW, width: 3480, fontSize: 16 }),
            cell("Authentic coastal destinations", { fill: ALT_ROW, width: 3480, fontSize: 16 }),
          ]}),
          new TableRow({ children: [
            cell("International travel", { bold: true, width: 2400, fontSize: 16 }),
            cell("Full bleed destination photography, clear package tiers", { width: 3480, fontSize: 16 }),
            cell("Builds booking trust", { width: 3480, fontSize: 16 }),
          ]}),
          new TableRow({ children: [
            cell("Grassroots community", { bold: true, fill: ALT_ROW, width: 2400, fontSize: 16 }),
            cell("Candid social photos, coach spotlights, real camp moments", { fill: ALT_ROW, width: 3480, fontSize: 16 }),
            cell("Warmth, accessibility, solo friendly", { fill: ALT_ROW, width: 3480, fontSize: 16 }),
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
            cell("Colour", { bold: true, fill: OBSIDIAN, color: WHITE, width: 2000, fontSize: 15 }),
            cell("HEX", { bold: true, fill: OBSIDIAN, color: WHITE, width: 1400, fontSize: 15 }),
            cell("RGB", { bold: true, fill: OBSIDIAN, color: WHITE, width: 1600, fontSize: 15 }),
            cell("Role", { bold: true, fill: OBSIDIAN, color: WHITE, width: 2200, fontSize: 15 }),
            cell("Usage", { bold: true, fill: OBSIDIAN, color: WHITE, width: 2160, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("Hybrid Charcoal", { bold: true, width: 2000, fontSize: 15 }),
            cell("#0D0E10", { width: 1400, fontSize: 15 }),
            cell("13, 14, 16", { width: 1600, fontSize: 15 }),
            cell("Primary dark bg", { width: 2200, fontSize: 15 }),
            cell("Heroes, footers, dark cards", { width: 2160, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("Hybrid Aqua", { bold: true, fill: ALT_ROW, width: 2000, fontSize: 15 }),
            cell("#52D6C7", { fill: ALT_ROW, width: 1400, fontSize: 15 }),
            cell("82, 214, 199", { fill: ALT_ROW, width: 1600, fontSize: 15 }),
            cell("Signature accent", { fill: ALT_ROW, width: 2200, fontSize: 15 }),
            cell("CTAs, highlights, nav states", { fill: ALT_ROW, width: 2160, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("Pure White", { bold: true, width: 2000, fontSize: 15 }),
            cell("#FFFFFF", { width: 1400, fontSize: 15 }),
            cell("255, 255, 255", { width: 1600, fontSize: 15 }),
            cell("High contrast text", { width: 2200, fontSize: 15 }),
            cell("Body and headlines on dark", { width: 2160, fontSize: 15 }),
          ]}),
          new TableRow({ children: [
            cell("Deep Slate", { bold: true, fill: ALT_ROW, width: 2000, fontSize: 15 }),
            cell("#1A232A", { fill: ALT_ROW, width: 1400, fontSize: 15 }),
            cell("26, 35, 42", { fill: ALT_ROW, width: 1600, fontSize: 15 }),
            cell("Secondary dark", { fill: ALT_ROW, width: 2200, fontSize: 15 }),
            cell("Cards, forms, alt panels", { fill: ALT_ROW, width: 2160, fontSize: 15 }),
          ]}),
        ]
      }),
      h2("2.2 Sub brand accents"),
      bullet("Beach volleyball: Hybrid Aqua (#52D6C7) plus Sunshine Yellow (#FFD166)"),
      bullet("Tennis: Clay Court Orange (#FF5A36)"),
      bullet("Padel: Electric Mint (#38EF7D)"),
      bullet("Coaching and performance: white and aqua on dark charcoal"),
      h2("2.3 Framing vs content"),
      callout("Hybrid supplies the frame. Photography supplies the colour. UI stays on charcoal, aqua, slate, and white. Warmth comes through unfiltered images."),

      new Paragraph({ children: [new PageBreak()] }),

      h1("3. Typography Hierarchy"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2200, 3200, 3960],
        rows: [
          new TableRow({ children: [
            cell("Level", { bold: true, fill: OBSIDIAN, color: WHITE, width: 2200, fontSize: 16 }),
            cell("Recommended font", { bold: true, fill: OBSIDIAN, color: WHITE, width: 3200, fontSize: 16 }),
            cell("Application", { bold: true, fill: OBSIDIAN, color: WHITE, width: 3960, fontSize: 16 }),
          ]}),
          new TableRow({ children: [
            cell("Display / accent", { bold: true, width: 2200, fontSize: 16 }),
            cell("Permanent Marker / Caveat Brush", { width: 3200, fontSize: 16 }),
            cell("Hero accents, coach badges, promo overlays only", { width: 3960, fontSize: 16 }),
          ]}),
          new TableRow({ children: [
            cell("Athletic headline", { bold: true, fill: ALT_ROW, width: 2200, fontSize: 16 }),
            cell("Bebas Neue / Anton", { fill: ALT_ROW, width: 3200, fontSize: 16 }),
            cell("Section titles, camp titles, card headlines", { fill: ALT_ROW, width: 3960, fontSize: 16 }),
          ]}),
          new TableRow({ children: [
            cell("Body and UI", { bold: true, width: 2200, fontSize: 16 }),
            cell("Inter / Montserrat", { width: 3200, fontSize: 16 }),
            cell("Paragraphs, lists, forms, navigation, footers", { width: 3960, fontSize: 16 }),
          ]}),
        ]
      }),

      h1("4. Logo Rules & Brand Architecture"),
      bullet("Master badge: circular dark badge with aqua and white HYBRID Vacations text. Use for social avatars and hero overlays."),
      bullet("Horizontal header mark: brushed HYBRID with sub brand for slim navigation."),
      bullet("Sub brand marks for Beach Volleyball, Tennis, Padel, and Coaching."),
      h2("Clear space and contrast"),
      bullet("Keep a clear margin of at least half the badge diameter on all sides."),
      bullet("Place the mark on dark backgrounds or dark translucent overlays."),
      bullet("Do not place the aqua or white logo on bright sand without a dark backing panel."),

      new Paragraph({ children: [new PageBreak()] }),

      h1("5. Graphic & Shape Library"),
      bullet("Dark translucent panels: rgba(13, 14, 16, 0.85) over action photos for readable text."),
      bullet("Angled cutlines: 15 degree slash section dividers, linked to Coastlines and Courtlines."),
      bullet("Halftone textures behind secondary callouts for a sports print feel."),
      bullet("Badge and sticker callouts for EARLY BIRD, USE CODE, POPULAR."),

      h1("6. Photography Rules"),
      h2("Priority"),
      bullet("Real action: spiking, diving, serving, competing."),
      bullet("Human connection: high fives, group celebrations, coach feedback, dinners."),
      bullet("Environment and sun: golden hour, court lines, palms, ocean."),
      h2("Avoid"),
      bullet("Generic staged stock on the live site."),
      bullet("Washed out or flat pastel filters."),
      bullet("Empty courts with no people."),
      callout("Stock images are fine for early design mockups only. Prefer Hybrid owned and Instagram assets for production."),

      new Paragraph({ children: [new PageBreak()] }),

      h1("7. Social Media & Instagram Templates"),
      bullet("Coach spotlight: portrait, dark gradient, brushed name, discount code where relevant."),
      bullet("Camp launch: full bleed location, translucent container, destination title, aqua CTA."),
      bullet("Reel cover: action frame, diagonal accent, bold white athletic header."),
      spacer(),
      callout("Standing rule: Deep Dish must not appear in any public Hybrid marketing, website copy, social posts, coach bios, or customer communications. Use national squad results, world tour results, and club records only."),

      h1("8. Website Design System & UI"),
      h2("Buttons"),
      bullet("Primary CTA: solid Hybrid Aqua fill, charcoal bold text, all caps, 4px radius."),
      bullet("Secondary CTA: dark slate fill, 1px white or aqua border, pure white text."),
      bullet("Filter chips: dark background, aqua border when selected."),
      h2("Experience cards"),
      body("Dark slate backgrounds (#1A232A). Top half: action photo and sport badge. Bottom half: destination, dates, inclusions, From price, CTA."),
      h2("Navigation"),
      body("Fixed dark charcoal header with backdrop blur. Logo left. Links centre: Camps, UK Coaching, Coaches, Travel Agency, About. Aqua Book A Camp on the right."),

      new Paragraph({ children: [new PageBreak()] }),

      h1("9. Brand Voice & Copy"),
      body("Authentic, energetic, direct, athletic, community first. Speaks like a player and coach, not a corporate brochure."),
      bullet("Hero slogan: Travel Through What You Love"),
      bullet("Core positioning: Sport × Travel × Community × Adventure"),
      bullet("Destination line: Train beach volleyball where summer never ends."),
      bullet("Differentiator: Train with the same dedicated coach all week. Progressive growth, not rotating sessions."),

      h1("10. Website Visual Direction"),
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
  fs.writeFileSync("/home/workdir/artifacts/Hybrid_Brand_Design_Foundations_Matched.docx", buf);
  console.log("Created matched Brand Foundations");
});
