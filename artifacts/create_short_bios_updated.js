const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, LevelFormat, BorderStyle, WidthType,
        ShadingType, PageNumber, PageBreak, VerticalAlign } = require('docx');
const fs = require('fs');

const AQUA = "52D6C7";
const CHARCOAL = "0D0E10";
const LIGHT_GRAY = "F5F7F8";
const MID_GRAY = "CCCCCC";
const WARN = "FFF8E6";

const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: MID_GRAY };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const aquaBorder = { style: BorderStyle.SINGLE, size: 12, color: AQUA };
const borders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const aquaLeft = { top: noBorder, bottom: noBorder, left: aquaBorder, right: noBorder };

function cell(text, opts = {}) {
  const { bold = false, fill = null, width = 4680, color = CHARCOAL, fontSize = 18, italics = false } = opts;
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: fill ? { fill, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      children: [new TextRun({ text, bold, italics, font: "Arial", size: fontSize, color })]
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
        margins: { top: 120, bottom: 120, left: 160, right: 160 },
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
    spacing: { before: 240, after: 100 },
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

function coachBlock(name, handle, bio) {
  return [
    new Paragraph({
      spacing: { before: 200, after: 40 },
      children: [new TextRun({ text: name, bold: true, font: "Arial", size: 22, color: CHARCOAL })]
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text: "Instagram: " + handle, font: "Arial", size: 18, color: AQUA })]
    }),
    body(bio),
  ];
}

const testimonials = [
  {
    name: "Lewis Bunton",
    quote: "Came alone, left with a group chat that still won’t shut up. Coaching was proper — same coach all week, not a rotating holiday vibe.",
  },
  {
    name: "Bailey Harsum",
    quote: "February in Lanzarote, hard sessions, sunset stretches, and people who actually want to play. Exactly what I needed.",
  },
  {
    name: "Jordan Blake",
    quote: "I finally stopped guessing and started understanding my sideout. Feedback was clear without being harsh.",
  },
  {
    name: "Gerda Berštautaitė",
    quote: "Booked for the training, stayed for the people. Hybrid feels like a proper camp, not a random sports holiday.",
  },
  {
    name: "Ella Watson",
    quote: "Solo traveller, intermediate level, a bit nervous. They matched me, integrated me, and by day three I wasn’t the new person anymore.",
  },
];

const extraQuotes = [
  { name: "Lewis Bunton", quote: "Mark’s sessions are the opposite of fluff. You leave knowing what to work on — and somehow still having fun." },
  { name: "Bailey Harsum", quote: "Best balance I’ve found: serious enough to improve, social enough that the evenings matter too." },
  { name: "Ella Watson", quote: "Would book again in a heartbeat. The community bit isn’t marketing — it’s real." },
];

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
            new TextRun({ text: "  ·  Short Bios, Handles & Testimonials", font: "Arial", size: 16, color: "666666" })
          ]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: MID_GRAY, space: 4 } },
          children: [
            new TextRun({ text: "Travel Through What You Love  ·  Page ", font: "Arial", size: 14, color: "888888" }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 14, color: "888888" })
          ]
        })]
      })
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: "HYBRID VACATIONS", bold: true, font: "Arial", size: 32, color: CHARCOAL })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: "Short Bios · Handles & Example Testimonials", bold: true, font: "Arial", size: 22, color: AQUA })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: "Working drafts  ·  August 2026", font: "Arial", size: 16, color: "666666" })]
      }),

      callout("Bios are Hybrid-safe (no restricted organisation names). Get final sign-off from each coach before publishing."),
      new Paragraph({ spacing: { after: 120 }, children: [] }),
      callout("Testimonials below are DRAFT attributions using real names for outreach. Quotes are example wording only — confirm wording and permission with each person before any public use.", WARN),

      h1("1. Short bios (website-ready drafts)"),

      ...coachBlock(
        "Mark Garcia-Kidd",
        "@mgarciakidd",
        "Former England beach volleyball international and founder of Hybrid. Mark has competed for England across the world circuit and built a reputation as one of the UK’s most consistent setters and coaches. He created Hybrid to bring high-quality coaching, real community and unforgettable destinations together — whether that’s a London session or a week on the sand in Lanzarote."
      ),
      ...coachBlock(
        "Martha Bullen",
        "@_marthab",
        "England beach volleyball player and Hybrid coach. Martha competes on the UKBT and Beach Pro Tour, has represented England at senior level, and plays indoor for Richmond. She focuses on purposeful training, individual feedback and the fundamentals that actually win points."
      ),
      ...coachBlock(
        "Issa Batrane",
        "@issabatrane",
        "England beach volleyball international and Hybrid coach. Issa competes on the Beach Pro Tour with partner Freddie Bialokoz and brings high-level competitive experience plus a clear emphasis on effort, defence and player development."
      ),
      ...coachBlock(
        "Dave Panah",
        "@lifeofdavoud",
        "Coach with more than two decades in volleyball and international experience representing Wales. Dave has coached across indoor and beach, from beginners to national-level athletes, and is known for energetic, confidence-building sessions that players remember."
      ),
      ...coachBlock(
        "Marco Bonaria",
        "@beachvolleycamps.ch",
        "Swiss coach and camp organiser with deep roots in the European beach volleyball scene. Marco brings structure, experience and the Swiss coaching network that underpins Hybrid’s collaboration with beachvolleycamps.ch."
      ),
      ...coachBlock(
        "Katya Kate",
        "@katyasteps",
        "Part of the Hybrid coaching community. Full public bio to be confirmed with preferred name, photo and short approved wording."
      ),
      ...coachBlock(
        "David Silva",
        "@nave_dave_",
        "Hybrid coach to be featured on the website. Short approved bio and credentials to be confirmed with David before publish."
      ),

      new Paragraph({ children: [new PageBreak()] }),

      h1("2. Draft testimonials (pending confirmation)"),
      body("These use real names for outreach. Quotes are style examples — not verified statements. Reach out to confirm wording and permission before website or social use."),
      new Paragraph({ spacing: { after: 120 }, children: [] }),

      ...testimonials.flatMap((t, i) => [
        new Paragraph({
          spacing: { before: i === 0 ? 80 : 200, after: 60 },
          children: [new TextRun({ text: "“" + t.quote + "”", italics: true, font: "Arial", size: 20, color: CHARCOAL })]
        }),
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: "— " + t.name, bold: true, font: "Arial", size: 18, color: AQUA }),
            new TextRun({ text: "  ·  pending confirmation", font: "Arial", size: 16, color: "888888" }),
          ]
        }),
      ]),

      h2("Additional draft lines (same names)"),
      ...extraQuotes.flatMap((t) => [
        new Paragraph({
          spacing: { before: 140, after: 60 },
          children: [new TextRun({ text: "“" + t.quote + "”", italics: true, font: "Arial", size: 20, color: CHARCOAL })]
        }),
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: "— " + t.name, bold: true, font: "Arial", size: 18, color: AQUA }),
            new TextRun({ text: "  ·  pending confirmation", font: "Arial", size: 16, color: "888888" }),
          ]
        }),
      ]),

      new Paragraph({ children: [new PageBreak()] }),

      h1("3. How to collect / confirm"),
      bullet("Reach out to Lewis, Bailey, Jordan, Gerda and Ella with the draft lines as a starting point"),
      bullet("Ask if they’re happy with the quote, want to tweak it, or prefer their own words"),
      bullet("Confirm permission for website + social use of name + quote"),
      bullet("Optional: first name + level or city if they want (“— Ella, intermediate”)"),
      bullet("Prefer contact within a week of a shared experience while it’s fresh"),
      bullet("Voice notes are fine — transcribe the best lines"),

      h1("4. Style targets (for any new quotes)"),
      bullet("1–3 sentences"),
      bullet("Specific (coach, level, solo, improvement, vibe)"),
      bullet("Natural, Instagram-adjacent voice — not polished corporate"),

      new Paragraph({ spacing: { before: 360 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Travel Through What You Love.", italics: true, font: "Arial", size: 18, color: AQUA })] }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/home/workdir/artifacts/Hybrid_Short_Bios_Testimonials_Updated.docx", buf);
  console.log("Created updated Short Bios doc");
});
