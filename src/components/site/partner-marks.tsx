import { cdnUrl } from "@/lib/cdn";
import { cn } from "@/lib/utils";
import { partners } from "@/data/community-hub";
import { Container, Display, Kicker } from "@/components/site/section";

type Partner = (typeof partners)[number];

export function PartnerLogo({
  partner,
  className,
}: {
  partner: Pick<Partner, "name" | "logo" | "mark">;
  className?: string;
}) {
  return (
    <span className={cn("flex h-24 w-full max-w-[13rem] items-center justify-center", className)}>
      <img
        src={cdnUrl(partner.logo)}
        alt=""
        width={256}
        height={128}
        className="max-h-20 max-w-full object-contain object-center"
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </span>
  );
}

export function PartnerPlate({
  partner,
  className,
}: {
  partner: Pick<Partner, "name" | "logo" | "mark">;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-20 items-center justify-center rounded-md bg-paper px-5 py-3",
        className,
      )}
    >
      <PartnerLogo partner={partner} />
    </span>
  );
}

export function PartnerMarks() {
  return (
    <section className="border-y border-border bg-paper text-ink" aria-label="Partner marks">
      <Container className="py-12 sm:py-16">
        <Kicker>The marks</Kicker>
        <Display className="mt-2 text-4xl text-ink sm:text-5xl">Who we build with</Display>
        <ul className="mt-10 grid grid-cols-2 lg:grid-cols-4">
          {partners.map((partner, index) => (
            <li
              key={partner.id}
              className={cn(
                "border-ink/10",
                index % 2 === 1 && "border-l",
                index >= 2 && "border-t lg:border-t-0",
                index > 0 && "lg:border-l",
              )}
            >
              <a
                href={`#${partner.id}`}
                className="group flex min-h-44 flex-col items-center px-4 py-8 text-center transition-transform duration-150 ease-out hover:-translate-y-0.5"
              >
                <PartnerLogo partner={partner} />
                <span className="mt-4 flex min-h-10 items-start justify-center text-xs font-semibold tracking-[0.18em] text-ink/55 uppercase transition-colors duration-150 group-hover:text-ink">
                  {partner.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
