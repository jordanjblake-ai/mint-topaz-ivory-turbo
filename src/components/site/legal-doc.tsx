import { company, type LegalSection } from "@/data/legal";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import type { ReactNode } from "react";

export function LegalDoc({
  kicker,
  title,
  intro,
  sections,
  children,
}: {
  kicker: string;
  title: string;
  intro: string;
  sections: LegalSection[];
  children?: ReactNode;
}) {
  return (
    <main>
      <Section>
        <Container className="max-w-3xl">
          <Kicker>{kicker}</Kicker>
          <Display as="h1" className="mt-2 text-5xl sm:text-6xl">{title}</Display>
          <p className="mt-5 text-sm leading-relaxed text-muted">{intro}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted">
            {company.name} · Company no. {company.number} · Updated {company.updated}
          </p>
          <div className="mt-12 space-y-10">
            {sections.map((section) => (
              <section key={section.title} className="[content-visibility:auto] [contain-intrinsic-size:auto_12rem]">
                <h2 className="font-display text-3xl text-fg">{section.title}</h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((para) => (
                    <p key={para} className="text-sm leading-relaxed text-muted">
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
          {children}
        </Container>
      </Section>
    </main>
  );
}
