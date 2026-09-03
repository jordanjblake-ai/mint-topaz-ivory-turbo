import type { MapChipId } from "@/data/camp-map";

const INK = "#52d6c7";
const CHARCOAL = "#0d0e10";
const GREEN = "#3dba6a";

const paths: Record<MapChipId, string> = {
  courts:
    '<path d="M5 4v16M19 4v16M5 7.5h14M5 12h14M5 16.5h14M8.5 7.5v9M12 7.5v9M15.5 7.5v9" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="square"/>',
  bags:
    '<path d="M7 10.5h10v8.2H7zM9.2 10.5V8.6a2.8 2.8 0 0 1 5.6 0v1.9M7 14.2h10" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
  toilets:
    '<text x="12" y="16.2" text-anchor="middle" font-size="9" font-weight="800" font-family="ui-sans-serif,system-ui,sans-serif" fill="currentColor">WC</text>',
  showers:
    '<path d="M8 5.5h8M12 5.5v3.2M8.2 9.2h7.6C16.8 9.2 18 10.4 18 12v1H6v-1c0-1.6 1.2-2.8 2.2-2.8ZM9 15.2v3.2M12 14.6v4.2M15 15.2v3.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  water:
    '<path d="M6 9h8.5c2 0 3.5 1.4 3.5 3.2S16.5 15.4 14.5 15.4H13M14.5 9V6.5M12 16.5c0 1.4-1.1 2.5-2.2 3.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="9.4" cy="20.2" r="0.9" fill="currentColor"/>',
  supermarket:
    '<path d="M5 7h2l1.4 8h9.2l1.6-6.2H8.2M9.2 18.6a1.2 1.2 0 1 0 0.01 0M16.6 18.6a1.2 1.2 0 1 0 0.01 0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
  kiosk:
    '<path d="M10 4.8h4l1.2 3.4H8.8L10 4.8ZM8.8 8.2h6.4v11.2H8.8zM8.8 13h6.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
  pharmacy:
    '<path d="M10.2 4.8h3.6v4.2h4.4v3.6h-4.4v4.2h-3.6v-4.2H5.8V9h4.4z" fill="currentColor"/>',
  physio:
    '<path d="M12 4.8c-2.8 0-4.6 2.6-4.6 6.4 0 2.8 1.4 6.6 4.6 6.6s4.6-3.8 4.6-6.6c0-3.8-1.8-6.4-4.6-6.4z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M5.4 10.6c-1.3 1.4-1.3 3.6 0 5M18.6 10.6c1.3 1.4 1.3 3.6 0 5M4.8 12.2h2.4M16.8 12.2h2.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  atm: '<path d="M5.5 7.2h13v9.6h-13zM5.5 10.2h13M8 14.4h5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
};

export function glyphSvg(id: MapChipId, color: string, size = 22) {
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" style="color:${color}">${paths[id]}</svg>`;
}

export function MapGlyph({
  id,
  active,
  size = 22,
  className,
}: {
  id: MapChipId;
  active?: boolean;
  size?: number;
  className?: string;
}) {
  const color = id === "pharmacy" ? GREEN : active ? CHARCOAL : INK;
  return (
    <span
      className={className}
      style={{ color, width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: glyphSvg(id, color, size) }}
    />
  );
}

export function pinGlyphHtml(id: MapChipId) {
  const color = id === "pharmacy" ? GREEN : INK;
  return `<span class="camp-pin-mark camp-pin-glyph">${glyphSvg(id, color, 22)}</span>`;
}

export { INK, CHARCOAL, GREEN };
