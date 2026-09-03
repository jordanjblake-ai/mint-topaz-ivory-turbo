import { createFileRoute, Link } from "@tanstack/react-router";
import {
  annexA,
  annexStatusLabel,
  annexThemes,
  company,
  security,
  subprocessors,
  zeroTrustPrinciples,
  type AnnexStatus,
} from "@/data/legal";
import { headFor } from "@/data/seo";
import { Container, Display, Kicker, Section } from "@/components/site/section";

export const Route = createFileRoute("/security")({
  head: () => headFor("/security"),
  component: SecurityPage,
});

function StatusMark({ status }: { status: AnnexStatus }) {
  return (
    <span className={status === "implemented" ? "text-fg" : "text-muted"}>
      {annexStatusLabel[status]}
    </span>
  );
}

function SecurityPage() {
  return (
    <main>
      <Section>
        <Container className="max-w-5xl">
          <Kicker>Legal</Kicker>
          <Display as="h1" className="mt-2 text-5xl sm:text-6xl">
            Security and compliance
          </Display>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted">
            How {company.name} looks after personal data on this site. Written to UK GDPR, and aligned
            with ISO 27001:2022 Annex A, SOC 2 controls, and Zero Trust principles. We are not a HIPAA
            covered entity.
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted">
            {company.name} · Company no. {company.number} · Updated {company.updated}
          </p>

          <div className="mt-12 max-w-3xl space-y-10">
            {security.map((section) => (
              <section key={section.title}>
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

          <section className="mt-14" id="zero-trust">
            <h2 className="font-display text-3xl text-fg">The five checks</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
              How a request is treated after it arrives. This is product behaviour, not a certified
              architecture audit.
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-[0.14em] text-muted">
                    <th className="py-2 pr-4 font-medium">Principle</th>
                    <th className="py-2 font-medium">How</th>
                  </tr>
                </thead>
                <tbody>
                  {zeroTrustPrinciples.map((row) => (
                    <tr key={row.title} className="border-b border-border/70 align-top">
                      <td className="py-3 pr-4 text-fg">{row.title}</td>
                      <td className="py-3 text-muted">{row.how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-14" id="annex-a">
            <h2 className="font-display text-3xl text-fg">ISO 27001:2022 Annex A</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
              Controls that apply to this website. Remaining Annex A items (most physical site
              security, HR screening, and endpoint device policy) sit with Hybrid Ltd or a processor
              and are not duplicated here.
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs uppercase tracking-[0.14em] text-muted">
              <li>On this site</li>
              <li>With a processor</li>
              <li>Hybrid Ltd</li>
              <li>Not applicable</li>
            </ul>

            {annexThemes.map((theme) => {
              const rows = annexA.filter((row) => row.theme === theme);
              return (
                <div key={theme} className="mt-10">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    {theme}
                  </h3>
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-border text-xs uppercase tracking-[0.14em] text-muted">
                          <th className="py-2 pr-3 font-medium">ID</th>
                          <th className="py-2 pr-3 font-medium">Control</th>
                          <th className="py-2 pr-3 font-medium">Where</th>
                          <th className="py-2 font-medium">How</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row) => (
                          <tr key={row.id} className="border-b border-border/70 align-top">
                            <td className="whitespace-nowrap py-3 pr-3 text-fg">{row.id}</td>
                            <td className="py-3 pr-3 text-fg">{row.name}</td>
                            <td className="whitespace-nowrap py-3 pr-3">
                              <StatusMark status={row.status} />
                            </td>
                            <td className="py-3 text-muted">{row.how}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="mt-14 max-w-3xl">
            <h2 className="font-display text-3xl text-fg">Processors we use</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Each sits under a written contract. Optional analytics and ads processors only run after
              you accept those cookies.
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-[0.14em] text-muted">
                    <th className="py-2 pr-4 font-medium">Processor</th>
                    <th className="py-2 pr-4 font-medium">Role</th>
                    <th className="py-2 pr-4 font-medium">Region</th>
                    <th className="py-2 font-medium">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {subprocessors.map((row) => (
                    <tr key={row.name} className="border-b border-border/70">
                      <td className="py-3 pr-4 text-fg">{row.name}</td>
                      <td className="py-3 pr-4 text-muted">{row.role}</td>
                      <td className="py-3 pr-4 text-muted">{row.region}</td>
                      <td className="py-3 text-muted">{row.data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <p className="mt-12 text-sm leading-relaxed text-muted">
            <Link to="/privacy" className="text-fg hover:text-accent">
              Privacy Policy
            </Link>
            <span className="mx-2 text-border">·</span>
            <Link to="/privacy/request" className="text-fg hover:text-accent">
              Use your data rights
            </Link>
            <span className="mx-2 text-border">·</span>
            <Link to="/cookies" className="text-fg hover:text-accent">
              Cookie Policy
            </Link>
          </p>
        </Container>
      </Section>
    </main>
  );
}
