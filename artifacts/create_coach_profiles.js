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
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const mintBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };

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
      new TextRun({ text: "Note: ", bold: true, size: 17, font: "Arial", color: AMBER }),
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
              new TextRun({ text: "  ·  Coach Profiles — Research Update", size: 15, font: "Arial", color: MED_GREY })
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
              new TextRun({ text: "Public sources  ·  Verify before publish  ·  20 August 2026  ·  Page ", size: 15, font: "Arial", color: MED_GREY }),
              new TextRun({ children: [PageNumber.CURRENT], size: 15, font: "Arial", color: MED_GREY })
            ]
          })
        ]
      })
    },
    children: [
      spacer(400),
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
      spacer(50),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "Coach Profiles", size: 28, font: "Arial", color: BLACK })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 },
        children: [new TextRun({ text: "Public research update — August 2026", size: 18, font: "Arial", color: MED_GREY })]
      }),
      callout("Source note", [
        "Compiled from public pages (Volleyball England, bvbinfo/FIVB, CEV, Deep Dish, beachvolleycamps.ch, partner announcements, athlete interviews).",
        "Martha’s surname confirmed as Bullen (Deep Dish and competition records). Partner site still shows “Mullen” in one listing — recommend aligning all Hybrid materials to Bullen.",
        "Katya / Katya Kate: limited public Hybrid-specific biography found; placeholder retained pending confirmation of full name and preferred bio."
      ]),
      spacer(120),
      new Paragraph({ children: [new PageBreak()] }),

      h1("1. Mark Garcia-Kidd (ENG)"),
      bold("Role"),
      body("Founder, Hybrid Vacations (2025). Head coach presence on Hybrid programmes. Long-time coach with beachvolleycamps.ch."),
      bold("Playing"),
      bullet("England beach volleyball international — FIVB / bvbinfo player profile"),
      bullet("International results including top-10 finishes on the world circuit in earlier seasons"),
      bullet("Home town Dorset; based in London"),
      bold("Coaching & community"),
      bullet("Private coaching, clinics and performance work in London / South East"),
      bullet("Visible collaboration with Fireball (advanced clinic leadership) and partner camps"),
      bullet("Central to Hybrid’s “built by people who have lived the sport” positioning"),
      bold("Suggested website line"),
      body("“Former England beach volleyball international and founder of Hybrid. Mark brings playing experience, coaching craft and a genuine community instinct to every session — whether that’s a London clinic or a week on the sand in Lanzarote.”"),

      h1("2. Martha Bullen (ENG)"),
      note("Previously listed in some partner materials as “Martha Mullen”. Competition records, Deep Dish announcements and England squad coverage use Bullen."),
      bold("Playing"),
      bullet("England beach volleyball player — senior pathway since junior age groups"),
      bullet("Represented England at the Novotel Cup (Luxembourg, 2023) as part of the senior women’s squad"),
      bullet("Competes on the UKBT Grand Slam circuit; indoor experience with Richmond Volleyball Club"),
      bullet("FIVB Beach Pro Tour — e.g. 9th place with partner Alana Snow at Balikesir Futures (2025)"),
      bullet("Born 31 May 2000"),
      bold("Coaching style (from public camp announcements)"),
      bullet("Emphasis on playing with purpose and making every rep count"),
      bullet("Strong on individual feedback — helping players understand strengths and clear improvement points"),
      bullet("Values mastery of fundamentals (passing, setting, reading the game)"),
      bold("Suggested website line"),
      body("“England beach volleyball player and Hybrid coach. Martha competes at international and UKBT level and brings a player’s eye for the details that actually move the game forward.”"),

      h1("3. Issa Batrane (ENG)"),
      bold("Playing"),
      bullet("England / GB beach volleyball athlete — partner Freddie Bialokoz"),
      bullet("Beach Pro Tour: Futures gold, multiple podium finishes, Elite16 appearances; ranked among the stronger British pairs in recent seasons"),
      bullet("Pathway: Richmond Volleyball Club → LeAF Academy (Bournemouth) → Bournemouth University → senior international"),
      bullet("Junior national success (including World U21 progression) and multiple senior British titles"),
      bold("Coaching & community"),
      bullet("Coach and ambassador with Deep Dish Beach (Crystal Palace); also contributed to social/marketing"),
      bullet("School visits and youth inspiration work; EcoAthletes / climate ambassador"),
      bold("Suggested website line"),
      body("“England beach volleyball international and Hybrid coach. Issa competes on the Beach Pro Tour and brings high-level competitive experience plus a clear focus on effort, defence and player development.”"),

      h1("4. Dave Panah (ENG / Wales connection)"),
      bold("Background"),
      bullet("26+ years in volleyball; 11+ years coaching across indoor and beach"),
      bullet("Played internationally for Team Wales; involved in developing Northern Ireland’s national beach programme"),
      bullet("Coaches youth, adults, beginners and performance athletes across different systems and countries"),
      bold("Coaching style (from public Deep Dish profiles)"),
      bullet("Energetic, story-driven sessions"),
      bullet("Builds confidence and skill across levels"),
      bullet("Past campers highlight sessions as challenging, fun and memorable"),
      bold("Suggested website line"),
      body("“Coach with more than two decades in the game and international experience with Wales and Northern Ireland programmes. Dave’s sessions mix high standards with energy and clear, confidence-building coaching.”"),

      h1("5. Marco Bonaria (SUI)"),
      bold("Background"),
      bullet("Swiss coach based in the Wichtrach / Häggenschwil area"),
      bullet("Director / shareholder involvement with Beachvolley.community GmbH (organisation of beach volleyball camps, coaching and related travel)"),
      bullet("Former player — FIVB Open events in the early 2000s (including Gstaad)"),
      bullet("Indoor coaching history includes roles at VBC Uni Bern and TV Schönenwerd"),
      bullet("Listed height approximately 192–194 cm"),
      bold("Suggested website line"),
      body("“Swiss coach and camp organiser with deep roots in the European beach volleyball scene. Marco brings structure, experience and the Swiss coaching network that underpins the Hybrid–beachvolleycamps.ch partnership.”"),

      h1("6. Katya / Katya Kate"),
      note("Appears in Hybrid Instagram referral codes (Katya15) and coach-introduction content. Clear public competition or detailed coaching biography under this exact name was not located in the sources reviewed. Recommend confirming preferred full name, nationality and a short approved bio directly with her."),
      bold("Working placeholder"),
      body("“Katya is part of the Hybrid coaching community and features in camp introduction content and referral activity. Full public biography to be confirmed.”"),
      bold("Suggested next step"),
      body("Request a 3–4 line bio + preferred photo and any competition or club affiliations she is happy to publish."),

      h1("7. Practical recommendations"),
      bullet("Standardise surname: Martha Bullen across all Hybrid and partner-facing materials"),
      bullet("Collect short approved bios + headshots from each coach using a consistent template (intro · playing/coaching background · what players can expect · optional personal line)"),
      bullet("Prioritise Mark, Martha, Issa, Dave and Marco for the first website Coaches / About section"),
      bullet("Add Katya once preferred name and bio are confirmed"),
      bullet("Where coaches have active referral codes (Dave15, Martha15, Katya15, etc.), link the profile to the ambassador / referral system"),
      spacer(120),
      callout("Confidence levels", [
        "High confidence (multiple independent public sources): Mark, Martha Bullen, Issa Batrane, Dave Panah.",
        "Good confidence (partner + registry / historical records): Marco Bonaria.",
        "Low public detail so far: Katya / Katya Kate — treat as internal confirmation required."
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
  fs.writeFileSync("/home/workdir/artifacts/Hybrid_Coach_Profiles_Research.docx", buffer);
  console.log("Document created successfully");
});
