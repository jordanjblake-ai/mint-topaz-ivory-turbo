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
    <section className={cn("relative isolate overflow-hidden", compact ? "min-h-[52vh]" : "min-h-[88vh]")}>
      <Photo src={image} alt={alt} className={cn("absolute inset-0 size-full", imageClass)} priority sizes="100vw" />
      <div className="absolute inset-0 bg-overlay" />
      <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/30 to-bg/20" />
      <Container
        className={cn(
          "relative flex flex-col justify-end pb-12 sm:pb-16",
          compact ? "min-h-[52vh] pt-28" : "min-h-[88vh] pt-32",
        )}
      >
        <Kicker>{kicker}</Kicker>
        <Display
          as="h1"
          className={cn(
            "mt-3 max-w-4xl leading-[0.9]",
            compact ? "text-5xl sm:text-7xl" : "text-6xl sm:text-8xl lg:text-9xl",
          )}
        >
          {title}
        </Display>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-fg/85 sm:text-lg">{sub}</p>
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </Container>
    </section>
  );
}
