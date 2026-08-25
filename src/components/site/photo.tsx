import { imageOpt, webpHref, webpSrcSet } from "@/data/image-opt";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

const IMG_ONLY = /(?:object-(?:top|bottom|left|right|center|\[[^\]]+\])|origin-\S+|scale-(?:\[[^\]]+\]|\S+))/g;

export function Photo({
  src,
  alt,
  className,
  priority = false,
  sizes = "(min-width: 1280px) 42vw, 100vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const meta = imageOpt(src);
  const srcSet = webpSrcSet(src);
  const webp = webpHref(src, priority ? 1280 : 800);
  const imgClass = className?.match(IMG_ONLY)?.join(" ") ?? "";
  const wrapClass = className?.replace(IMG_ONLY, "").replace(/\s+/g, " ").trim();
  const { ref, shown } = useInView<HTMLSpanElement>(priority);
  const active = priority || shown;

  return (
    <>
      {priority && srcSet ? (
        <link
          rel="preload"
          as="image"
          href={webp}
          type="image/webp"
          imageSrcSet={srcSet}
          imageSizes={sizes}
          fetchPriority="high"
        />
      ) : null}
      <span
        ref={ref}
        className={cn("overflow-hidden bg-cover bg-center", wrapClass)}
        style={meta?.lqip ? { backgroundImage: `url("${meta.lqip}")` } : undefined}
      >
        {active ? (
          <picture className="block size-full overflow-hidden rounded-[inherit]">
            {srcSet ? <source type="image/webp" srcSet={srcSet} sizes={sizes} /> : null}
            <img
              src={webp}
              alt={alt}
              width={meta?.width}
              height={meta?.height}
              sizes={sizes}
              className={cn(
                "size-full rounded-[inherit] object-cover ring-1 ring-inset ring-fg/10",
                imgClass,
              )}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
              fetchPriority={priority ? "high" : "low"}
            />
          </picture>
        ) : (
          <span className="block size-full rounded-[inherit]" aria-hidden />
        )}
      </span>
      {priority ? null : (
        <noscript>
          <img src={src} alt={alt} className="hidden" />
        </noscript>
      )}
    </>
  );
}
