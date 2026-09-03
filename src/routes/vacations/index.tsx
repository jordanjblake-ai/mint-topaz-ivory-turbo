import { createFileRoute } from "@tanstack/react-router";
import { experiences } from "@/data/site";
import { headFor } from "@/data/seo";
import { CtaBand } from "@/components/site/cta-band";
import { ExperienceCard } from "@/components/site/experience-card";
import { PageHero } from "@/components/site/page-hero";
import { Container, Display, Kicker, Section } from "@/components/site/section";

export const Route = createFileRoute("/vacations/")({
  head: () => headFor("/vacations"),
  component: VacationsPage,
});

function VacationsPage() {
  return (
    <main>
      <PageHero
        compact
        image="/images/camp-1.jpg"
        alt="Hybrid camp on the sand"
        kicker="Camps"
        title="Sport. Travel. Community."
        sub="Lanzarote is open. Tennis and Padel in Mallorca are open to pre-register. Golf lands in 2028."
      />
      <Section>
        <Container>
          <Kicker>2027 and 2028</Kicker>
          <Display className="mt-2 text-5xl">The camps</Display>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {experiences.map((experience) => (
              <ExperienceCard key={experience.slug} experience={experience} />
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand
        title="Not sure which week?"
        body="Tell us your sport, level, and dates. We will point you at the right camp, or the UK coaching path."
        to="/contact"
        label="Contact us"
        search={{ interest: "other" }}
      />
    </main>
  );
}
