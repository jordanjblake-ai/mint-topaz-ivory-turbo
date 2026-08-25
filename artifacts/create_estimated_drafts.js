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
function h3(t) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text: t, bold: true, size: 22, font: "Arial", color: "1A3A45" })]
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
function estimateNote(t) {
  return new Paragraph({
    spacing: { after: 100 },
    children: [
      new TextRun({ text: "ESTIMATE / DRAFT — ", bold: true, size: 17, font: "Arial", color: AMBER }),
      new TextRun({ text: t, size: 17, font: "Arial", color: MED_GREY, italics: true })
    ]
  });
}
function kv(label, value) {
  return new TableRow({
    children: [
      new TableCell({
        borders: greyBorders,
        width: { size: 2800, type: WidthType.DXA },
        shading: { fill: LIGHT_MINT, type: ShadingType.CLEAR },
        margins: { top: 40, bottom: 40, left: 80, right: 80 },
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 16, font: "Arial", color: BLACK })] })]
      }),
      new TableCell({
        borders: greyBorders,
        width: { size: 6560, type: WidthType.DXA },
        margins: { top: 40, bottom: 40, left: 80, right: 80 },
        children: [new Paragraph({ children: [new TextRun({ text: value, size: 16, font: "Arial", color: BLACK })] })]
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
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Arial", color: "1A3A45" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "q", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
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
              new TextRun({ text: "  ·  Estimated Drafts (Working)", size: 15, font: "Arial", color: MED_GREY })
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
              new TextRun({ text: "Estimates only — verify before publish  ·  20 August 2026  ·  Page ", size: 15, font: "Arial", color: MED_GREY }),
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
        children: [new TextRun({ text: "Estimated Drafts", size: 28, font: "Arial", color: BLACK })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 },
        children: [new TextRun({ text: "Coach profiles · Packages · Coaching page · Finder · Calendar · Testimonials", size: 18, font: "Arial", color: MED_GREY })]
      }),
      callout("How to use this document", [
        "Everything below is a working estimate or structural draft based on public data and the Master Profile strategy.",
        "Amber “ESTIMATE / DRAFT” labels mark content that must be verified or completed by the Hybrid team before publication.",
        "Use as a starting template — replace estimates with confirmed facts, prices, bios and quotes."
      ]),
      spacer(160),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "SPORT  ×  TRAVEL  ×  COMMUNITY", bold: true, size: 16, font: "Arial", color: MINT })]
      }),
      new Paragraph({ children: [new PageBreak()] }),

      // ========== COACH PROFILES ==========
      h1("1. Estimated Coach Profile Stubs"),
      estimateNote("Bios below mix confirmed public facts with suggested positioning language. Replace any unverified claims and add photos, years of experience, and personal quotes."),

      h2("Mark Garcia-Kidd — Founder & Coach"),
      body("England beach volleyball player and coach. Founder of Hybrid Vacations (2025). Long-time coach with beachvolleycamps.ch. Based in London; offers private coaching, clinics and performance work alongside Hybrid’s international camps."),
      bold("Suggested short bio (website):"),
      body("“Mark is a former international beach volleyball player for England and the founder of Hybrid. After years competing and coaching across the UK and Europe, he built Hybrid to bring high-quality coaching, real community and unforgettable destinations together. Whether you’re training with him in London or joining a camp in Lanzarote, you’ll feel the difference that comes from someone who has lived the sport.”"),
      bold("Suggested credentials line:"),
      body("Former England beach volleyball international · Founder, Hybrid Vacations · Coach, beachvolleycamps.ch partnership"),

      h2("Martha Mullen (ENG)"),
      estimateNote("Public listing confirms her as Lanzarote coach. Full competitive / coaching history not detailed in sources reviewed — request short bio from Martha."),
      body("Suggested placeholder: “Martha is part of the Hybrid Lanzarote coaching team, bringing energy, technical focus and a player-first approach to every session.”"),

      h2("Issa Batrane (ENG)"),
      estimateNote("Featured in “Two Truths and a Lie” content and named on partner coach list. Request bio."),
      body("Suggested placeholder: “Issa coaches on the Hybrid Lanzarote programme and is known for making technical improvement feel accessible and fun.”"),

      h2("Dave Panah (ENG)"),
      estimateNote("Named coach + existing referral code (Dave15). Request bio."),
      body("Suggested placeholder: “Dave is a Hybrid Lanzarote coach and one of the faces of the camp’s community-driven style.”"),

      h2("Marco Bonaria (SUI)"),
      estimateNote("Swiss coach listed on partner site; also associated with other beachvolleycamps.ch activity. Request short bio and any national/club credentials."),
      body("Suggested placeholder: “Marco brings Swiss coaching standards and international experience to the Hybrid Lanzarote team.”"),

      callout("Action", [
        "Send each coach a 4-line template: (1) one-sentence intro, (2) playing/coaching background, (3) what players can expect from them, (4) optional personal line. Aim for consistency of length and tone."
      ]),

      // ========== PADEL PACKAGE ==========
      h1("2. Estimated Mallorca Padel Package Outline"),
      estimateNote("No full public package page found yet. Structure below mirrors the live Tennis and Lanzarote models so the brand stays consistent. All prices are illustrative placeholders only."),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2800, 6560],
        rows: [
          kv("Working title", "Hybrid Padel — Mallorca"),
          kv("Suggested dates", "5–9 April 2027 (from Instagram announcement)"),
          kv("Location", "Mallorca (align with Capdepera / Font de Sa Cala or confirm specific venue)"),
          kv("Positioning", "“Padel done differently” — training + destination + community")
        ]
      }),
      spacer(100),
      h3("Suggested package structure (estimate)"),
      bold("Training options (mirroring Tennis logic)"),
      bullet("Group (4 players): estimated £450–£550 pp"),
      bullet("Pairs: estimated £580–£650 pp"),
      bullet("Individual focus: estimated £700–£800 pp"),
      bold("Accommodation"),
      bullet("Partner hotel half-board: estimated from £500–£600 for the stay (align with Tennis Na Taconera range)"),
      bold("Suggested inclusions"),
      bullet("Daily coached padel sessions (number TBC — aim for clear session count)"),
      bullet("Social / competitive play formats"),
      bullet("Welcome pack + camp shirt"),
      bullet("At least one recovery or social evening"),
      bold("Explicitly not included"),
      bullet("Flights, insurance, transfers (unless offered as optional)"),
      callout("Next step", [
        "Confirm venue, exact dates, session count, coach names and real pricing. Then publish a page that matches the clarity of the Lanzarote and Tennis pages."
      ]),

      // ========== UK COACHING ==========
      h1("3. Estimated UK Coaching & Clinics Page Skeleton"),
      estimateNote("No public price list found. Structure below turns the Master Profile strategic pillar into a usable page outline."),

      h3("Page headline options"),
      bullet("Train where you are. Travel when you’re ready."),
      bullet("London coaching that feeds the Hybrid experience."),
      bullet("High-quality coaching without the flight."),

      h3("Core offer blocks (estimate)"),
      bold("Private coaching (1:1 or pairs)"),
      body("Suggested framing: “Sessions with Mark (and guest Hybrid coaches) in London / South East. Technique, tactics, match prep or simply getting more out of your game.”"),
      body("Pricing: leave as “Enquire” or add estimated band once confirmed (e.g. £X / hour)."),
      bold("Clinics (half-day or evening)"),
      body("Small-group sessions, often themed (serving, defence, sideout, tournament prep). Ideal low-commitment entry point."),
      bold("Mini-camps (1–2 days)"),
      body("Longer format that sits between a clinic and an international camp. Strong community + content opportunity."),
      bold("Club / group bookings"),
      body("“Bring your club or university team.” Custom sessions or mini-camps for existing groups."),

      h3("Call-to-action hierarchy"),
      bullet("Primary: Enquire / Book a session"),
      bullet("Secondary: Join the next clinic waitlist"),
      bullet("Tertiary: Explore international camps (Lanzarote, Mallorca)"),

      callout("Strategic link", [
        "This page is the visible start of the local → clinic → mini-camp → international flywheel. Even a simple “Enquire for London coaching” with Mark’s photo and a short form is better than silence."
      ]),

      // ========== EXPERIENCE FINDER ==========
      h1("4. Experience Finder — Draft Question Set"),
      estimateNote("Designed to map onto the modular packages already live and the emerging ones."),

      body("Suggested flow (5–7 questions max):"),
      bold("1. What do you play?"),
      body("Beach Volleyball  ·  Tennis  ·  Padel  ·  Not sure / more than one"),
      bold("2. What level are you?"),
      body("Improver  ·  Intermediate  ·  Advanced / competitive  ·  Not sure (we’ll help)"),
      bold("3. When do you want to go?"),
      body("Next 3 months  ·  3–6 months  ·  6–12 months  ·  Flexible"),
      bold("4. Where appeals?"),
      body("Lanzarote / Canaries  ·  Mallorca  ·  Switzerland / Alps  ·  UK only  ·  Surprise me"),
      bold("5. Solo or with others?"),
      body("Coming alone  ·  With a partner / friend  ·  With a group or club"),
      bold("6. What matters most?"),
      body("Serious training & improvement  ·  Balance of training + holiday  ·  Social / community first  ·  Performance / tournament prep"),
      bold("7. (Optional) Budget comfort zone"),
      body("Under £500  ·  £500–£900  ·  £900–£1,400  ·  Flexible"),

      body("Output: recommend 1–2 best-fit experiences with short reason + link to the relevant package page. Escalate to human if “UK only” or complex group request."),

      // ========== CALENDAR ==========
      h1("5. Estimated 2026–27 Calendar Skeleton"),
      estimateNote("Only publicly announced or strongly signalled dates are firm. Everything else is a planning placeholder."),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2200, 2800, 4360],
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders: greyBorders, width: { size: 2200, type: WidthType.DXA }, shading: { fill: LIGHT_MINT, type: ShadingType.CLEAR }, margins: { top: 40, bottom: 40, left: 60, right: 60 },
                children: [new Paragraph({ children: [new TextRun({ text: "When", bold: true, size: 15, font: "Arial", color: BLACK })] })] }),
              new TableCell({ borders: greyBorders, width: { size: 2800, type: WidthType.DXA }, shading: { fill: LIGHT_MINT, type: ShadingType.CLEAR }, margins: { top: 40, bottom: 40, left: 60, right: 60 },
                children: [new Paragraph({ children: [new TextRun({ text: "Experience", bold: true, size: 15, font: "Arial", color: BLACK })] })] }),
              new TableCell({ borders: greyBorders, width: { size: 4360, type: WidthType.DXA }, shading: { fill: LIGHT_MINT, type: ShadingType.CLEAR }, margins: { top: 40, bottom: 40, left: 60, right: 60 },
                children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true, size: 15, font: "Arial", color: BLACK })] })] })
            ]
          }),
          kvRow("Feb half-term 2026", "Junior BV camp", "Referenced on Instagram — confirm dates & publish"),
          kvRow("May 2026", "Mallorca Tennis", "Listed on hybridvacations.com"),
          kvRow("Jan–Feb 2027", "Lanzarote BV (3 weeks)", "Public dates confirmed"),
          kvRow("April 2027", "Mallorca Padel", "Instagram announcement 5–9 April — package page TBC"),
          kvRow("April 2027 (TBC)", "Mallorca Tennis (possible)", "Social signals — confirm"),
          kvRow("TBC 2027", "Gstaad BV", "Partner ecosystem — Hybrid dates TBC"),
          kvRow("Ongoing", "UK private / clinics / mini-camps", "Strategic pillar — public calendar needed")
        ]
      }),
      spacer(80),
      body("Recommendation: keep one internal master calendar (Google Sheet or Notion) and a simplified public “Upcoming Experiences” block on the site."),

      // ========== TESTIMONIALS ==========
      h1("6. Testimonial Collection Brief + Example Phrasing"),
      estimateNote("No large public review set found. Use this brief to collect real ones quickly after the next camp or coaching block."),

      h3("What to ask (short form or voice note)"),
      bullet("What made you book Hybrid in the first place?"),
      bullet("What surprised you most about the experience?"),
      bullet("Would you come again / recommend to a friend? Why?"),
      bullet("One sentence that sums up the week for you."),

      h3("Example phrasings (illustrative only — replace with real quotes)"),
      body("“I came alone and left with a group of people I still message. The coaching was proper, not holiday-camp fluff.”"),
      body("“Same coach all week made a massive difference — I could actually feel my game change by day four.”"),
      body("“Lanzarote in February, good people, hard sessions, sunset stretches. Exactly what I needed.”"),

      callout("Placement", [
        "Put 2–3 strongest quotes high on the Lanzarote page and one on the homepage. Attribute with first name + level or city if the person is happy."
      ]),

      // ========== CLOSING ==========
      h1("7. How to Treat These Drafts"),
      bullet("Coach bios → send template to each coach this week; publish once approved"),
      bullet("Padel package → lock venue, dates, session count, real prices, then mirror Lanzarote page structure"),
      bullet("UK Coaching page → even a simple enquire form + Mark photo is progress"),
      bullet("Experience Finder → implement questions above; map answers to live package URLs"),
      bullet("Calendar → maintain one source of truth; only publish confirmed dates"),
      bullet("Testimonials → collect after next camp / clinic; never invent"),

      spacer(120),
      body("These drafts exist so the team is never starting from a blank page. Every estimate is replaceable the moment real data arrives."),
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

function kvRow(a, b, c) {
  return new TableRow({
    children: [
      new TableCell({ borders: greyBorders, width: { size: 2200, type: WidthType.DXA }, margins: { top: 35, bottom: 35, left: 60, right: 60 },
        children: [new Paragraph({ children: [new TextRun({ text: a, size: 15, font: "Arial", color: BLACK })] })] }),
      new TableCell({ borders: greyBorders, width: { size: 2800, type: WidthType.DXA }, margins: { top: 35, bottom: 35, left: 60, right: 60 },
        children: [new Paragraph({ children: [new TextRun({ text: b, size: 15, font: "Arial", color: BLACK })] })] }),
      new TableCell({ borders: greyBorders, width: { size: 4360, type: WidthType.DXA }, margins: { top: 35, bottom: 35, left: 60, right: 60 },
        children: [new Paragraph({ children: [new TextRun({ text: c, size: 15, font: "Arial", color: BLACK })] })] })
    ]
  });
}

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/workdir/artifacts/Hybrid_Estimated_Drafts.docx", buffer);
  console.log("Document created successfully");
});
