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
  const { bold = false, fill = null, width = 4680, color = CHARCOAL, fontSize = 18 } = opts;
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: fill ? { fill, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
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
    note: "Junior athlete, pro tour",
    quote: "Proper training environment. Coaches take you seriously even as a junior. Sessions were hard, specific, and I left with clear things to work on for the next tournament.",
  },
  {
    name: "Bailey Harsum",
    note: "Junior athlete, pro tour",
    quote: "Not a holiday camp. Real volume, real feedback, and people who care about getting better. Exactly the kind of week you need between events.",
  },
  {
    name: "Jordan Blake",
    note: "High level UK player",
    quote: "Level of coaching was high. Same coach all week meant the progress actually stuck. Sideout and defence work was proper, not generic drills.",
  },
  {
    name: "Gerda Berštautaitė",
    note: "High level UK player",
    quote: "Strong group of players and coaches who know the UK and international scene. Training was sharp and the competitive standard pushed me.",
  },
  {
    name: "Ella Watson",
    note: "High level competitor",
    quote: "Came for the standard of coaching and stayed for the atmosphere. Hard sessions, good recovery, and a group that wants to compete. Would go again.",
  },
];

const extraQuotes = [
  {
    name: "Lewis Bunton",
    quote: "Mark and the coaches treat juniors like athletes. That matters when you are trying to move up.",
  },
  {
    name: "Bailey Harsum",
    quote: "Lanzarote in winter is ideal. Courts, coaching, and time to reset before the next block of competition.",
  },
  {
    name: "Ella Watson",
    quote: "Best balance I have found between serious training and still having a week you want to be part of.",
  },
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
        children: [new TextRun({ text: "Short Bios, Handles & Example Testimonials", bold: true, font: "Arial", size: 22, color: AQUA })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: "Working drafts  ·  August 2026", font: "Arial", size: 16, color: "666666" })]
      }),

      callout("Coach bios are written for public use. Confirm final wording and photo permission with each coach before publishing."),
      new Paragraph({ spacing: { after: 120 }, children: [] }),
      callout("Testimonials are draft only. Names are real; quotes are example wording for outreach. Confirm each quote and permission before website or social use.", WARN),

      h1("1. Short bios (website drafts)"),

      ...coachBlock(
        "Mark Garcia-Kidd",
        "@mgarciakidd",
        "Former England beach volleyball international and founder of Hybrid. Mark has competed for England on the world circuit and is known as one of the UK's strongest setters and coaches. He built Hybrid around quality coaching, real community, and destinations worth travelling for, from London sessions to weeks on the sand in Lanzarote."
      ),
      ...coachBlock(
        "Martha Bullen",
        "@_marthab",
        "England beach volleyball player and Hybrid coach. Martha competes on the UKBT and Beach Pro Tour, has represented England at senior level, and plays indoor for Richmond. Her coaching is direct, purposeful, and focused on the fundamentals that win points."
      ),
      ...coachBlock(
        "Issa Batrane",
        "@issabatrane",
        "England beach volleyball international and Hybrid coach. Issa competes on the Beach Pro Tour with partner Freddie Bialokoz. He brings high level competitive experience and a clear focus on effort, defence, and player development."
      ),
      ...coachBlock(
        "Dave Panah",
        "@lifeofdavoud",
        "Coach with more than twenty years in volleyball and international experience representing Wales. Dave has coached indoor and beach from beginners through to national level athletes. Sessions are energetic and built around confidence and clear progress."
      ),
      ...coachBlock(
        "Marco Bonaria",
        "@beachvolleycamps.ch",
        "Swiss coach and camp organiser with long experience in the European beach volleyball scene. Marco brings structure and the Swiss coaching network behind Hybrid's collaboration with beachvolleycamps.ch."
      ),
      ...coachBlock(
        "Katya Kate",
        "@katyasteps",
        "Part of the Hybrid coaching group. Full public bio to be confirmed with preferred name, photo, and approved wording."
      ),
      ...coachBlock(
        "David Silva",
        "@nave_dave_",
        "Hybrid coach for the website roster. Short approved bio and credentials to be confirmed with David before publish."
      ),

      new Paragraph({ children: [new PageBreak()] }),

      h1("2. Draft testimonials (pending confirmation)"),
      body("Written with competitive players in mind. Use as a starting point when you reach out. Do not publish until confirmed."),
      new Paragraph({ spacing: { after: 80 }, children: [] }),

      ...testimonials.flatMap((t, i) => [
        new Paragraph({
          spacing: { before: i === 0 ? 60 : 180, after: 50 },
          children: [new TextRun({ text: '"' + t.quote + '"', italics: true, font: "Arial", size: 20, color: CHARCOAL })]
        }),
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: "- " + t.name, bold: true, font: "Arial", size: 18, color: AQUA }),
            new TextRun({ text: "  ·  " + t.note + "  ·  pending confirmation", font: "Arial", size: 16, color: "888888" }),
          ]
        }),
      ]),

      h2("Extra draft lines"),
      ...extraQuotes.flatMap((t) => [
        new Paragraph({
          spacing: { before: 140, after: 50 },
          children: [new TextRun({ text: '"' + t.quote + '"', italics: true, font: "Arial", size: 20, color: CHARCOAL })]
        }),
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: "- " + t.name, bold: true, font: "Arial", size: 18, color: AQUA }),
            new TextRun({ text: "  ·  pending confirmation", font: "Arial", size: 16, color: "888888" }),
          ]
        }),
      ]),

      new Paragraph({ children: [new PageBreak()] }),

      h1("3. How to confirm"),
      bullet("Send the draft line as a starting point, not a finished quote"),
      bullet("Ask if they want to keep it, change it, or write their own"),
      bullet("Get clear permission for website and social use of name and quote"),
      bullet("Optional: add level or context if they are happy with it"),
      bullet("Prefer contacting soon after a shared camp or session"),

      h1("4. Style notes for new quotes"),
      bullet("One to three sentences"),
      bullet("Specific about coaching, level, or competition"),
      bullet("Plain language, not marketing copy"),

      new Paragraph({ spacing: { before: 360 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Travel Through What You Love.", italics: true, font: "Arial", size: 18, color: AQUA })] }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/home/workdir/artifacts/Hybrid_Short_Bios_Human.docx", buf);
  console.log("Created humanised bios doc");
});
