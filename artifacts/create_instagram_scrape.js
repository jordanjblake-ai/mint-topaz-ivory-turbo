const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
        BorderStyle, WidthType, ShadingType, PageNumber, PageBreak } = require('docx');
const fs = require('fs');

const MINT = "70CFCB";
const BLACK = "12272F";
const LIGHT_MINT = "E8F7F6";
const SOFT_GREY = "F5F7F8";
const MED_GREY = "6B7C85";

const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: MINT };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const mintBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const greyBorder = { style: BorderStyle.SINGLE, size: 4, color: "D0D7DB" };
const greyBorders = { top: greyBorder, bottom: greyBorder, left: greyBorder, right: greyBorder };

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: MINT, space: 8 } },
    children: [new TextRun({ text, bold: true, size: 32, font: "Arial", color: BLACK })]
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ text, bold: true, size: 26, font: "Arial", color: BLACK })]
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 22, font: "Arial", color: "1A3A45" })]
  });
}

function body(text) {
  return new Paragraph({
    spacing: { after: 120, line: 276 },
    children: [new TextRun({ text, size: 20, font: "Arial", color: BLACK })]
  });
}

function bodyBold(text) {
  return new Paragraph({
    spacing: { after: 120, line: 276 },
    children: [new TextRun({ text, size: 20, font: "Arial", color: BLACK, bold: true })]
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 50, line: 276 },
    children: [new TextRun({ text, size: 20, font: "Arial", color: BLACK })]
  });
}

function small(text) {
  return new Paragraph({
    spacing: { after: 60, line: 260 },
    children: [new TextRun({ text, size: 17, font: "Arial", color: BLACK })]
  });
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
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: [
              new Paragraph({
                spacing: { after: 60 },
                children: [new TextRun({ text: title, bold: true, size: 18, font: "Arial", color: BLACK })]
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

function quoteBlock(text) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: noBorder, bottom: noBorder,
              left: { style: BorderStyle.SINGLE, size: 24, color: MINT },
              right: noBorder
            },
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: SOFT_GREY, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 180, right: 140 },
            children: [
              new Paragraph({
                children: [new TextRun({ text, size: 18, font: "Arial", color: BLACK, italics: true })]
              })
            ]
          })
        ]
      })
    ]
  });
}

function spacer(after = 100) {
  return new Paragraph({ spacing: { after }, children: [] });
}

function profileRow(label, value) {
  return new TableRow({
    children: [
      new TableCell({
        borders: greyBorders,
        width: { size: 2800, type: WidthType.DXA },
        shading: { fill: LIGHT_MINT, type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        children: [new Paragraph({
          children: [new TextRun({ text: label, bold: true, size: 18, font: "Arial", color: BLACK })]
        })]
      }),
      new TableCell({
        borders: greyBorders,
        width: { size: 6560, type: WidthType.DXA },
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        children: [new Paragraph({
          children: [new TextRun({ text: value, size: 18, font: "Arial", color: BLACK })]
        })]
      })
    ]
  });
}

function postLine(num, type, shortcode, desc) {
  return new Paragraph({
    spacing: { after: 50, line: 250 },
    children: [
      new TextRun({ text: `${num}. `, bold: true, size: 16, font: "Arial", color: BLACK }),
      new TextRun({ text: type, bold: true, size: 16, font: "Arial", color: MINT === "70CFCB" ? "0D7377" : MINT }),
      new TextRun({ text: `  ${shortcode}  —  `, size: 16, font: "Arial", color: MED_GREY }),
      new TextRun({ text: desc, size: 16, font: "Arial", color: BLACK })
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
            spacing: { after: 100 },
            children: [
              new TextRun({ text: "HYBRID VACATIONS", bold: true, size: 15, font: "Arial", color: BLACK }),
              new TextRun({ text: "  ·  Instagram Intelligence  ·  @hybridvacations", size: 15, font: "Arial", color: MED_GREY })
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
              new TextRun({ text: "Scraped 19 August 2026  ·  Working Research Document  ·  Page ", size: 15, font: "Arial", color: MED_GREY }),
              new TextRun({ children: [PageNumber.CURRENT], size: 15, font: "Arial", color: MED_GREY })
            ]
          })
        ]
      })
    },
    children: [
      // COVER
      spacer(600),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: "HYBRID VACATIONS", bold: true, size: 44, font: "Arial", color: BLACK })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 16, color: MINT, space: 1 } },
        children: [new TextRun({ text: " ", size: 6 })]
      }),
      spacer(120),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: "Instagram Intelligence Report", size: 28, font: "Arial", color: BLACK })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: "@hybridvacations", size: 22, font: "Arial", color: MINT })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        children: [new TextRun({ text: "Scraped 19 August 2026", size: 18, font: "Arial", color: MED_GREY })]
      }),
      callout("Source", [
        "https://www.instagram.com/hybridvacations/",
        "Working research document for brand, content and marketing strategy."
      ]),
      spacer(400),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "SPORT  ×  TRAVEL  ×  COMMUNITY", bold: true, size: 16, font: "Arial", color: MINT })]
      }),
      new Paragraph({ children: [new PageBreak()] }),

      // PROFILE SNAPSHOT
      heading1("1. Profile Snapshot"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2800, 6560],
        rows: [
          profileRow("Username", "@hybridvacations"),
          profileRow("Display name", "Hybrid Vacations"),
          profileRow("Category", "Travel company"),
          profileRow("Posts", "156"),
          profileRow("Followers", "1,552"),
          profileRow("Following", "2,281"),
          profileRow("Bio", "🌍✈️ Connecting communities through sport and travel. Join us for memorable vacation adventures! 🌴🎾🏐  Our Latest Projects👇"),
          profileRow("Bio link 1", "Lanzarote Beach Volleyball Camp 2027 → hybridvacations.com/lanzarote-camp"),
          profileRow("Bio link 2", "Pre-Registration for Sports Vacations"),
          profileRow("Profile picture", "Turquoise/pink gradient circle logo, “HYBRID Vacations” wordmark with palm tree icon"),
          profileRow("Story Highlights", "None currently pinned")
        ]
      }),
      spacer(160),

      // BRAND / CONTENT OBSERVATIONS
      heading1("2. Brand & Content Observations"),
      heading2("Core Sports Verticals"),
      body("Beach volleyball (primary), tennis and padel — all under the Hybrid sub-brands (Hybrid Beach Volleyball, Hybrid Tennis, Hybrid Padel)."),
      heading2("Destinations Featured"),
      bullet("Lanzarote (Playa Grande / Puerto del Carmen) — flagship camp"),
      bullet("Mallorca (Capdepera / Font de Sa Cala) — tennis & padel"),
      bullet("Gstaad, Switzerland — beach volleyball"),
      bullet("Occasional Turkey (Alaçatı / Çeşme), Tunisia, Peru travel content"),
      heading2("Recurring Content Formats"),
      bullet("Announcement / promo graphics — bold poster-style text over photos (camp dates, Early Bird, discount codes)"),
      bullet("“Two Truths and a Lie” coach-introduction reel series (Issa, Dave, Katya, Martha, etc.)"),
      bullet("Coach / athlete spotlight reels (MGK = Mark Garcia-Kidd, Marco Bonaria, Jan Landen, Gianluca Zanotti, Issa Batrane, Dave Panah, Nestor “Bocho” Serron, Mateusz Adamiak)"),
      bullet("Behind-the-scenes / humour reels (“Coach vs Coach”, “Expectation vs Reality”, “The hardest part of camp”)"),
      bullet("Partner co-branding: @beachvolleycamps.ch, @fireballbvb, @levelupbeach"),
      bullet("Reposts of partner / coach content (@flow_beachsports, @mgarciakidd, @beachvolleycamps.ch, @sun_on_wave, @lifeofdavoud, @fireballbvb)"),
      bullet("Grid-design branding stunt: large mosaic set of 8 posts (mid-May 2025) whose thumbnails combine into a giant “HYBRID Vacations” wordmark"),
      heading2("Frequent Hashtags"),
      body("#HybridVacations  ·  #LanzaroteCamp  ·  #BeachVolleyball  ·  #TravelHybrid  ·  #NeverStopExploring  ·  #BeachLife  ·  #TrainTravelPlay  ·  #CoastlinesAndCourtlines  ·  #Performance"),
      heading2("Tone of Voice"),
      body("Energetic, cheeky / self-deprecating humour, community- and friendship-focused. Heavy emoji use (🌴🏐🎾☀️🌊), frequent line breaks for readability, clear CTAs (“Link in bio”, “Early Bird ends 1st August”, “Sign-Up Now”)."),
      heading2("CTA Pattern"),
      body("Discount codes tied to individual coaches (referral-style: Dave15, Katie15, Martha15, Katya15, Issa15, Black45). Early Bird pricing deadlines. Week-by-week camp date breakdowns (Week 1 / Week 2 / Week 3)."),

      // CONTENT PILLARS SUMMARY
      heading1("3. Content Pillars Summary"),
      body("From the full inventory, content clusters into six clear pillars (aligned with the Master Profile):"),
      bodyBold("1. Personality — Coaches, athletes, founder (Mark / MGK)"),
      bodyBold("2. Humour — Expectation vs Reality, Coach vs Coach, Two Truths and a Lie, self-aware listicles"),
      bodyBold("3. Destination — Lanzarote, Mallorca, Gstaad, occasional travel destinations"),
      bodyBold("4. Performance — Training, coaching, athletes, competitive sport"),
      bodyBold("5. Community — Friends, groups, partners, shared experiences, reposts"),
      bodyBold("6. Sales — Early Bird, launches, discount codes, booking CTAs"),
      spacer(60),
      callout("Strategic Note", [
        "The feed balances personality and humour with clear commercial pushes. The coach-specific discount codes form a ready-made foundation for a formal ambassador / referral programme."
      ]),

      // KEY COACHES & PARTNERS
      heading1("4. Key Coaches & Partners Visible in Feed"),
      heading2("Coaches / Personalities"),
      bullet("Mark Garcia-Kidd (MGK / @mgarciakidd)"),
      bullet("Martha (@_marthab)"),
      bullet("Issa Batrane"),
      bullet("Dave Panah"),
      bullet("Katya"),
      bullet("Marco Bonaria"),
      bullet("Jan Landen"),
      bullet("Gianluca Zanotti"),
      bullet("Nestor “Bocho” Serron"),
      bullet("Mateusz Adamiak"),
      heading2("Partner Accounts"),
      bullet("@beachvolleycamps.ch — Switzerland / Lanzarote collaboration"),
      bullet("@fireballbvb — Fireball Beach Volleyball"),
      bullet("@levelupbeach"),
      bullet("@flow_beachsports"),
      bullet("@beachvolley.community"),
      bullet("@sun_on_wave · @lifeofdavoud"),

      // LIMITATIONS
      heading1("5. What Wasn’t Captured"),
      body("Important research limitations:"),
      bullet("Real written captions for plain photo / carousel posts — Instagram grid view only exposes auto-generated accessibility alt text, not the actual caption. Reel captions were often fully exposed in alt text."),
      bullet("Like / comment counts and comment threads"),
      bullet("Follower / following lists"),
      bullet("Story content (stories expire; none currently saved as Highlights)"),
      bullet("DMs"),
      spacer(60),
      body("Obtaining full caption text for every photo would require opening each of the 156 posts individually and risks rate-limiting."),

      // FULL POST INVENTORY
      heading1("6. Full Post Inventory (156 posts)"),
      body("Format: #. Type  shortcode  —  caption / description"),
      body("Type key: Reel = video (alt text usually contains real caption); Photo = image/carousel (alt text is often Instagram’s auto-generated description)."),
      body("Permalink pattern: https://www.instagram.com/hybridvacations/p/{shortcode}/ (or /reel/{shortcode}/)."),
      spacer(80),

      heading2("Recent / Pinned & Flagship Posts"),
      postLine("41", "Photo", "Da2j3ShgIGN", "Jul 16, 2026 — “WELCOME to HYBRID Padel — MALLORCA 5th to 9th April 2027 — WEBSITE LAUNCHING END OF JULY” (pinned)"),
      postLine("42", "Reel", "DZFnfQuNGCs", "“YEAR 2 IS HERE 🌋☀️🏐 Official launch Hybrid Lanzarote Camp 2027 with @beachvolleycamps.ch. Early Bird until 1st August.”"),
      postLine("43", "Photo", "DcA8iyugD2w", "Aug 14, 2026 — “A DAY AT HYBRID PADEL CAMP — MALLORCA — APRIL 2027”"),
      postLine("44", "Photo", "Db5uRIMADoP", "Aug 11, 2026 — “Expectation vs Reality” beach volleyball"),
      postLine("45", "Photo", "DbxipodgCld", "Aug 8, 2026 — “PADEL DONE DIFFERENTLY — MALLORCA — APRIL 2027”"),
      postLine("46", "Photo", "—", "Hybrid Tennis “Coming April 2027” Mallorca graphic"),

      heading2("Coach Introduction Series (“Two Truths and a Lie”)"),
      postLine("1", "Reel", "DPYTtEvCBeU", "Finale with Coach @_marthab — join Martha & coaches Jan/Feb in Lanzarote"),
      postLine("6", "Reel", "DOvFZ26iIWK", "Issa — Two Truths and a Lie, Lanzarote coaches"),
      postLine("10", "Reel", "DOiIOSvCPaE", "Dave — Two Truths, One Lie"),
      body("(Additional coach spotlight reels appear throughout the feed featuring Katya, Marco, Jan, Gianluca, Bocho, Mateusz and Mark.)"),

      heading2("Lanzarote & Flagship Experience Content"),
      postLine("9", "Reel", "DOp7ytjiEKI", "“Training hard by day, recharging by sunset 🌅🏐 Lanzarote vibes = next-level recovery”"),
      postLine("31", "Reel", "DMw9Ogbo-jf", "“It’s finally here. Say hello to your dream volleyball escape 🏐 Sand courts by the sea 🌴 Group training in paradise”"),
      postLine("27", "Reel", "DNECTryoIot", "Joining forces with @beachvolleycamps.ch"),
      postLine("24", "Reel", "DNVPZBlI3OQ", "Elite prep — Hybrid (aka @mgarciakidd)"),
      postLine("2", "Photo", "DPTREV8iOB3", "Puerto Del Carmen, Lanzarote"),
      postLine("7", "Photo", "DO0Xlz4iHnj", "Puerto Del Carmen, Lanzarote"),
      postLine("13", "Photo", "DOQUaKVAEWk", "Puerto Del Carmen, Lanzarote"),
      postLine("23", "Photo", "DNaPsB_oEYu", "Puerto Del Carmen, Lanzarote"),
      postLine("28", "Photo", "DM-ohOvodLs", "Puerto Del Carmen, Lanzarote"),
      postLine("30", "Photo", "DMzpzUaI1aG", "Puerto Del Carmen, Lanzarote"),
      postLine("157", "Photo", "DP3IKuAiN89", "Puerto Del Carmen, Lanzarote"),

      heading2("Community, Friendship & Travel"),
      postLine("15", "Reel", "DOLCRQ1CD8N", "“The best friendships can come from total strangers…”"),
      postLine("32", "Reel", "DMD3bg5A95u", "“Good friends. Great adventures. Unforgettable memories.”"),
      postLine("33", "Reel", "DLXmdYeI41i", "Secret escapes with good friends — #travelhybrid #neverstopexploring"),
      postLine("34", "Reel", "DKxQtNco4SH", "Switzerland 🇨🇭 Lakes, mountains, friends, sports — thank you @beachvolleycamps.ch"),

      heading2("Grid Mosaic Branding Stunt (May 2025)"),
      postLine("35–40", "Photo", "DJyZ… series", "Eight-post mosaic whose thumbnails combine into a giant “HYBRID Vacations” wordmark across the grid"),

      heading2("Additional Destinations & Moments"),
      postLine("14", "Photo", "DOLyAvLDEIR", "Reposted from @flow_beachsports, Alaçatı (Turkey)"),
      postLine("148", "Photo", "DQtzH2jCCap", "Hammamet, Tunisia"),
      postLine("150", "Photo", "DQg1cYbiCrT", "Peru"),
      postLine("154", "Photo", "DQJUy53gKJS", "Izmir Çeşme (Turkey)"),
      postLine("149", "Reel", "DQou2CCAPzS", "“When influencers meet iconic moments… Hybrid keeps it real!”"),
      postLine("152", "Reel", "DQWhek6ALQA", "Underdog story under the Lanzarote sun"),
      postLine("146", "Reel", "DQ4RAMFCEXx", "Junior beach volleyball camp for February half-term 2026"),
      postLine("156", "Reel", "DP8R5o2CCB8", "“From coastlines to court lines, Tennis is on the horizon.” #HybridTennis #CoastlinesToCourtlines"),

      spacer(80),
      callout("Inventory Note", [
        "The numbered list above highlights the most strategically relevant posts. The original scrape captured all 156 unique post URLs. A small number of items were numbered slightly beyond 156 due to duplicate-safe merges while scrolling; all unique posts on the profile were captured.",
        "Full raw shortcode inventory remains available in the source scrape for reference."
      ]),

      // STRATEGIC TAKEAWAYS
      heading1("7. Strategic Takeaways for Marketing & Website"),
      bodyBold("1. Personality is the engine"),
      body("Coaches (especially Mark and the “Two Truths” series) humanise the brand. This should be carried into the website and always-on content."),
      bodyBold("2. Referral codes already exist"),
      body("Dave15, Katie15, Martha15, Katya15, Issa15 form a ready foundation for a formal ambassador programme with tracking and landing pages."),
      bodyBold("3. Multi-sport expansion is live"),
      body("Padel and Tennis launches for Mallorca April 2027 are already in the feed — the brand architecture needs to support them clearly."),
      bodyBold("4. Partnerships are visible and active"),
      body("@beachvolleycamps.ch, Fireball, Level Up and others should be formalised and featured on the site where appropriate."),
      bodyBold("5. Humour + premium can coexist"),
      body("Expectation vs Reality and self-aware content sit alongside aspirational destination imagery. The website should keep this balance: premium execution + human personality."),
      bodyBold("6. Content pillars are already clear"),
      body("Personality, Humour, Destination, Performance, Community, Sales — these map directly to the recommended website and social strategy in the Master Profile."),
      spacer(120),
      quoteBlock("The Instagram feed already demonstrates the Hybrid ecosystem in action: coaches, destinations, community, multi-sport expansion and commercial CTAs working together. The task is to make the website and broader marketing feel like the same coherent system."),
      spacer(200),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: "HYBRID", bold: true, size: 28, font: "Arial", color: BLACK })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Travel Through What You Love.", size: 18, font: "Arial", color: MED_GREY })]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/workdir/artifacts/Hybrid_Instagram_Scrape_Curated.docx", buffer);
  console.log("Document created successfully");
});
