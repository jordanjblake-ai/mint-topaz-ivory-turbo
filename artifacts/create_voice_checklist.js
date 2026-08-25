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
                children: [new TextRun({ text: "NON-NEGOTIABLE", bold: true, size: 18, font: "Arial", color: AMBER })]
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
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "check", levels: [{ level: 0, format: LevelFormat.BULLET, text: "☐", alignment: AlignmentType.LEFT,
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
              new TextRun({ text: "  ·  Voice, Rules & Website Checklist", size: 15, font: "Arial", color: MED_GREY })
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
              new TextRun({ text: "Working brief  ·  20 August 2026  ·  Page ", size: 15, font: "Arial", color: MED_GREY }),
              new TextRun({ children: [PageNumber.CURRENT], size: 15, font: "Arial", color: MED_GREY })
            ]
          })
        ]
      })
    },
    children: [
      spacer(350),
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
        children: [new TextRun({ text: "Voice & Rules Brief", size: 28, font: "Arial", color: BLACK })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 },
        children: [new TextRun({ text: "+ Website Content Checklist", size: 18, font: "Arial", color: MED_GREY })]
      }),
      callout("How to use", [
        "Part 1 is the voice and rules brief for humans and any future AI tools.",
        "Part 2 is a practical website content checklist for the next update.",
        "Match the Instagram style: energetic, community-first, clear, never corporate-stiff."
      ]),
      spacer(120),
      new Paragraph({ children: [new PageBreak()] }),

      // ========== VOICE ==========
      h1("Part 1 — Hybrid Voice & Rules"),
      h2("Who we are in one line"),
      body("Hybrid is where serious sport meets real travel and real community. We build experiences that feel like a holiday and train like they mean it."),
      h2("Core narrative"),
      bullet("Travel Through What You Love."),
      bullet("Sport × Travel × Community."),
      bullet("Train hard. Explore the place. Connect with good people."),
      h2("Tone (match Instagram)"),
      bullet("Warm, energetic, slightly playful — never corporate or salesy"),
      bullet("Direct and clear on details (dates, what’s included, who’s coaching)"),
      bullet("Community language: “you”, “we”, “the group”, “solo players welcome”"),
      bullet("Confident about coaching quality without bragging"),
      bullet("Short sentences and scannable structure work best"),
      h2("Words we like"),
      bullet("Train · Play · Explore · Connect · Camp · Community · Levels · Session · Sand / Court"),
      bullet("Same coach all week · Progressive · Solo-friendly · Island · Coastline"),
      h2("Words / styles we avoid"),
      bullet("Corporate jargon, empty superlatives (“world-class luxury experience”), hard-sell urgency"),
      bullet("Anything that feels like a brochure from a big tour operator"),
      ruleBox([
        "Never mention Deep Dish (or related branding) in any Hybrid public content, website copy, social posts, coach bios, or sales materials.",
        "Historical context belongs in internal research only. Public Hybrid messaging stays clean of it."
      ]),
      h2("Product facts rule"),
      body("Only publish confirmed prices, dates and inclusions. Tennis and Padel can stay on “Pre-register” until exact pricing is locked. Do not invent or estimate prices in public."),
      h2("Coach & social rules"),
      bullet("Use approved short bios and confirmed Instagram handles only"),
      bullet("Tag coaches with permission; prefer @hybridvacations + coach handles"),
      bullet("Referral codes (e.g. Dave15, Martha15, Katya15) only when the system is documented and live"),
      h2("For AI / social support tools"),
      bullet("Voice = Instagram Hybrid style: energetic, clear, community-first"),
      bullet("Source of truth = curated Hybrid documents only (not raw historical research)"),
      bullet("Never invent testimonials, prices, or coach affiliations"),
      bullet("Escalate to Mark anything that involves commitment, pricing disputes, or sensitive topics"),
      bullet("Human approval before anything posts or goes to a customer"),

      // ========== CHECKLIST ==========
      new Paragraph({ children: [new PageBreak()] }),
      h1("Part 2 — Website Content Checklist"),
      body("Use this as a page-by-page pass for the next update. Tick as done."),
      h2("Global / site-wide"),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "Brand narrative consistent: Travel Through What You Love / Sport × Travel × Community", size: 20, font: "Arial", color: BLACK })] }),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "No Deep Dish (or related) mentions anywhere public", size: 20, font: "Arial", color: BLACK })] }),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "Clear primary CTAs: Book / Pre-register / Enquire", size: 20, font: "Arial", color: BLACK })] }),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "Mobile-friendly, fast, consistent Fresh Mint + Obsidian Black styling", size: 20, font: "Arial", color: BLACK })] }),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "Instagram + key coach handles linked where appropriate", size: 20, font: "Arial", color: BLACK })] }),
      h2("Homepage"),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "Hero line + short sub that matches Instagram energy", size: 20, font: "Arial", color: BLACK })] }),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "Upcoming experiences block (Lanzarote live, Tennis/Padel pre-register, Golf 2028 signal)", size: 20, font: "Arial", color: BLACK })] }),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "1–2 real or approved example testimonials visible", size: 20, font: "Arial", color: BLACK })] }),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "Link to Coaching / Enquire", size: 20, font: "Arial", color: BLACK })] }),
      h2("Lanzarote Beach Volleyball"),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "Dates, packages, pricing, inclusions, not-included (flights) all accurate", size: 20, font: "Arial", color: BLACK })] }),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "Coach names + short bios or links", size: 20, font: "Arial", color: BLACK })] }),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "Solo-friendly and level guidance clear", size: 20, font: "Arial", color: BLACK })] }),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "Partner notes (beachvolleycamps.ch, Playa Grande Volley, accommodation) accurate", size: 20, font: "Arial", color: BLACK })] }),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "2–3 proof points / testimonials", size: 20, font: "Arial", color: BLACK })] }),
      h2("Mallorca Tennis"),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "Pre-register CTA until exact pricing locked", size: 20, font: "Arial", color: BLACK })] }),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "Location, surface, modular training idea clear without inventing prices", size: 20, font: "Arial", color: BLACK })] }),
      h2("Mallorca Padel"),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "Pre-register only until package finalised", size: 20, font: "Arial", color: BLACK })] }),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "Date signal (e.g. April 2027) if confirmed; no invented inclusions", size: 20, font: "Arial", color: BLACK })] }),
      h2("Coaching / Clinics (UK)"),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "Simple page: headline, short Mark bio, “Enquire” form/CTA", size: 20, font: "Arial", color: BLACK })] }),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "Optional: private / clinic / mini-camp framing without fixed prices if not ready", size: 20, font: "Arial", color: BLACK })] }),
      h2("Coaches / About"),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "Short approved bios for Mark, Martha, Issa (and others as ready)", size: 20, font: "Arial", color: BLACK })] }),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "Photos + Instagram handles where confirmed", size: 20, font: "Arial", color: BLACK })] }),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "No restricted organisation names", size: 20, font: "Arial", color: BLACK })] }),
      h2("Practical / footer"),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "Contact / support email clear", size: 20, font: "Arial", color: BLACK })] }),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "T&Cs, deposits, balance dates consistent with live booking flow", size: 20, font: "Arial", color: BLACK })] }),
      new Paragraph({ numbering: { reference: "check", level: 0 }, spacing: { after: 45 }, children: [new TextRun({ text: "Instagram linked; visual assets from existing Hybrid Instagram where rights allow", size: 20, font: "Arial", color: BLACK })] }),

      spacer(120),
      callout("Assets note", [
        "Hybrid Instagram already holds a strong bank of stills and short video. Prefer those for website and social before commissioning new shoots.",
        "Always check usage rights / model consent if faces are prominent."
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
  fs.writeFileSync("/home/workdir/artifacts/Hybrid_Voice_Rules_Website_Checklist.docx", buffer);
  console.log("Voice + checklist created");
});
