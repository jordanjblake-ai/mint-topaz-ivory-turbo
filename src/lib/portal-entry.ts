const KEY = "hybrid-portal-entry";

export type PortalEntry = "player" | "coach";

export function setPortalEntry(entry: PortalEntry) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, entry);
  } catch {
    /* ignore */
  }
}

export function readPortalEntry(): PortalEntry | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.sessionStorage.getItem(KEY);
    return value === "player" || value === "coach" ? value : null;
  } catch {
    return null;
  }
}

export function clearPortalEntry() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
