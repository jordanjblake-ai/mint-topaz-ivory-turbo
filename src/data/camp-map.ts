export const MAP_CENTER = { lat: 28.9215, lng: -13.6600 } as const;
export const MAP_ZOOM = 16;
export const MAP_UPDATED = "Last updated 1 Sep 2026 — pins marked * are assumed.";

export const MAP_CHIPS = [
  { id: "courts", label: "Courts" },
  { id: "bags", label: "Bags" },
  { id: "toilets", label: "Toilets" },
  { id: "showers", label: "Showers" },
  { id: "water", label: "Water" },
  { id: "supermarket", label: "Supermarket" },
  { id: "kiosk", label: "Kiosk" },
  { id: "pharmacy", label: "Pharmacy" },
  { id: "physio", label: "Physio" },
  { id: "atm", label: "ATM" },
] as const;

export type MapChipId = (typeof MAP_CHIPS)[number]["id"];
export type MapLayerId = MapChipId | "tent" | "stay";
export type MapKind = "recommended" | "option" | "assumed";

export const MAP_DEFAULT_CHIP: MapChipId = "courts";
export const REFERENCE_IDS = ["tent", "morana"] as const;

export type MapPlace = {
  id: string;
  name: string;
  layer: MapLayerId;
  kind: MapKind;
  lat: number;
  lng: number;
  note?: string;
  address?: string;
  hours?: string;
  walkMinutes?: number;
  closest?: "courts" | "morana";
  tel?: string;
  telLabel?: string;
};

export const mapPlaces: MapPlace[] = [
  {
    id: "courts",
    name: "Playa Grande courts*",
    layer: "courts",
    kind: "assumed",
    lat: 28.92015,
    lng: -13.6625,
    address: "Playa Grande",
    note: "On the sand, just south of the tent.",
  },
  {
    id: "tent",
    name: "Signup tent*",
    layer: "tent",
    kind: "assumed",
    lat: 28.9204,
    lng: -13.6625,
    note: "On the beach, south of Moraña. Canopy TBC.",
  },
  {
    id: "morana",
    name: "Moraña — reception*",
    layer: "stay",
    kind: "assumed",
    lat: 28.9227,
    lng: -13.6625,
    address: "Calle Guanapay 2, 35510",
    note: "Camp HQ. OSM Guanapay / Kon Tiki. Not a hotel.",
    walkMinutes: 7,
  },
  {
    id: "bags",
    name: "Bag drop / shade*",
    layer: "bags",
    kind: "assumed",
    lat: 28.9205,
    lng: -13.6597,
    note: "Next to tent.",
  },
  {
    id: "toilets-centre",
    name: "Playa Grande toilets — zona 5 / centre*",
    layer: "toilets",
    kind: "recommended",
    lat: 28.9204,
    lng: -13.6592,
    note: "Adapted block, closest to the courts.",
    closest: "courts",
  },
  {
    id: "toilets-west",
    name: "Playa Grande toilets — west / Fariones*",
    layer: "toilets",
    kind: "option",
    lat: 28.9207,
    lng: -13.6638,
    note: "Closer to Moraña.",
    closest: "morana",
  },
  {
    id: "toilets-east",
    name: "Playa Grande toilets — east end*",
    layer: "toilets",
    kind: "option",
    lat: 28.9206,
    lng: -13.6485,
    note: "East block, far from stay.",
  },
  {
    id: "toilets-chica",
    name: "Playa Chica toilets*",
    layer: "toilets",
    kind: "option",
    lat: 28.9212,
    lng: -13.6695,
    note: "Small unisex block, old harbour.",
  },
  {
    id: "toilets-biosfera",
    name: "Biosfera Plaza toilets*",
    layer: "toilets",
    kind: "option",
    lat: 28.9230,
    lng: -13.6687,
    note: "Indoor, mall hours.",
  },
  {
    id: "showers-zona5",
    name: "Playa Grande showers — zona 5 accessible*",
    layer: "showers",
    kind: "recommended",
    lat: 28.9204,
    lng: -13.6590,
    note: "Outdoor heads. Tías put 13 along the beach — these are the clusters.",
    closest: "courts",
  },
  {
    id: "showers-west",
    name: "Playa Grande showers — west*",
    layer: "showers",
    kind: "option",
    lat: 28.9206,
    lng: -13.6636,
    note: "Outdoor heads. Tías put 13 along the beach — these are the clusters.",
  },
  {
    id: "showers-centre",
    name: "Playa Grande showers — centre / sports*",
    layer: "showers",
    kind: "option",
    lat: 28.9205,
    lng: -13.6578,
    note: "Outdoor heads. Tías put 13 along the beach — these are the clusters.",
  },
  {
    id: "showers-east",
    name: "Playa Grande showers — east end*",
    layer: "showers",
    kind: "option",
    lat: 28.9206,
    lng: -13.6487,
    note: "Outdoor heads. Tías put 13 along the beach — these are the clusters.",
  },
  {
    id: "lidl",
    name: "Lidl — Juan Carlos I*",
    layer: "supermarket",
    kind: "recommended",
    lat: 28.9265,
    lng: -13.6658,
    address: "Avenida Juan Carlos I",
    hours: "08:30–22:00",
  },
  {
    id: "hiperdino",
    name: "HiperDino Express — Av. Playas 82*",
    layer: "supermarket",
    kind: "option",
    lat: 28.9227,
    lng: -13.6411,
    address: "Av. de las Playas 82",
    hours: "08:00–22:00",
  },
  {
    id: "superdino",
    name: "SuperDino — Reina Sofía 30*",
    layer: "supermarket",
    kind: "option",
    lat: 28.9233,
    lng: -13.6715,
    address: "Reina Sofía 30",
    tel: "+34928511527",
    telLabel: "928 51 15 27",
  },
  {
    id: "spar-disa",
    name: "Spar Disa — Juan Carlos I 25*",
    layer: "supermarket",
    kind: "option",
    lat: 28.9240,
    lng: -13.6661,
    address: "Avenida Juan Carlos I 25",
  },
  {
    id: "spar",
    name: "Spar — C.C. Dragos*",
    layer: "supermarket",
    kind: "option",
    lat: 28.9202,
    lng: -13.6441,
    address: "C.C. Dragos",
  },
  {
    id: "marcial",
    name: "Supermercados Marcial — Av. Playas 67*",
    layer: "supermarket",
    kind: "option",
    lat: 28.9224,
    lng: -13.6473,
    address: "Av. de las Playas 67",
  },
  {
    id: "biosfera",
    name: "Biosfera Plaza supermarket*",
    layer: "supermarket",
    kind: "option",
    lat: 28.9230,
    lng: -13.6687,
    address: "Av. Juan Carlos I 15",
  },
  {
    id: "farmacia-38",
    name: "Farmacia — Av. Playas 38*",
    layer: "pharmacy",
    kind: "recommended",
    lat: 28.9215,
    lng: -13.6591,
    address: "Av. de las Playas 38",
    closest: "courts",
  },
  {
    id: "farmacia-penita",
    name: "Farmacia — Av. Playas 43 La Peñita*",
    layer: "pharmacy",
    kind: "option",
    lat: 28.9216,
    lng: -13.6571,
    address: "Av. de las Playas 43",
  },
  {
    id: "farmacia-7",
    name: "Farmacia — Av. Playas 7*",
    layer: "pharmacy",
    kind: "option",
    lat: 28.9212,
    lng: -13.6680,
    address: "Av. de las Playas 7",
  },
  {
    id: "atm-courts",
    name: "ATM near courts*",
    layer: "atm",
    kind: "option",
    lat: 28.9212,
    lng: -13.6585,
    closest: "courts",
  },
  {
    id: "atm-morana",
    name: "ATM near Moraña*",
    layer: "atm",
    kind: "option",
    lat: 28.9220,
    lng: -13.6628,
    closest: "morana",
  },
  {
    id: "albatros",
    name: "Albatros — Guanapay 6*",
    layer: "kiosk",
    kind: "recommended",
    lat: 28.9226,
    lng: -13.6622,
    address: "Calle Guanapay 6",
    hours: "08:00–21:30",
    note: "Next to Moraña.",
    closest: "morana",
  },
  {
    id: "deutscher",
    name: "Deutscher — Guanapay 1*",
    layer: "kiosk",
    kind: "option",
    lat: 28.9228,
    lng: -13.6627,
    address: "Calle Guanapay 1",
  },
  {
    id: "hiperdino-austria",
    name: "HiperDino Express Austria — César Manrique 5*",
    layer: "kiosk",
    kind: "recommended",
    lat: 28.9211,
    lng: -13.6561,
    address: "Calle César Manrique 5",
    hours: "08:00–22:00",
    closest: "courts",
    tel: "+34928596071",
    telLabel: "928 59 60 71",
  },
  {
    id: "hiperdino-vinas",
    name: "HiperDino Express Las Viñas — Anzuelo*",
    layer: "kiosk",
    kind: "option",
    lat: 28.9213,
    lng: -13.6535,
    address: "Calle Anzuelo",
  },
  {
    id: "yash",
    name: "Yash Minimarket — Anzuelo 30*",
    layer: "kiosk",
    kind: "option",
    lat: 28.9214,
    lng: -13.6538,
    address: "Calle Anzuelo 30",
  },
  {
    id: "hiperdino-penita",
    name: "HiperDino Express La Peñita — Chalana*",
    layer: "kiosk",
    kind: "option",
    lat: 28.9228,
    lng: -13.6681,
    address: "Calle Chalana s/n, Aptos. Playa Club",
  },
  {
    id: "hiperdino-jc26",
    name: "HiperDino Express — Juan Carlos I 26*",
    layer: "kiosk",
    kind: "option",
    lat: 28.9217,
    lng: -13.6701,
    address: "Avenida Juan Carlos I 26",
  },
  {
    id: "coviran",
    name: "Covirán — Roque Nublo 20*",
    layer: "kiosk",
    kind: "option",
    lat: 28.9235,
    lng: -13.6695,
    address: "Calle Roque Nublo 20",
  },
  {
    id: "spar-doramas",
    name: "Spar — Doramás 9*",
    layer: "kiosk",
    kind: "option",
    lat: 28.9220,
    lng: -13.6640,
    address: "Calle Doramás 9",
  },
  {
    id: "spar-pedro",
    name: "Spar — Pedro Barba*",
    layer: "kiosk",
    kind: "option",
    lat: 28.9218,
    lng: -13.6635,
    address: "Calle Pedro Barba",
  },
  {
    id: "physio-bodykinetik",
    name: "Bodykinetik — Reina Sofía 27*",
    layer: "physio",
    kind: "option",
    lat: 28.9256,
    lng: -13.6756,
    address: "Reina Sofía 27",
    note: "Not a Hybrid partner. Book yourselves. Sports massage.",
    tel: "+34696108732",
    telLabel: "696 108 732",
  },
  {
    id: "physio-fisio-ds",
    name: "FISIO-DS — Av. Playas 23*",
    layer: "physio",
    kind: "option",
    lat: 28.9213,
    lng: -13.6635,
    address: "Av. de las Playas 23",
    note: "Not a Hybrid partner. Book yourselves. On the strip, west of the courts.",
  },
  {
    id: "physio-alegranza",
    name: "Fisioterapia — Alegranza 2*",
    layer: "physio",
    kind: "option",
    lat: 28.9232,
    lng: -13.6672,
    address: "Alegranza 2, sótano local 1",
    note: "Not a Hybrid partner. Book yourselves.",
    tel: "+34615513444",
    telLabel: "615 513 444",
  },
  {
    id: "physio-traspies",
    name: "Fisioterapia — Traspiés 1*",
    layer: "physio",
    kind: "option",
    lat: 28.9224,
    lng: -13.6648,
    address: "Traspiés 1",
    note: "Not a Hybrid partner. Book yourselves.",
    tel: "+34928511404",
    telLabel: "928 51 14 04",
  },
];

export type EmergencyCall = { label: string; tel: string };
export type EmergencyPlace = {
  name: string;
  address?: string;
  note?: string;
  lat: number;
  lng: number;
  tel?: string;
  telLabel?: string;
};

export const emergencyCalls: EmergencyCall[] = [
  { label: "112", tel: "112" },
  { label: "Mark Garcia-Kidd — Hybrid", tel: "+447871903754" },
];

export const emergencyPlaces: EmergencyPlace[] = [
  {
    name: "Centro de Salud*",
    address: "Calle Juan Carlos I",
    note: "Non-urgent",
    lat: 28.9232,
    lng: -13.6688,
  },
  {
    name: "Hospital Doctor José Molina Orosa, Arrecife",
    note: "A&E. Taxi, not a walk.",
    lat: 28.9745,
    lng: -13.5661,
    tel: "+34928596600",
    telLabel: "928 59 66 00",
  },
];

export const WATER_NOTE =
  "No public fountain mapped. Bottled water: Albatros (Guanapay 6) or HiperDino Express Austria (César Manrique 5).";

export const WATER_LINKS = [
  { id: "albatros", label: "Albatros (Guanapay 6)" },
  { id: "hiperdino-austria", label: "HiperDino Express Austria (César Manrique 5)" },
] as const;

export function layerCount(id: MapChipId) {
  return mapPlaces.filter((place) => place.layer === id).length;
}

export function closestLabel(place: MapPlace) {
  if (place.closest === "courts") return "Closest to the courts";
  if (place.closest === "morana") return "Closest to Moraña";
  return null;
}

function metres(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const r = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);
  const h = s1 * s1 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * s2 * s2;
  return 2 * r * Math.asin(Math.min(1, Math.sqrt(h)));
}

const WALK_M_PER_MIN = 80;

export function walkMinutesTo(from: { lat: number; lng: number }, to: { lat: number; lng: number }) {
  return Math.max(1, Math.round(metres(from, to) / WALK_M_PER_MIN));
}

export function referencePlaces() {
  return REFERENCE_IDS.map((id) => mapPlaces.find((place) => place.id === id)).filter(
    (place): place is MapPlace => Boolean(place),
  );
}

export function directionsUrl(lat: number, lng: number, name: string) {
  const q = encodeURIComponent(`${lat},${lng}`);
  const label = encodeURIComponent(name.replace(/\*$/, "").trim());
  if (typeof navigator !== "undefined" && /iPhone|iPad|Macintosh/.test(navigator.userAgent)) {
    return `https://maps.apple.com/?daddr=${q}&q=${label}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${q}&destination_place_id=&travelmode=walking`;
}
