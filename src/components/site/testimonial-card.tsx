export function TestimonialCard({
  quote,
  name,
  note,
}: {
  quote: string;
  name: string;
  note?: string;
}) {
  return (
    <figure className="flex h-full flex-col rounded-md bg-surface p-6 shadow-border">
      <blockquote className="text-base leading-relaxed text-fg">“{quote}”</blockquote>
      <figcaption className="mt-6">
        <p className="text-sm font-semibold text-fg">{name}</p>
        {note ? <p className="text-xs uppercase tracking-wider text-muted">{note}</p> : null}
      </figcaption>
    </figure>
  );
}
