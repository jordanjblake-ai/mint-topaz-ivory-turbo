import { Link } from "@tanstack/react-router";
import type { Experience } from "@/data/site";
import { assertSportImage, sportImageAlt } from "@/data/sport-images";
import { Button } from "@/components/ui/button";
import { Photo } from "@/components/site/photo";
import { StatusBadge } from "@/components/site/status-badge";

export function ExperienceCard({ experience }: { experience: Experience }) {
  assertSportImage(experience.image, experience.sport);
  const alt = sportImageAlt(experience.image, experience.title);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg bg-surface shadow-border transition-shadow duration-150 hover:shadow-border-hover">
      <CardLink experience={experience} className="relative block aspect-4/3 overflow-hidden">
        <Photo
          src={experience.image}
          alt={alt}
          className="size-full transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-bg/80 via-transparent to-transparent" />
        <StatusBadge status={experience.status} className="absolute top-3 left-3" />
      </CardLink>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">{experience.sport}</p>
        <h3 className="font-display text-2xl leading-none text-fg">{experience.title}</h3>
        <p className="text-sm text-muted">
          {experience.destination}
          <span className="mx-2 text-border">·</span>
          {experience.dates}
        </p>
        <p className="text-sm leading-relaxed text-fg/85">{experience.blurb}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="text-sm font-semibold text-fg">{experience.priceFrom}</p>
          <Button asChild size="sm">
            <CardLink experience={experience}>{experience.cta}</CardLink>
          </Button>
        </div>
      </div>
    </article>
  );
}

function CardLink({
  experience,
  className,
  children,
}: {
  experience: Experience;
  className?: string;
  children: React.ReactNode;
}) {
  if (experience.href === "/contact") {
    return (
      <Link
        to="/contact"
        search={{ interest: experience.interest ?? experience.slug }}
        className={className}
      >
        {children}
      </Link>
    );
  }
  return (
    <Link to={experience.href} className={className}>
      {children}
    </Link>
  );
}
