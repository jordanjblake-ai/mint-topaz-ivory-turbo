import { Container, Display, Kicker } from "@/components/site/section";
import { Photo } from "@/components/site/photo";
import { cn } from "@/lib/utils";

export function PageHero({
  image,
  alt,
  kicker,
  title,
  sub,
  actions,
  compact = false,
  imageClass,
}: {
  image: string;
  alt: string;
  kicker: string;
  title: string;
  sub: string;
  actions?: React.ReactNode;
  compact?: boolean;
  imageClass?: string;
}) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-charcoal",
        compact
          ? "min-h-[max(20rem,calc(52dvh-var(--cookie-banner,0px)))]"
          : "min-h-[max(28rem,calc(88dvh-var(--cookie-banner,0px)))]",
      )}
    >
      <Photo src={image} alt={alt} className={cn("absolute inset-0 size-full", imageClass)} priority sizes="100vw" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-charcoal/50 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-linear-to-t from-charcoal/80 via-charcoal/25 to-transparent"
        aria-hidden
      />
      <Container
        className={cn(
          "relative flex flex-col justify-end pb-12 sm:pb-16",
          compact
            ? "min-h-[max(20rem,calc(52dvh-var(--cookie-banner,0px)))] pt-28"
            : "min-h-[max(28rem,calc(88dvh-var(--cookie-banner,0px)))] pt-32",
        )}
      >
        <Kicker>{kicker}</Kicker>
        <Display
          as="h1"
          className={cn(
            "mt-3 max-w-4xl leading-[0.9] text-white",
            compact ? "text-5xl sm:text-7xl" : "text-6xl sm:text-8xl lg:text-9xl",
          )}
        >
          {title}
        </Display>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">{sub}</p>
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </Container>
    </section>
  );
}
