import { cdnUrl } from "@/lib/cdn";
import { cn } from "@/lib/utils";

export function Logo({ className, alt = "Hybrid Vacations" }: { className?: string; alt?: string }) {
  const src64 = cdnUrl("/images/logo-64.webp");
  const src128 = cdnUrl("/images/logo-128.webp");
  return (
    <img
      src={src64}
      srcSet={`${src64} 64w, ${src128} 128w`}
      sizes="40px"
      width={40}
      height={40}
      alt={alt}
      className={cn("h-10 w-10 rounded-full", className)}
      decoding="async"
      fetchPriority="high"
      draggable={false}
    />
  );
}
