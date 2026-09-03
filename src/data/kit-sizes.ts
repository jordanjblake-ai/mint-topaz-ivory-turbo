export const SIZE_GUIDE_SIZES = ["XS", "S", "M", "L", "XL"] as const;

export type SizeGuideTab = "men" | "women" | "bra";

export const SIZE_GUIDE_TABS: { id: SizeGuideTab; label: string }[] = [
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "bra", label: "Sports bra" },
];

export const MEN_SIZE_ROWS = [
  { size: "XS", waist: "69–74 cm (27–29 in)", chest: "86–91 cm (34–36 in)" },
  { size: "S", waist: "74–79 cm (29–31 in)", chest: "91–97 cm (36–38 in)" },
  { size: "M", waist: "79–84 cm (31–33 in)", chest: "97–102 cm (38–40 in)" },
  { size: "L", waist: "84–89 cm (33–35 in)", chest: "102–107 cm (40–42 in)" },
  { size: "XL", waist: "89–94 cm (35–37 in)", chest: "107–112 cm (42–44 in)" },
] as const;

export const WOMEN_SHORTS_ROWS = [
  { size: "XS", uk: "UK 4–6", waist: "64–69 cm (25–27 in)" },
  { size: "S", uk: "UK 6–8", waist: "69–74 cm (27–29 in)" },
  { size: "M", uk: "UK 8–10", waist: "74–79 cm (29–31 in)" },
  { size: "L", uk: "UK 12–14", waist: "79–84 cm (31–33 in)" },
  { size: "XL", uk: "UK 14–16", waist: "84–89 cm (33–35 in)" },
] as const;

export const SPORTS_BRA_ROWS = [
  { size: "XS", bust: "76–81 cm (30–32 in)", cup: "A–B" },
  { size: "S", bust: "81–86 cm (32–34 in)", cup: "B–C" },
  { size: "M", bust: "84–91 cm (33–36 in)", cup: "C–D" },
  { size: "L", bust: "91–97 cm (36–38 in)", cup: "D–DD" },
  { size: "XL", bust: "97–102 cm (38–40 in)", cup: "DD–E" },
] as const;

export const SIZE_GUIDE_NOTE = "Guide only. Kit is cut for sport";
export const BRA_FIT_NOTE = "Between sizes, size up.";
