const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
        BorderStyle, WidthType, ShadingType, PageNumber, PageBreak } = require("docx");
const fs = require("fs");

const MINT = "70CFCB";
const BLACK = "12272F";
const LIGHT_MINT = "E8F7F6";
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
function note(t) {
  return new Paragraph({
    spacing: { after: 100 },
    children: [
      new TextRun({ text: "DRAFT / EXAMPLE — ", bold: true, size: 17, font: "Arial", color: AMBER }),
      new TextRun({ text: t, size: 17, font: "Arial", color: MED_GREY, italics: true })
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
    config: [{ reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }]
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
              new TextRun({ text: "  ·  Short Bios · Handles · Example Testimonials", size: 15, font: "Arial", color: MED_GREY })
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
              new TextRun({ text: "Working drafts — replace with approved versions  ·  20 August 2026  ·  Page ", size: 15, font: "Arial", color: MED_GREY }),
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
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: "Short Bios · Handles", size: 26, font: "Arial", color: BLACK })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 },
        children: [new TextRun({ text: "& Example Testimonials", size: 18, font: "Arial", color: MED_GREY })]
      }),
      callout("Important", [
        "Bios are Hybrid-safe (no restricted organisation names). Get final sign-off from each coach.",
        "Testimonials below are EXAMPLES only — use them as prompts when collecting real ones. Never publish invented quotes."
      ]),
      spacer(100),
      new Paragraph({ children: [new PageBreak()] }),

      h1("1. Short bios (website-ready drafts)"),
      h2("Mark Garcia-Kidd"),
      body("Instagram: @mgarciakidd"),
      body("Former England beach volleyball international and founder of Hybrid. Mark has competed for England across the world circuit and built a reputation as one of the UK’s most consistent setters and coaches. He created Hybrid to bring high-quality coaching, real community and unforgettable destinations together — whether that’s a London session or a week on the sand in Lanzarote."),

      h2("Martha Bullen"),
      body("Instagram: @_marthab"),
      body("England beach volleyball player and Hybrid coach. Martha competes on the UKBT and Beach Pro Tour, has represented England at senior level, and plays indoor for Richmond. She focuses on purposeful training, individual feedback and the fundamentals that actually win points."),

      h2("Issa Batrane"),
      body("Instagram: @issabatrane"),
      body("England beach volleyball international and Hybrid coach. Issa competes on the Beach Pro Tour with partner Freddie Bialokoz and brings high-level competitive experience plus a clear emphasis on effort, defence and player development."),

      h2("Dave Panah"),
      body("Instagram: confirm preferred handle (possible public presence under related names — confirm with Dave)"),
      body("Coach with more than two decades in volleyball and international experience representing Wales. Dave has coached across indoor and beach, from beginners to national-level athletes, and is known for energetic, confidence-building sessions that players remember."),

      h2("Marco Bonaria"),
      body("Instagram: confirm preferred handle"),
      body("Swiss coach and camp organiser with deep roots in the European beach volleyball scene. Marco brings structure, experience and the Swiss coaching network that underpins Hybrid’s collaboration with beachvolleycamps.ch."),

      h2("Katya / Katya Kate"),
      body("Instagram: confirm preferred handle (appears in Hybrid referral activity as Katya15)"),
      body("Part of the Hybrid coaching community. Full public bio to be confirmed with preferred name, photo and short approved wording."),

      h1("2. Example testimonials (for inspiration only)"),
      note("Do not publish these as real. Use them as style and length guides when asking past campers for quotes."),
      bold("Style targets"),
      bullet("1–3 sentences"),
      bullet("Specific (coach, level, solo, improvement, vibe)"),
      bullet("Natural, Instagram-adjacent voice — not polished corporate"),
      spacer(60),
      body("“Came alone, left with a group chat that still won’t shut up. Coaching was proper — same coach all week, not a rotating holiday vibe.”"),
      body("“February in Lanzarote, hard sessions, sunset stretches, and people who actually want to play. Exactly what I needed.”"),
      body("“I finally stopped guessing and started understanding my sideout. Martha’s feedback was clear without being harsh.”"),
      body("“Booked for the training, stayed for the people. Hybrid feels like a proper camp, not a random sports holiday.”"),
      body("“Solo traveller, intermediate level, a bit nervous. They matched me, integrated me, and by day three I wasn’t the new person anymore.”"),
      body("“Mark’s sessions are the opposite of fluff. You leave knowing what to work on — and somehow still having fun.”"),
      body("“Best balance I’ve found: serious enough to improve, social enough that the evenings matter too.”"),
      body("“Would book again in a heartbeat. The community bit isn’t marketing — it’s real.”"),

      h1("3. How to collect real ones"),
      bullet("Ask within a week of camp ending (while it’s fresh)"),
      bullet("Offer a simple prompt: What made you book? What surprised you? One sentence that sums it up?"),
      bullet("Prefer first name + city or level if they’re happy (“— Sarah, intermediate, London”)"),
      bullet("Voice notes are fine; transcribe the best lines"),
      bullet("Get permission to use name + quote on website and social"),

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
  fs.writeFileSync("/home/workdir/artifacts/Hybrid_Bios_Testimonials.docx", buffer);
  console.log("Bios + testimonials created");
});
