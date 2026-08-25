export const KIT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type KitSize = (typeof KIT_SIZES)[number];

export type KitCountry = { code: string; name: string };

export const KIT_COUNTRIES: KitCountry[] = [
  { code: "gb", name: "United Kingdom" },
  { code: "ie", name: "Ireland" },
  { code: "ch", name: "Switzerland" },
  { code: "de", name: "Germany" },
  { code: "es", name: "Spain" },
  { code: "fr", name: "France" },
  { code: "nl", name: "Netherlands" },
  { code: "it", name: "Italy" },
  { code: "pt", name: "Portugal" },
  { code: "be", name: "Belgium" },
  { code: "at", name: "Austria" },
  { code: "pl", name: "Poland" },
  { code: "cz", name: "Czechia" },
  { code: "se", name: "Sweden" },
  { code: "no", name: "Norway" },
  { code: "dk", name: "Denmark" },
  { code: "fi", name: "Finland" },
  { code: "us", name: "United States" },
  { code: "ca", name: "Canada" },
  { code: "au", name: "Australia" },
  { code: "nz", name: "New Zealand" },
  { code: "br", name: "Brazil" },
  { code: "ar", name: "Argentina" },
  { code: "za", name: "South Africa" },
  { code: "jp", name: "Japan" },
  { code: "in", name: "India" },
  { code: "ae", name: "United Arab Emirates" },
];

export type KitChoice = {
  personId: string;
  top: KitSize;
  shorts: KitSize;
  printName: string;
  country: string;
  updatedAt: string;
};

export function countryOf(code: string) {
  return KIT_COUNTRIES.find((item) => item.code === code) ?? null;
}

export function flagUrl(code: string, size = 40) {
  return `https://flagcdn.com/w${size}/${code}.png`;
}

export function printNameOf(raw: string) {
  return raw
    .toUpperCase()
    .replace(/[^A-Z \-']/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 14);
}

export function defaultPrintName(name: string) {
  const parts = name.trim().split(/\s+/);
  return printNameOf(parts[parts.length - 1] ?? name);
}
