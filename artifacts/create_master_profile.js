const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
        BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber,
        PageBreak, convertInchesToTwip } = require('docx');
const fs = require('fs');

// Brand colours
const MINT = "70CFCB";
const BLACK = "12272F";
const WHITE = "FFFFFF";
const LIGHT_MINT = "E8F7F6";
const SOFT_GREY = "F5F7F8";
const MED_GREY = "6B7C85";

const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: MINT };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const mintBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const noneBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

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
    spacing: { after: 140, line: 276 },
    children: [new TextRun({ text, size: 20, font: "Arial", color: BLACK })]
  });
}

function bodyBold(text) {
  return new Paragraph({
    spacing: { after: 140, line: 276 },
    children: [new TextRun({ text, size: 20, font: "Arial", color: BLACK, bold: true })]
  });
}

function italicBody(text) {
  return new Paragraph({
    spacing: { after: 140, line: 276 },
    children: [new TextRun({ text, size: 20, font: "Arial", color: BLACK, italics: true })]
  });
}

function bullet(text, ref = "bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 60, line: 276 },
    children: [new TextRun({ text, size: 20, font: "Arial", color: BLACK })]
  });
}

function numbered(text, ref = "numbers") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 60, line: 276 },
    children: [new TextRun({ text, size: 20, font: "Arial", color: BLACK })]
  });
}

function callout(title, content) {
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
                spacing: { after: 80 },
                children: [new TextRun({ text: title, bold: true, size: 18, font: "Arial", color: BLACK })]
              }),
              ...content.map(t => new Paragraph({
                spacing: { after: 40 },
                children: [new TextRun({ text: t, size: 18, font: "Arial", color: BLACK })]
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
            margins: { top: 140, bottom: 140, left: 200, right: 160 },
            children: [
              new Paragraph({
                spacing: { after: 0 },
                children: [new TextRun({ text, size: 20, font: "Arial", color: BLACK, italics: true })]
              })
            ]
          })
        ]
      })
    ]
  });
}

function spacer(after = 120) {
  return new Paragraph({ spacing: { after }, children: [] });
}

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 20 }
      }
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: BLACK },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: BLACK },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 }
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Arial", color: "1A3A45" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "numbers",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "numbers2",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "phase1",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "phase2",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "phase3",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "phase4",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "phase5",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "diff",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "rev",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "conc",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  sections: [
    // ========== COVER ==========
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children: [
        spacer(1200),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new TextRun({ text: "HYBRID VACATIONS", bold: true, size: 48, font: "Arial", color: BLACK })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: MINT, space: 1 } },
          children: [new TextRun({ text: " ", size: 8 })]
        }),
        spacer(200),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [new TextRun({ text: "Master Company, Brand & Marketing Profile", size: 28, font: "Arial", color: BLACK })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [new TextRun({ text: "Version 1.0  ·  20 August 2026", size: 20, font: "Arial", color: MED_GREY })]
        }),
        spacer(200),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new TextRun({ text: "Working Strategic Document", italics: true, size: 20, font: "Arial", color: BLACK })]
        }),
        spacer(600),
        callout("Purpose", [
          "Build a comprehensive understanding of Hybrid Vacations — its people, products, customers, brand, marketing activity and growth opportunities. This document is the foundational knowledge base for the website redesign, marketing strategy and future AI automation systems."
        ]),
        spacer(800),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "SPORT  ×  TRAVEL  ×  COMMUNITY  ×  ADVENTURE", bold: true, size: 18, font: "Arial", color: MINT })]
        }),
        new Paragraph({ children: [new PageBreak()] }),

        // ========== 1. EXECUTIVE SUMMARY ==========
        heading1("1. Executive Summary"),
        body("Hybrid Vacations is a sports and travel business built around a simple but potentially powerful combination:"),
        spacer(80),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 160 },
          children: [new TextRun({ text: "SPORT × TRAVEL × COMMUNITY × ADVENTURE", bold: true, size: 24, font: "Arial", color: BLACK })]
        }),
        body("The business currently has its strongest presence in beach volleyball, with tennis and padel emerging as additional sports verticals."),
        body("Hybrid’s proposition goes beyond simply organising sports camps. The brand combines:"),
        bullet("Sporting development"),
        bullet("Coaching"),
        bullet("Travel"),
        bullet("Destination experiences"),
        bullet("Social connection"),
        bullet("Community"),
        bullet("Adventure"),
        bullet("International sporting networks"),
        spacer(60),
        body("There is also a significant UK-based coaching and events opportunity, particularly around London. Mark Garcia-Kidd offers private coaching sessions, clinics and mini-camps, with activity primarily around London but potentially elsewhere in the UK."),
        body("This creates a much broader ecosystem than a conventional sports holiday company."),
        spacer(80),
        heading2("Working Strategic Interpretation"),
        quoteBlock("A premium sports-travel and community brand that enables people to travel through the sports they love."),
        spacer(120),
        body("The strongest opportunity is to make HYBRID the master brand, with beach volleyball, tennis, padel, coaching and other future sports operating as connected parts of the same ecosystem."),

        // ========== 2. WHAT IS HYBRID ==========
        heading1("2. What Is Hybrid Vacations?"),
        heading2("Current Perception"),
        body("Hybrid Vacations currently presents itself primarily as a company providing sports-focused holidays and experiences."),
        body("Its social presence is particularly strong around:"),
        bullet("Beach volleyball"),
        bullet("Lanzarote"),
        bullet("Coaching"),
        bullet("International destinations"),
        bullet("Community"),
        bullet("Athlete/coach personalities"),
        bullet("Sports camps"),
        spacer(60),
        body("However, the business appears to be evolving rapidly. The addition of tennis and padel, alongside UK coaching, clinics, mini-camps and performance activity, suggests that Hybrid is becoming a broader sports lifestyle business."),

        // ========== 3. THE HYBRID CONCEPT ==========
        heading1("3. The Hybrid Concept"),
        body("The name “Hybrid” gives the business considerable strategic territory. It represents combinations such as:"),
        spacer(40),
        bodyBold("Sport + Travel"),
        body("Travel to destinations because of the sport you love."),
        bodyBold("Training + Holiday"),
        body("Improve your game without sacrificing the enjoyment of being somewhere amazing."),
        bodyBold("Performance + Adventure"),
        body("Take your sport seriously while experiencing a destination."),
        bodyBold("Individual + Community"),
        body("Arrive as an individual and become part of a group."),
        bodyBold("Local + International"),
        body("Connect UK-based sporting communities with international experiences."),
        bodyBold("Professional + Amateur"),
        body("Access high-quality coaching without the brand feeling exclusively elite."),
        bodyBold("Sport + Lifestyle"),
        body("Sport becomes the gateway to travel, friendships and experiences."),

        // ========== 4. BRAND ARCHITECTURE ==========
        heading1("4. Brand Architecture"),
        body("The long-term brand architecture could be:"),
        spacer(60),
        bodyBold("HYBRID — Master brand"),
        spacer(40),
        bodyBold("Hybrid Vacations"),
        body("Sports travel and destination experiences."),
        bodyBold("Hybrid Beach Volleyball"),
        body("Beach volleyball camps, performance, clinics and community."),
        bodyBold("Hybrid Tennis"),
        body("Tennis camps, coaching and destination experiences."),
        bodyBold("Hybrid Padel"),
        body("Padel camps and destination experiences."),
        bodyBold("Hybrid Coaching"),
        body("Private coaching, clinics, mini-camps and performance development."),
        bodyBold("Mark Garcia-Kidd"),
        body("Founder, coach, personality, authority and community connector."),
        spacer(60),
        body("This structure allows Hybrid to expand into additional sports without rebuilding the brand from scratch."),

        // ========== 5. MARK GARCIA-KIDD ==========
        heading1("5. Mark Garcia-Kidd"),
        body("Mark is potentially one of Hybrid’s biggest competitive advantages."),
        body("A traditional travel company can copy destinations, hotels, camp formats, booking systems and advertising. It is much harder to copy:"),
        bullet("Personal reputation"),
        bullet("Coaching expertise"),
        bullet("Sporting network"),
        bullet("Relationships"),
        bullet("Personality"),
        bullet("Community trust"),
        bullet("Authenticity"),
        spacer(60),
        body("Mark therefore shouldn’t simply appear as “the person behind the company”. His personal brand could become an important part of the acquisition strategy."),
        heading2("Potential Mark Content"),
        bullet("Coaching tips & training advice"),
        bullet("Technical breakdowns & player development"),
        bullet("Destination recommendations"),
        bullet("Behind-the-scenes Hybrid content"),
        bullet("Coach and athlete interviews"),
        bullet("Travel advice & tournament content"),
        bullet("Funny sporting stories & Q&A / “Ask Mark”"),
        bullet("Camp preparation & what to expect"),
        spacer(60),
        body("The combination of Mark + Hybrid gives the business both a human face and a scalable commercial brand."),

        // ========== 6. COMMERCIAL PILLARS ==========
        heading1("6. Commercial Pillars"),
        body("Hybrid appears to have four major commercial pillars."),
        heading2("6.1 Sports Vacations"),
        body("Current and emerging destinations include:"),
        bullet("Lanzarote"),
        bullet("Gstaad"),
        bullet("Mallorca"),
        bullet("Future European destinations"),
        bullet("Potential future international destinations"),
        spacer(40),
        body("Sports include beach volleyball, tennis and padel."),
        heading2("6.2 Coaching & Performance"),
        body("This is an important area that should receive greater prominence. Potential offerings include:"),
        bullet("1-to-1 private coaching"),
        bullet("Pairs & small-group coaching"),
        bullet("Clinics & mini-camps"),
        bullet("Performance training"),
        bullet("Junior & competitive player development"),
        bullet("Performance squads"),
        spacer(40),
        bodyBold("UK Opportunity"),
        body("Mark provides private coaching primarily around London, with potential sessions elsewhere in the UK. This creates a completely different customer acquisition mechanism from international holidays. Someone might discover Mark through a local coaching session and eventually become a Hybrid Vacations customer."),

        // ========== 7. CLINICS ==========
        heading1("7. Clinics & Mini-Camps"),
        body("Clinics and mini-camps are strategically important because they sit between private coaching and international sports holidays. They can provide:"),
        bullet("Lower-cost entry & shorter commitment"),
        bullet("Community building & coach exposure"),
        bullet("Lead generation & content opportunities"),
        bullet("Repeat engagement"),
        spacer(60),
        body("A potential customer journey becomes:"),
        quoteBlock("Free content → Local clinic → Mini-camp → International camp → Repeat customer → Ambassador"),

        // ========== 8. PRODUCT PORTFOLIO ==========
        heading1("8. Known Product Portfolio"),
        heading2("Lanzarote Beach Volleyball"),
        body("Currently the strongest Hybrid proposition. Key positioning:"),
        bullet("Playa Grande / Puerto del Carmen, Canary Islands"),
        bullet("Winter sunshine, beach volleyball, coaching, community"),
        bullet("Destination experience — more than a sports camp; it is an escape"),
        body("The 2027 campaign is already being promoted."),
        heading2("Gstaad Beach Volleyball"),
        body("A more premium and aspirational proposition:"),
        bullet("Switzerland, alpine scenery, high-quality courts"),
        bullet("Professional sporting environment"),
        bullet("The combination of beach volleyball and the Swiss Alps is highly differentiated visually"),
        heading2("Mallorca Tennis"),
        body("Emerging product. Location: Capdepera / Font de Sa Cala, Mallorca."),
        body("Positioning includes “Coastlines & Courtlines” — combining tennis, coaching, Mediterranean setting, community, travel and relaxation."),
        heading2("Mallorca Padel"),
        body("Emerging product. Instagram activity indicates Mallorca — April 2027. Positioning appears deliberately different from a conventional padel holiday."),
        heading2("Junior / Performance"),
        body("Social inventory demonstrates activity around junior camps, performance camps, advanced clinics, performance squads and competitive players. This could eventually become its own important commercial segment."),

        // ========== 9. UK COACHING ==========
        heading1("9. UK Coaching Opportunity"),
        body("This should be treated as a major strategic pillar rather than a side offering."),
        bodyBold("Core proposition: High-quality sports coaching without needing to travel internationally."),
        body("Primarily London / South East England, but potentially wider UK."),
        body("Potential services:"),
        bullet("Private sessions & small groups"),
        bullet("Clinics & mini-camps"),
        bullet("Performance & junior sessions"),
        bullet("Club sessions & corporate/team events"),
        bullet("Tournament preparation"),
        spacer(40),
        body("This creates an important bridge between local and international Hybrid."),

        // ========== 10. CUSTOMER SEGMENTS ==========
        heading1("10. Customer Segments"),
        heading2("10.1 Active Adult Traveller"),
        body("Someone who loves sport, wants to travel, wants to improve, wants to meet people, and wants something more interesting than a standard holiday."),
        heading2("10.2 Solo Traveller"),
        body("Potentially one of Hybrid’s strongest opportunities. The customer doesn’t necessarily have a group of friends who play the same sport. Hybrid provides the group."),
        quoteBlock("Come alone. Leave with friends."),
        heading2("10.3 Existing Sports Groups"),
        body("Volleyball clubs, tennis clubs, padel groups, teams, university societies, social sports communities, performance squads."),
        body("Potential offer: “Bring your club to Hybrid.”"),
        heading2("10.4 Competitive Athlete"),
        body("Motivated by coaching quality, performance, training environment, high-level partners and competitive development."),
        heading2("10.5 Lifestyle Traveller"),
        body("Primarily attracted by sunshine, destination, adventure and social environment. Sport becomes the vehicle."),
        heading2("10.6 Juniors & Parents"),
        body("Potential future segment around junior camps, performance development, coaching and competitive opportunities."),

        // ========== 11. EMOTIONAL PRODUCT ==========
        heading1("11. The Emotional Product"),
        body("The functional product is a sports holiday / camp / coaching session."),
        body("The emotional product is:"),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 80, after: 160 },
          children: [new TextRun({ text: "Belonging + Achievement + Adventure", bold: true, size: 24, font: "Arial", color: BLACK })]
        }),
        body("Customers should leave thinking:"),
        bullet("“I improved.”"),
        bullet("“I met people.”"),
        bullet("“I experienced somewhere amazing.”"),
        bullet("“I did something different.”"),
        bullet("“I became part of something.”"),
        spacer(40),
        body("This is potentially much more powerful than simply selling a holiday."),

        // ========== 12. CUSTOMER JOURNEY ==========
        heading1("12. Potential Customer Journey"),
        body("A long-term Hybrid customer journey could look like:"),
        spacer(40),
        bodyBold("DISCOVER  →  Social content / Google / referral"),
        bodyBold("ENGAGE  →  Website / content / community"),
        bodyBold("TRY  →  Local clinic / private coaching"),
        bodyBold("DEEPEN  →  Mini-camp"),
        bodyBold("TRAVEL  →  International Hybrid camp"),
        bodyBold("RETURN  →  Another camp / coaching / event"),
        bodyBold("ADVOCATE  →  Referral / ambassador / UGC"),
        spacer(60),
        body("This creates a much stronger relationship than a one-off holiday booking."),

        // ========== 13. DIFFERENTIATORS ==========
        heading1("13. Brand Differentiators"),
        body("Potential competitive advantages include:"),
        numbered("Mark’s coaching expertise", "diff"),
        numbered("Strong sporting network", "diff"),
        numbered("International coaches and athletes", "diff"),
        numbered("Community", "diff"),
        numbered("Personality & humour", "diff"),
        numbered("Unique destinations", "diff"),
        numbered("Multi-sport potential", "diff"),
        numbered("Local-to-international customer journey", "diff"),
        numbered("Authentic sports culture", "diff"),
        spacer(40),
        body("The key is to make these advantages visible rather than hiding them behind generic travel-company language."),

        // ========== 14. COMMUNITY ==========
        heading1("14. Community"),
        body("Community is potentially the most important long-term asset. Instagram activity repeatedly shows friends, coaches, athletes, partners, groups, reposts, sporting communities and international relationships."),
        spacer(40),
        quoteBlock("COACHES → PLAYERS → CAMPS → CONTENT → COMMUNITY → NEW PLAYERS → MORE CAMPS"),
        spacer(80),
        body("The community itself becomes part of the product."),

        // ========== 15. PARTNERS ==========
        heading1("15. Partner Ecosystem"),
        body("The Instagram scrape demonstrates relationships with organisations and accounts including:"),
        bullet("Beachvolleycamps.ch"),
        bullet("Fireball Beach Volleyball"),
        bullet("Level Up Beach"),
        bullet("Flow Beach Sports"),
        bullet("Beach Volley Community"),
        bullet("Various international coaches, athletes and UK volleyball communities"),
        spacer(40),
        body("This network could potentially be formalised into a structured partner ecosystem."),

        // ========== 16. AMBASSADOR ==========
        heading1("16. Ambassador / Referral Programme"),
        body("The Instagram scrape shows personalised coach discount codes including Dave15, Katie15, Martha15, Katya15, Issa15. This is effectively the foundation of an ambassador programme."),
        body("A future system could include for each ambassador:"),
        bullet("Unique referral code & personal landing page"),
        bullet("Tracking link & commission"),
        bullet("Content assets & campaign materials"),
        bullet("Performance dashboard"),
        spacer(40),
        body("Potential ambassadors: coaches, players, club captains, influencers, tournament organisers, university societies."),

        // ========== 17. INSTAGRAM ==========
        heading1("17. Instagram Profile"),
        bodyBold("@hybridvacations"),
        body("Based on the scrape from 19 August 2026:"),
        bullet("Approximately 156 posts"),
        bullet("1,552 followers · 2,281 following"),
        bullet("Category: Travel company"),
        bullet("Bio: “Connecting communities through sport and travel.”"),
        body("The account links to Lanzarote Beach Volleyball Camp 2027 and Sports Vacations pre-registration."),

        // ========== 18. CONTENT PILLARS ==========
        heading1("18. Instagram Content Pillars"),
        body("The current content broadly falls into six categories:"),
        bodyBold("1. Personality — Coaches, athletes and founders"),
        bodyBold("2. Humour — Expectation vs Reality, Coach vs Coach, jokes and self-aware content"),
        bodyBold("3. Destination — Lanzarote, Mallorca, Gstaad and other locations"),
        bodyBold("4. Performance — Training, coaching, athletes and competitive sport"),
        bodyBold("5. Community — Friends, groups, partners and shared experiences"),
        bodyBold("6. Sales — Early Bird, launches, discount codes and booking CTAs"),

        // ========== 19. TONE ==========
        heading1("19. Instagram Tone of Voice"),
        body("Current tone: energetic, playful, cheeky, informal, sporty, community-focused, self-aware, emoji-heavy."),
        body("This personality is valuable."),
        spacer(40),
        callout("Important Redesign Principle", [
          "The new website should not become so premium that it loses the personality.",
          "Ideal direction: Premium execution + human personality.",
          "Not: Generic luxury travel company."
        ]),

        // ========== 20–21 SOCIAL ==========
        heading1("20. Social Strengths"),
        body("Current strengths include: human faces, coaches, athletes, destination imagery, video, humour, community, partnerships, international network and sporting credibility."),
        heading1("21. Social Opportunities"),
        bodyBold("More evergreen content"),
        body("Not every post needs to sell a camp. Examples: coaching tips, travel tips, destination guides, player stories, sport education, “What to expect”, FAQs, beginner advice."),
        bodyBold("More customer-generated content"),
        body("Customers should become part of the marketing engine."),
        bodyBold("Stronger testimonials"),
        body("Move from “Here’s our camp” towards “Here’s what happened to someone who came.”"),
        bodyBold("More persistent Story Highlights"),
        body("Potential categories: Lanzarote, Mallorca, Gstaad, Tennis, Padel, Coaching, Reviews, FAQ, Coaches, Community."),

        // ========== 22–23 CAMPAIGN ==========
        heading1("22. Current Marketing Pattern"),
        body("Observed campaign structure:"),
        quoteBlock("NEW EXPERIENCE → ANNOUNCEMENT → COACHES → DESTINATION → EARLY BIRD → REFERRAL CODES → URGENCY → FINAL BOOKING PUSH"),
        spacer(80),
        body("This works, but there is an opportunity to create a much more sophisticated lifecycle."),
        heading1("23. Recommended Campaign Lifecycle"),
        bodyBold("12 Weeks Before — Awareness"),
        body("“What is Hybrid?”"),
        bodyBold("10 Weeks — Destination"),
        body("“Why this place?”"),
        bodyBold("8 Weeks — Coaches"),
        body("“Meet the people you’ll train with.”"),
        bodyBold("7 Weeks — Community"),
        body("“Who comes to Hybrid?”"),
        bodyBold("6 Weeks — Experience"),
        body("“What does a day at Hybrid actually look like?”"),
        bodyBold("5 Weeks — Social Proof"),
        body("Customer stories."),
        bodyBold("4 Weeks — Objection Handling"),
        body("Can I come alone? What level do I need? What if I’m a beginner? What’s included? Where do I stay? How do I get there?"),
        bodyBold("3 Weeks — Product Detail"),
        body("Itinerary, accommodation, coaching, destination."),
        bodyBold("2 Weeks — Urgency"),
        body("Limited availability."),
        bodyBold("Final Week — Last Chance"),

        // ========== 24–26 WEBSITE ==========
        heading1("24. Website Strategy"),
        body("The new website should feel like a premium sports lifestyle brand rather than a traditional travel agency."),
        spacer(40),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: "TRAVEL THROUGH WHAT YOU LOVE.", bold: true, size: 26, font: "Arial", color: BLACK })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 160 },
          children: [new TextRun({ text: "SPORT. TRAVEL. COMMUNITY.", size: 20, font: "Arial", color: MINT })]
        }),
        body("Alternative: YOUR SPORT. YOUR PEOPLE. YOUR NEXT ADVENTURE."),
        heading1("25. Proposed Website Navigation"),
        bullet("EXPERIENCES — All camps and holidays"),
        bullet("COACHING — Private coaching, clinics and mini-camps"),
        bullet("DESTINATIONS — Lanzarote, Mallorca, Gstaad etc."),
        bullet("SPORTS — Beach Volleyball, Tennis, Padel"),
        bullet("COMMUNITY — People, coaches, stories and events"),
        bullet("ABOUT — Mark, Hybrid and the story"),
        heading1("26. Homepage Concept"),
        bodyBold("Hero"),
        body("Cinematic video. TRAVEL THROUGH WHAT YOU LOVE. Sport. Travel. Community. Explore Experiences."),
        bodyBold("Section 2 — MORE THAN A HOLIDAY. TRAIN. EXPLORE. CONNECT."),
        bodyBold("Section 3 — WHERE WILL YOU GO? Lanzarote · Gstaad · Mallorca"),
        bodyBold("Section 4 — WHAT DO YOU PLAY? Beach Volleyball · Tennis · Padel"),
        bodyBold("Section 5 — COMING ALONE? You won’t be alone for long."),
        bodyBold("Section 6 — MEET THE PEOPLE. Mark + coaches + athletes."),
        bodyBold("Section 7 — REAL PEOPLE. REAL EXPERIENCES. Customer stories."),
        bodyBold("Section 8 — FIND YOUR NEXT HYBRID. Interactive experience finder."),

        // ========== 27–29 EXPERIENCE ==========
        heading1("27. Experience Finder"),
        body("One potentially standout website feature would be Find Your Hybrid. Users answer: What sport? What level? Where? When? Solo or group? Performance or social? Budget? The website then recommends suitable experiences. This could eventually become an AI-powered experience advisor."),
        heading1("28. Experience Database"),
        body("Every Hybrid experience should ideally exist as structured data. Fields could include: sport, destination, dates, skill level, coaches, sessions, accommodation, pricing, availability, what’s included, what’s optional, travel information, partners, images, video, FAQs, reviews, booking link."),
        body("This would become extremely valuable for both the website and AI automation."),
        heading1("29. Important Travel Positioning"),
        body("A key distinction needs to remain clear: Hybrid’s sports experience versus travel logistics."),
        body("The sports camp should not imply that flights are automatically included if they aren’t. Hybrid may assist customers with travel arrangements, but the website should clearly distinguish what Hybrid provides from optional / customer-arranged travel. This avoids confusion and builds trust."),

        // ========== 30. AI ==========
        heading1("30. AI Marketing Architecture"),
        body("A future AI ecosystem could include multiple specialised agents:"),
        bodyBold("Content Brain"),
        body("Central knowledge base containing products, dates, destinations, coaches, pricing, brand voice, campaigns and historical content."),
        bodyBold("Content Agent"),
        body("Creates Instagram, TikTok concepts, blogs, emails, campaigns, video concepts and website copy."),
        bodyBold("Community Agent"),
        body("Finds clubs, players, communities, events and relevant social conversations."),
        bodyBold("Partnership Agent"),
        body("Identifies hotels, sports brands, tourism organisations, clubs, event organisers and potential sponsors."),
        bodyBold("Campaign Agent"),
        body("Takes a new camp and automatically builds campaign timeline, social posts, email sequence, blog content, paid-ad concepts, influencer outreach and ambassador assets."),
        bodyBold("Lead Agent"),
        body("Handles website enquiries, qualification, FAQs, matching customers to experiences, follow-up and CRM entry."),
        bodyBold("Analytics Agent"),
        body("Measures leads, bookings, conversion, campaign performance, referral performance, content performance and customer acquisition cost."),

        // ========== 31–34 ==========
        heading1("31. Social Outreach Opportunity"),
        body("A major opportunity exists around targeted outreach to volleyball clubs, tennis clubs, padel communities, universities, sports societies, tournament organisers, coaches, athletes, influencers, club captains and sports brands."),
        body("The goal should not simply be “send thousands of messages.” Instead: Identify the right person → understand them → determine the relevant Hybrid offer → personalise outreach → track relationship → follow up."),
        heading1("32. Partnership Automation"),
        body("An AI system could continuously identify potential partners — for example ranking UK beach-volleyball clubs by suitability for a Lanzarote partnership, or finding creators whose audience matches Hybrid’s target customer. This turns business development into a scalable process."),
        heading1("33. SEO Strategy"),
        body("Potential search opportunities include combinations of [SPORT] + [DESTINATION], such as:"),
        bullet("Beach volleyball camp Lanzarote / holidays Europe / winter camp / Spain / Canary Islands"),
        bullet("Tennis camp / holiday / coaching Mallorca / adult tennis camp Spain"),
        bullet("Padel camp / holiday / retreat Mallorca / Spain"),
        bullet("Sports holidays Europe / active holidays Spain / sports travel / adventure sports holidays"),
        body("Long term, [SPORT] + [DESTINATION] could become a scalable SEO architecture."),
        heading1("34. Revenue Expansion"),
        body("Potential future revenue streams include:"),
        numbered("Sports camp bookings", "rev"),
        numbered("Private coaching, clinics, mini-camps", "rev"),
        numbered("Junior programmes & premium packages", "rev"),
        numbered("Accommodation upgrades, transfers, travel assistance", "rev"),
        numbered("Private group experiences & club trips", "rev"),
        numbered("Merchandise, ambassador commissions, brand sponsorship", "rev"),
        numbered("Hotel & tourism partnerships, future sports verticals", "rev"),

        // ========== 35–36 FLYWHEELS ==========
        heading1("35. Local → International Flywheel"),
        body("One particularly interesting strategic model is:"),
        quoteBlock("LOCAL (Private coaching) → COMMUNITY (Clinics) → MINI (Mini-camps) → INTERNATIONAL (Sports vacations) → COMMUNITY (New friends) → LOCAL (Continued coaching) → INTERNATIONAL (Repeat trips)"),
        spacer(80),
        body("This could dramatically increase customer lifetime value."),
        heading1("36. Strategic Growth Flywheel"),
        quoteBlock("GREAT EXPERIENCE → HAPPY CUSTOMERS → UGC → SOCIAL CONTENT → COMMUNITY GROWTH → MORE BOOKINGS → MORE EXPERIENCES → MORE COACHES & PARTNERS → BETTER EXPERIENCES → REPEAT CUSTOMERS"),

        // ========== 37–39 BRAND ==========
        heading1("37. Brand Personality"),
        body("Hybrid should feel: adventurous, energetic, welcoming, expert, playful, human, international, ambitious."),
        body("But should avoid becoming: corporate, pretentious, generic, overly luxurious, elite-only."),
        quoteBlock("The sweet spot is: Premium without being pretentious."),
        heading1("38. Working Brand Philosophy"),
        body("Hybrid isn’t selling a hotel room, a flight, or even really a volleyball session."),
        body("It is selling an experience people will remember — and more importantly, people they will remember experiencing it with."),
        heading1("39. Working Big Idea"),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 80, after: 40 },
          children: [new TextRun({ text: "HYBRID", bold: true, size: 36, font: "Arial", color: BLACK })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [new TextRun({ text: "Travel Through What You Love.", bold: true, size: 24, font: "Arial", color: BLACK })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 160 },
          children: [new TextRun({ text: "SPORT. TRAVEL. COMMUNITY.", size: 20, font: "Arial", color: MINT })]
        }),
        body("This potentially gives the entire company a coherent narrative. Beach volleyball is the strongest current expression. Tennis demonstrates expansion. Padel demonstrates further expansion. Coaching creates recurring engagement. Community becomes the moat. Travel becomes the setting. Sport becomes the reason people come together."),

        // ========== 40. EVIDENCE ==========
        heading1("40. Evidence Status"),
        heading2("Confirmed / Directly Supported"),
        bullet("Sports camps exist; beach volleyball is the strongest current visible product"),
        bullet("Tennis and padel are emerging verticals; Lanzarote is a flagship destination"),
        bullet("Gstaad is an important beach-volleyball destination"),
        bullet("Coach and partner networks are central to the social activity"),
        bullet("Personalised coach discount codes have been used"),
        bullet("Hybrid operates in the sports/travel space"),
        bullet("Flights should not be represented as automatically included in camp packages"),
        bullet("Mark offers private coaching; clinics and mini-camps are part of the wider proposition"),
        bullet("UK activity, particularly around London, is relevant"),
        heading2("Strong Inferences"),
        bullet("Community is one of Hybrid’s greatest competitive assets"),
        bullet("The coach network could support a formal ambassador programme"),
        bullet("Hybrid is evolving into a multi-sport platform"),
        bullet("Mark’s personal brand could significantly increase authority and acquisition"),
        bullet("Solo travellers are an important customer opportunity"),
        bullet("Local coaching could feed international camp bookings (and vice versa)"),
        bullet("Customer-generated content could become a major acquisition channel"),
        heading2("Strategic Opportunities"),
        bullet("Premium website redesign & experience finder"),
        bullet("Structured experience database & AI content engine"),
        bullet("AI community discovery & partnership prospecting"),
        bullet("Ambassador platform & automated campaign generation"),
        bullet("Personalised lead qualification & multi-sport platform"),
        bullet("Scalable SEO architecture & customer referral engine"),
        bullet("Mark personal-brand strategy"),

        // ========== 41. WORKSTREAMS ==========
        heading1("41. Recommended Next Workstreams"),
        heading2("Phase 1 — Intelligence"),
        numbered("Complete full website analysis", "phase1"),
        numbered("Map every product, destination and competitor", "phase1"),
        numbered("Analyse pricing, customer reviews and social competitors", "phase1"),
        numbered("Analyse Mark’s personal brand and current customer acquisition channels", "phase1"),
        heading2("Phase 2 — Brand"),
        numbered("Define brand positioning, messaging and customer personas", "phase2"),
        numbered("Define tone of voice and visual direction", "phase2"),
        numbered("Define Hybrid brand architecture and relationship between Hybrid and Mark", "phase2"),
        heading2("Phase 3 — Website"),
        numbered("Full sitemap, homepage, experience / destination / sports pages", "phase3"),
        numbered("Coaching, private coaching, clinics, mini-camps pages", "phase3"),
        numbered("Community, About, FAQ, Reviews", "phase3"),
        numbered("Experience finder, lead capture, booking architecture", "phase3"),
        heading2("Phase 4 — Marketing"),
        numbered("12-month campaign calendar, social / email / SEO / content strategy", "phase4"),
        numbered("Ambassador, partnership and customer referral programmes", "phase4"),
        numbered("UGC strategy", "phase4"),
        heading2("Phase 5 — AI Automation"),
        numbered("Central Hybrid knowledge base", "phase5"),
        numbered("Content generation, social research, community discovery agents", "phase5"),
        numbered("Partnership discovery, outreach, lead qualification, campaign and analytics agents", "phase5"),
        numbered("CRM integration", "phase5"),

        // ========== 42. FINAL VIEW ==========
        heading1("42. Final Strategic View"),
        body("The biggest opportunity is not simply to make Hybrid Vacations’ website look better. The opportunity is to turn the business into a much more coherent ecosystem."),
        body("Today, the business can appear as a collection of camps, destinations, coaches, social posts, partnerships, coaching sessions, clinics and sports."),
        body("The future version should make all of those things feel like parts of one system."),
        spacer(80),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 160 },
          children: [new TextRun({ text: "HYBRID IS WHERE SPORT, TRAVEL AND COMMUNITY MEET.", bold: true, size: 22, font: "Arial", color: BLACK })]
        }),
        body("A customer can discover Hybrid through a Mark coaching session. They can meet the community through a clinic. They can join a mini-camp. They can travel to Lanzarote. They can meet new friends. They can return to London and continue coaching. They can book Mallorca. They can bring their club. They can become an ambassador."),
        body("That is much bigger than a sports holiday company."),
        spacer(60),
        quoteBlock("That is the Hybrid ecosystem."),

        // ========== APPENDIX ==========
        new Paragraph({ children: [new PageBreak()] }),
        heading1("Appendix A — Extended Digital Intelligence & Brand Research"),
        body("Research update: 20 August 2026"),
        body("This appendix adds information discovered through further online research following the creation of the main Hybrid Vacations Master Profile. The purpose is to capture newly discovered information, external validation, historical context and strategic implications without overwriting information already contained in the main profile."),

        heading2("A1. Expanded Understanding of the Hybrid Business"),
        body("Further research suggests that Hybrid Vacations should not be understood purely as a sports-holiday operator. The business appears to sit across three connected areas:"),
        bodyBold("1. Hybrid Vacations — Travel"),
        body("A travel-agency proposition capable of arranging custom travel, group travel, complex itineraries, travel arrangements and sports-related trips."),
        bodyBold("2. Hybrid Sports Experiences"),
        body("Hybrid’s own sporting experiences, including beach volleyball camps, tennis camps, padel experiences, performance camps, junior programmes and sports-focused holidays."),
        bodyBold("3. Mark Garcia-Kidd — Coaching & Sporting Authority"),
        body("Mark’s personal professional activity creates another layer: private coaching, small-group coaching, clinics, mini-camps, performance development, athlete development, sporting events and international volleyball experience."),
        body("These three areas can potentially feed one another."),

        heading2("A2. Mark Garcia-Kidd — Expanded Professional Profile"),
        body("Further research significantly strengthens the understanding of Mark’s background. He is not simply the founder of a sports travel company. He has a substantial history within competitive beach volleyball, coaching, athlete development and sporting events."),
        body("His documented experience includes connections with England beach volleyball, Volleyball England, international competition, coaching, athlete development, sporting events, beach-volleyball clubs and sports travel. He has also been featured in volleyball-related media and podcast content."),
        callout("Strategic Implication", [
          "Mark’s sporting credentials should be treated as a core Hybrid asset. The website should communicate that Hybrid is built by people who genuinely understand the sports they are selling. This creates an important distinction from conventional travel companies entering the sports-holiday market."
        ]),

        heading2("A3. Mark’s International Sporting Credentials"),
        body("External sporting records provide evidence of Mark’s participation in international beach volleyball. Volleyball World maintains a player profile for Mark Garcia-Kidd, documenting his involvement as an England beach-volleyball player. His history also includes involvement with England’s beach-volleyball programme and Volleyball England."),
        body("The new website should avoid making unsupported claims such as “the world’s best coaches” unless each coach’s credentials are individually verified. Instead, the brand can confidently lean into the broader and more authentic message:"),
        quoteBlock("Built by people who have lived the sport."),

        heading2("A4. Volleyball England Connection"),
        body("Research identified historical Volleyball England material connecting Mark with project leadership, competitions, events, athlete programmes and England beach-volleyball activity. This indicates experience on the organisational side of sport as well — strategically valuable because Hybrid’s model combines Sport + Events + Travel + Community + Coaching."),

        heading2("A5. Media & Podcast Experience"),
        body("Mark has appeared in volleyball-related media, including VolleyChat (a Volleyball England podcast associated with coverage of the 2022 Commonwealth Games). This demonstrates that Mark has previously been positioned as a knowledgeable voice within the sport."),
        body("Potential future use: podcasts, interviews, expert commentary, YouTube, short-form educational videos, coaching content, tournament analysis, “Ask Mark” content and written expert articles."),

        heading2("A6. Mark’s Coaching Activity"),
        body("Further research supports the existence of Mark’s active coaching work: private coaching, clinics, small-group sessions, performance work, guest coaching and beach-volleyball development. External sporting organisations have promoted sessions featuring Mark as a guest coach. This reinforces that coaching should be treated as a meaningful commercial pillar."),

        heading2("A7. Deep Dish — Historical Relationship"),
        body("Mark has a significant historical connection with Deep Dish Beach, particularly within London’s beach-volleyball community (coaching, club activity, events, venues, athlete development, beach-volleyball programmes, sports travel)."),
        callout("Important Clarification", [
          "Deep Dish should be classified as a HISTORICAL relationship. Mark subsequently ended his chapter with Deep Dish. The current Hybrid brand should not describe Deep Dish as a current partner, employer, affiliate or collaborator unless a specific current relationship can be independently verified.",
          "Deep Dish is part of Mark’s professional history rather than Hybrid’s current partner ecosystem."
        ]),

        heading2("A8. How Mark’s Story Should Be Presented"),
        body("The Deep Dish history should not necessarily be removed from Mark’s story. Instead, it should be incorporated carefully:"),
        quoteBlock("Mark’s journey into Hybrid grew from years of competing, coaching and working within the UK and international beach-volleyball community. His experience spans international competition, coaching, events, athlete development and sporting travel — ultimately leading him to create Hybrid Vacations."),

        heading2("A9. Current vs Historical Relationships"),
        body("Going forward, all Hybrid research should classify relationships into three categories:"),
        bodyBold("🟢 CURRENT / ACTIVE — Relationships for which there is current evidence."),
        bodyBold("🟡 HISTORICAL — Useful for understanding history and credibility but should not automatically be presented as current (e.g. Deep Dish)."),
        bodyBold("⚪ UNCONFIRMED — Appear in historical social media or wider networks where a current relationship cannot yet be established."),

        heading2("A10. Hybrid + Beachvolleycamps.ch"),
        body("Research provides further confirmation of the relationship between Hybrid Vacations and Beachvolleycamps.ch. The Swiss organisation currently describes the Lanzarote camp as a collaboration involving Hybrid Vacations. This demonstrates access to an international beach-volleyball community across the UK and European markets."),
        body("Strategic opportunity: position Hybrid as a European sports community connected by travel, coaching and shared experiences — rather than simply “a UK company running sports holidays.”"),

        heading2("A11. Independent Third-Party Validation"),
        body("Hybrid and Mark appear across external sporting organisations (Volleyball England, Volleyball World, CEV, Beachvolleycamps.ch and others) rather than existing exclusively within their own marketing channels. This creates opportunities for third-party validation on the new website (“As featured in…”, “Our coaches have…”, “International experience”, etc.). Every individual claim should be verified before being published."),

        heading2("A12. Travel Package Clarification"),
        body("Further examination of the current Hybrid website confirms: flights are NOT automatically included in the Lanzarote sports camp. Customers are instructed to arrange their own flights. Hybrid’s proposition centres around the sports experience and associated travel/accommodation options. This should be made exceptionally clear on the redesigned website."),

        heading2("A13. Opportunity: “Build Your Hybrid”"),
        body("The flight situation could become a positive selling point. Rather than “Flights aren’t included,” the proposition could become:"),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 80, after: 80 },
          children: [new TextRun({ text: "BUILD YOUR HYBRID", bold: true, size: 24, font: "Arial", color: BLACK })]
        }),
        body("Choose your: Flights · Accommodation · Sports Experience · Coaching · Activities · Transfers / Travel Support. This could reinforce the wider travel-agency capability while maintaining flexibility."),

        heading2("A14. Mark’s Personal Brand as a Growth Engine"),
        body("The extended research strengthens the case for developing Mark Garcia-Kidd as a separate but connected personal brand:"),
        quoteBlock("MARK GARCIA-KIDD (Coach | Former International Player | Sports Entrepreneur) → HYBRID (Sports + Travel + Community) → HYBRID SPORTS (Beach Volleyball | Tennis | Padel) → HYBRID COACHING (Private Coaching | Clinics | Mini-Camps)"),
        spacer(80),
        body("This creates a brand ecosystem where Mark drives trust and authority while Hybrid provides scalability."),

        heading2("A15. Content Strategy Opportunity"),
        body("Mark provides an enormous amount of potential content that doesn’t require selling a holiday:"),
        bodyBold("Educational — How to improve, common mistakes, serving, passing, defence, positioning, tournament preparation, training programmes"),
        bodyBold("Personal — Career, England experience, travel & coaching stories, behind the scenes, funny experiences"),
        bodyBold("Hybrid — Why Hybrid exists, how camps work, meet the coaches, destination guides, customer stories, camp preparation"),
        bodyBold("Community — Player & coach profiles, tournament stories, club spotlights, partner features"),
        body("This creates an always-on content engine rather than relying exclusively on camp launches."),

        heading2("A16. Strategic Brand Evolution"),
        body("The extended research suggests Hybrid has the potential to evolve from “Sports Holiday Company” into a Sports Travel & Community Platform with four interconnected components: Sport, Travel, Coaching and Community."),

        heading2("A17. Potential Competitive Moat"),
        body("The strongest long-term competitive advantage may not be the camps themselves. Competitors can copy destinations, hotels, pricing, camp formats and social advertising. It is much harder to copy Mark’s reputation, coach network, player community, international relationships, customer history, content library, brand personality and trust."),
        quoteBlock("Community should be treated as a business asset, not simply a marketing concept."),

        heading2("A18. Recommended New Website Messaging"),
        body("Based on the expanded research, several messaging territories now appear particularly strong:"),
        bodyBold("Option 1 — TRAVEL THROUGH WHAT YOU LOVE. Sport. Travel. Community."),
        bodyBold("Option 2 — YOUR SPORT. YOUR PEOPLE. YOUR NEXT ADVENTURE."),
        bodyBold("Option 3 — WHERE SPORT BECOMES AN ADVENTURE."),
        bodyBold("Option 4 — MORE THAN A SPORTS HOLIDAY. Train. Explore. Connect."),
        bodyBold("Option 5 — COME FOR THE SPORT. STAY FOR THE PEOPLE."),
        body("This last concept particularly reinforces the community proposition."),

        heading2("A19. New Strategic Customer Journey"),
        quoteBlock("SOCIAL CONTENT → MARK / COACHING CONTENT → PRIVATE COACHING → CLINIC → MINI-CAMP → HYBRID SPORTS EXPERIENCE → INTERNATIONAL TRAVEL → REPEAT EXPERIENCE → AMBASSADOR → COMMUNITY LEADER"),
        spacer(80),
        body("This creates multiple opportunities to acquire a customer before asking them to purchase an expensive international trip."),

        heading2("A20. AI Opportunity"),
        body("The expanded research changes how the proposed AI system should be designed. Instead of simply promoting “Book our next camp,” it should understand the entire Hybrid ecosystem and act as a true Hybrid experience advisor — matching local coaching, clinics, camps and travel options to the customer’s situation."),

        heading2("A21. Research Confidence Framework"),
        body("For future updates, information should ideally be tagged: VERIFIED · HIGH CONFIDENCE · LIKELY · UNCONFIRMED · HISTORICAL. This will be particularly important if the document becomes the knowledge base for automated AI marketing."),

        heading2("A22. Key New Conclusions"),
        numbered("Mark’s sporting credibility is stronger than the current website appears to communicate.", "conc"),
        numbered("Hybrid’s roots are deeply embedded in the beach-volleyball community.", "conc"),
        numbered("International connections are a meaningful asset.", "conc"),
        numbered("Coaching is a commercially relevant pillar, not just an add-on.", "conc"),
        numbered("Deep Dish is important historical context but should not be presented as a current relationship.", "conc"),
        numbered("Hybrid is simultaneously a travel business and an owned sports-experience business.", "conc"),
        numbered("The distinction between Hybrid’s travel-agent services and its own sports experiences needs to be clearer.", "conc"),
        numbered("Flights should not be implied to be included in sports-camp packages.", "conc"),
        numbered("Mark’s personal brand could become a major acquisition channel.", "conc"),
        numbered("The ultimate opportunity is to build Hybrid as a sports-travel community rather than simply a collection of sports holidays.", "conc"),

        heading2("A23. Sources Identified During Extended Research"),
        bullet("Mark Garcia-Kidd — LinkedIn"),
        bullet("Volleyball England · Volleyball World · CEV"),
        bullet("University of East London"),
        bullet("Deep Dish Beach — historical material"),
        bullet("Beachvolleycamps.ch · SideOut · Beachboard / Dune Society"),
        bullet("Hybrid Vacations website, About page, Terms & Conditions, Lanzarote Camp page"),
        spacer(40),
        body("Important: Third-party references should be used primarily to substantiate credentials, history and external validation. Current commercial relationships should always be independently confirmed before being represented on the new website."),

        heading2("A24. Master Strategic Statement — Updated"),
        quoteBlock("Hybrid is a sports, travel and community brand built around the idea that the best way to experience the world is through the sports you love. Founded by former international beach-volleyball player and coach Mark Garcia-Kidd, Hybrid combines sporting expertise, destination experiences, coaching and community to create memorable experiences for players of different levels. Its ambition extends beyond individual sports camps: Hybrid has the potential to become a connected ecosystem spanning sports travel, coaching, events, clubs, communities and international sporting relationships."),
        spacer(200),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [new TextRun({ text: "HYBRID", bold: true, size: 36, font: "Arial", color: BLACK })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [new TextRun({ text: "Travel Through What You Love.", bold: true, size: 24, font: "Arial", color: BLACK })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new TextRun({ text: "SPORT. TRAVEL. COMMUNITY.", size: 20, font: "Arial", color: MINT })]
        })
      ],
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: MINT, space: 4 } },
              spacing: { after: 120 },
              children: [
                new TextRun({ text: "HYBRID VACATIONS", bold: true, size: 16, font: "Arial", color: BLACK }),
                new TextRun({ text: "  ·  Master Profile", size: 16, font: "Arial", color: MED_GREY })
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
              spacing: { before: 80 },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Confidential  ·  Working Strategic Document  ·  Page ", size: 16, font: "Arial", color: MED_GREY }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, font: "Arial", color: MED_GREY })
              ]
            })
          ]
        })
      }
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/workdir/artifacts/Hybrid_Master_Profile_Curated.docx", buffer);
  console.log("Document created successfully");
});
