import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "./camp-map.css";
import { MapGlyph, pinGlyphHtml } from "@/components/camp/camp-map-icons";
import {
  MAP_CHIPS,
  MAP_DEFAULT_CHIP,
  MAP_UPDATED,
  WATER_LINKS,
  WATER_NOTE,
  closestLabel,
  directionsUrl,
  emergencyCalls,
  emergencyPlaces,
  mapPlaces,
  referencePlaces,
  walkMinutesTo,
  type MapChipId,
  type MapPlace,
} from "@/data/camp-map";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "hybrid-camp-map-chip";

function loadChip(): MapChipId {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return MAP_DEFAULT_CHIP;
    const parsed = JSON.parse(raw) as unknown;
    const allowed = new Set(MAP_CHIPS.map((chip) => chip.id));
    if (typeof parsed === "string" && allowed.has(parsed as MapChipId)) return parsed as MapChipId;
    if (Array.isArray(parsed)) {
      const found = parsed.find((id): id is MapChipId => allowed.has(id));
      if (found) return found;
    }
    return MAP_DEFAULT_CHIP;
  } catch {
    return MAP_DEFAULT_CHIP;
  }
}

function pinIcon(place: MapPlace) {
  if (place.layer === "tent") {
    return L.divIcon({
      className: "",
      html: `<span class="camp-pin-mark camp-pin-tent"><img src="/favicon.svg" alt="" width="18" height="18" /></span>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [22, 0],
    });
  }
  if (place.layer === "stay") {
    return L.divIcon({
      className: "",
      html: `<span class="camp-pin-mark camp-pin-stay">M</span>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [22, 0],
    });
  }
  return L.divIcon({
    className: "",
    html: pinGlyphHtml(place.layer),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [22, 0],
  });
}

const clusterIcon = (count: number) =>
  L.divIcon({
    className: "",
    html: `<span class="camp-cluster">${count}</span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

function esc(value: string) {
  return value.replace(/[&<>"]/g, (ch) => {
    if (ch === "&") return "&" + "amp;";
    if (ch === "<") return "&" + "lt;";
    if (ch === ">") return "&" + "gt;";
    return "&" + "quot;";
  });
}

function popupHtml(place: MapPlace | (typeof emergencyPlaces)[number]) {
  const isMapPlace = "layer" in place;
  const closest = isMapPlace ? closestLabel(place) : null;
  const hours = isMapPlace ? place.hours : undefined;
  const tel = "tel" in place ? place.tel : undefined;
  const telLabel = "telLabel" in place ? place.telLabel : tel;
  const taxi = Boolean(place.note?.includes("Taxi"));
  const tent = mapPlaces.find((item) => item.id === "tent");
  const morana = mapPlaces.find((item) => item.id === "morana");
  const here = { lat: place.lat, lng: place.lng };
  const walks: string[] = [];
  if (!taxi && tent && morana) {
    if (!(isMapPlace && place.id === "tent")) walks.push(`~${walkMinutesTo(here, tent)} min walk to the tent`);
    if (!(isMapPlace && place.id === "morana")) walks.push(`~${walkMinutesTo(here, morana)} min walk to Moraña`);
  }
  const dir = directionsUrl(place.lat, place.lng, place.name);
  return `<div class="camp-pop">
    <p class="camp-pop-title">${esc(place.name)}</p>
    ${closest ? `<p class="camp-pop-accent">${esc(closest)}</p>` : ""}
    ${place.note ? `<p class="camp-pop-note">${esc(place.note)}</p>` : ""}
    ${place.address ? `<p class="camp-pop-addr">${esc(place.address)}</p>` : ""}
    ${hours ? `<p class="camp-pop-note">${esc(hours)}</p>` : ""}
    ${walks.map((line) => `<p class="camp-pop-note">${esc(line)}</p>`).join("")}
    <div class="camp-pop-actions">
      <a class="camp-pop-dir" href="${esc(dir)}" target="_blank" rel="noopener noreferrer">Directions</a>
      ${tel ? `<a class="camp-pop-tel" href="tel:${esc(tel)}">${esc(telLabel ?? tel)}</a>` : ""}
    </div>
  </div>`;
}

function ListRow({
  place,
  open,
  onOpen,
  hint,
}: {
  place: MapPlace;
  open: boolean;
  onOpen: () => void;
  hint: string;
}) {
  const chip = MAP_CHIPS.find((item) => item.id === place.layer);
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "flex min-h-11 w-full items-center gap-3 rounded-sm px-3 py-2 text-left",
          open ? "bg-surface text-fg" : "text-fg hover:bg-surface/70",
        )}
      >
        {chip ? (
          <MapGlyph id={chip.id} size={22} />
        ) : place.layer === "tent" ? (
          <span className="camp-pin-mark camp-pin-tent !size-8 shrink-0">
            <img src="/favicon.svg" alt="" width="16" height="16" />
          </span>
        ) : (
          <span className="camp-pin-mark camp-pin-stay !size-8 shrink-0 text-[11px]">M</span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block text-sm">{place.name}</span>
          <span className="block text-[0.65rem] uppercase tracking-wide text-muted">{hint}</span>
        </span>
      </button>
    </li>
  );
}

export function CampMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const refLayerRef = useRef<L.LayerGroup | null>(null);
  const popupRef = useRef<L.Popup | null>(null);
  const framedRef = useRef(false);
  const [chip, setChip] = useState<MapChipId>(MAP_DEFAULT_CHIP);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    setChip(loadChip());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chip));
    } catch {
      /* private mode */
    }
  }, [chip]);

  const refs = useMemo(() => referencePlaces(), []);
  const category = useMemo(
    () => mapPlaces.filter((place) => place.layer === chip),
    [chip],
  );

  const openPlace =
    mapPlaces.find((place) => place.id === openId) ??
    emergencyPlaces.find((place) => place.name === openId) ??
    null;

  useEffect(() => {
    const el = mapRef.current;
    if (!el || leafletRef.current) return;

    const map = L.map(el, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);

    const refsGroup = L.layerGroup().addTo(map);
    const popup = L.popup({
      className: "camp-map-popup",
      closeButton: true,
      autoPan: true,
      autoPanPadding: [28, 28],
      maxWidth: 280,
      offset: L.point(22, 0),
    });
    popupRef.current = popup;
    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: 18,
      iconCreateFunction: (group) => clusterIcon(group.getChildCount()),
    });
    map.addLayer(cluster);
    leafletRef.current = map;
    clusterRef.current = cluster;
    refLayerRef.current = refsGroup;

    refs.forEach((place) => {
      const marker = L.marker([place.lat, place.lng], { icon: pinIcon(place), title: place.name, zIndexOffset: 400 });
      marker.on("click", () => setOpenId(place.id));
      refsGroup.addLayer(marker);
    });

    const courts = mapPlaces.find((place) => place.id === "courts");
    const tent = refs.find((place) => place.id === "tent");
    const morana = refs.find((place) => place.id === "morana");
    if (tent && morana && courts) {
      map.fitBounds(
        [
          [tent.lat, tent.lng],
          [morana.lat, morana.lng],
          [courts.lat, courts.lng],
        ],
        { padding: [48, 48], maxZoom: 17 },
      );
      framedRef.current = true;
    }

    return () => {
      map.remove();
      leafletRef.current = null;
      clusterRef.current = null;
      refLayerRef.current = null;
      popupRef.current = null;
    };
  }, [refs]);

  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;
    cluster.clearLayers();
    category.forEach((place) => {
      const marker = L.marker([place.lat, place.lng], { icon: pinIcon(place), title: place.name });
      marker.on("click", () => setOpenId(place.id));
      cluster.addLayer(marker);
    });
    const map = leafletRef.current;
    if (map && (chip === "supermarket" || chip === "kiosk" || chip === "physio") && category.length) {
      map.fitBounds(
        [...refs, ...category].map((place) => [place.lat, place.lng] as [number, number]),
        { padding: [48, 48], maxZoom: 17 },
      );
    }
  }, [category, chip, refs]);

  useEffect(() => {
    const map = leafletRef.current;
    const popup = popupRef.current;
    if (!map || !popup) return;
    if (!openPlace) {
      map.closePopup();
      return;
    }
    popup.setLatLng([openPlace.lat, openPlace.lng]).setContent(popupHtml(openPlace)).openOn(map);
  }, [openPlace]);

  return (
    <div className="camp-map-page mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Lanzarote 2027</p>
      <h1 className="mt-2 font-display text-5xl text-fg sm:text-6xl">The Map</h1>
      <p className="mt-3 text-sm text-muted">{MAP_UPDATED}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {MAP_CHIPS.map((item) => {
          const on = chip === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setChip(item.id)}
              className={cn("camp-map-chip inline-flex items-center rounded-sm px-3 text-xs font-semibold uppercase tracking-wide", on ? "is-on" : "is-off")}
            >
              <MapGlyph id={item.id} active={on} size={22} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,1fr)] lg:items-start">
        <div>
          <div
            ref={mapRef}
            className="h-[55vh] min-h-72 w-full overflow-hidden rounded-md lg:h-[70vh]"
          />
          <section className="mt-4 rounded-md bg-surface p-4 shadow-border">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Emergency</p>
            <ul className="mt-3 grid gap-2">
              {emergencyCalls.map((item) => (
                <li key={item.tel}>
                  <a href={`tel:${item.tel}`} className="inline-flex min-h-11 items-center text-sm text-fg hover:text-accent">
                    {item.label}
                  </a>
                </li>
              ))}
              {emergencyPlaces.map((item) => (
                <li key={item.name} className="flex flex-wrap items-center gap-x-3">
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-start text-left text-sm text-fg hover:text-accent"
                    onClick={() => setOpenId(item.name)}
                  >
                    <span>
                      {item.name}
                      {item.note ? <span className="block text-muted">{item.note}</span> : null}
                    </span>
                  </button>
                  {item.tel ? (
                    <a href={`tel:${item.tel}`} className="inline-flex min-h-11 items-center text-sm text-accent">
                      {item.telLabel ?? item.tel}
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="grid gap-5">
          <div>
            <p className="px-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-accent">Reference</p>
            <ul className="mt-1 grid gap-1">
              {refs.map((place) => (
                <ListRow
                  key={place.id}
                  place={place}
                  open={openId === place.id}
                  onOpen={() => setOpenId(place.id)}
                  hint="Pinned"
                />
              ))}
            </ul>
          </div>
          <div>
            <p className="px-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-accent">
              {MAP_CHIPS.find((item) => item.id === chip)?.label}
            </p>
            {chip === "water" ? (
              <div className="mt-2 px-3 text-sm leading-relaxed text-muted">
                <p>{WATER_NOTE}</p>
                <ul className="mt-2 grid gap-1">
                  {WATER_LINKS.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className="inline-flex min-h-11 items-center text-left text-accent hover:text-fg"
                        onClick={() => setOpenId(item.id)}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
            <ul className="mt-1 grid gap-1">
              {category.map((place) => (
                <ListRow
                  key={place.id}
                  place={place}
                  open={openId === place.id}
                  onOpen={() => setOpenId(place.id)}
                  hint={place.kind === "recommended" ? "Recommended" : place.kind === "option" ? "Option" : "Assumed"}
                />
              ))}
            </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
