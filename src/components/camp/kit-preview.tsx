import { countryOf, flagUrl, SHORTS_NONE, isKitSize, type KitChoice } from "@/data/kit";
import { webpHref } from "@/data/image-opt";

export function KitPreview({ kit, name }: { kit: KitChoice; name: string }) {
  const country = countryOf(kit.country);
  const print = kit.printName || "NAME";
  const showShorts = isKitSize(kit.shorts);
  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2">
        <KitFace
          label="Front"
          vest={webpHref("/images/kit-vest-front.jpg", 480)}
          print={print}
          flag={country ? flagUrl(kit.country, 80) : null}
          size={`Vest ${kit.top} · Shorts ${showShorts ? kit.shorts : SHORTS_NONE}`}
          showShorts={showShorts}
        />
        <KitFace
          label="Back"
          vest={webpHref("/images/kit-vest-back.jpg", 480)}
          print={print}
          flag={null}
          back
          size={`${name.split(" ")[0]} · name on the back`}
          showShorts={showShorts}
        />
      </div>
      <p className="mt-5 text-center text-sm leading-relaxed text-muted">
        This print is for feel only, in the same family as kits we have used. The 2027 design is not
        confirmed yet.
      </p>
    </div>
  );
}

function KitFace({
  label,
  vest,
  print,
  flag,
  back,
  size,
  showShorts,
}: {
  label: string;
  vest: string;
  print: string;
  flag: string | null;
  back?: boolean;
  size: string;
  showShorts: boolean;
}) {
  return (
    <div className="rounded-md bg-bg p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
      <div className="relative mx-auto w-40">
        <div className="relative h-72 overflow-hidden">
          <img
            src={vest}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute left-1/2 top-8 h-64 w-64 -translate-x-1/2 object-contain"
          />
          {flag ? (
            <img
              src={flag}
              alt=""
              className="absolute left-12 top-24 h-4 w-6 object-cover shadow-border"
            />
          ) : null}
          <p
            className={
              back
                ? "absolute inset-x-6 top-28 text-center font-display text-3xl leading-none text-fg"
                : "absolute inset-x-4 top-40 text-center font-display text-xl leading-none text-fg"
            }
          >
            {print}
          </p>
        </div>
        <img
          src={webpHref("/images/kit-shorts.jpg", 480)}
          alt=""
          loading="lazy"
          decoding="async"
          className={
            showShorts
              ? "relative z-10 mx-auto -mt-8 block h-28 w-28 object-contain"
              : "relative z-10 mx-auto -mt-8 block h-28 w-28 object-contain opacity-25"
          }
        />
      </div>
      <p className="mt-3 text-center text-xs uppercase tracking-[0.16em] text-muted">{size}</p>
    </div>
  );
}