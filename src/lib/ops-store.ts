import { create } from "zustand";
import {
  buildTraffic,
  SEED_ENQUIRIES,
  type CampWeek,
  type DailyTraffic,
  type Enquiry,
  type EnquiryKind,
  type EnquiryStatus,
} from "@/data/ops";
import { clip, safeJsonParse, sameText } from "@/lib/guard";

const KEY = "hybrid-desk-v1";
const SESSION = "hybrid-desk-session";
const CODE = "hybrid";

type OpsState = {
  ready: boolean;
  unlocked: boolean;
  enquiries: Enquiry[];
  traffic: DailyTraffic[];
  range: 7 | 30 | 90;
  hydrate: () => void;
  unlock: (code: string) => boolean;
  lock: () => void;
  setRange: (range: 7 | 30 | 90) => void;
  addEnquiry: (enquiry: Omit<Enquiry, "id" | "createdAt" | "notes" | "status">) => void;
  setStatus: (id: string, status: EnquiryStatus) => void;
  addNote: (id: string, text: string) => void;
  trackView: (path: string) => void;
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function persist(enquiries: Enquiry[], traffic: DailyTraffic[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify({ version: 1, enquiries, traffic }));
}

export const useOps = create<OpsState>((set, get) => ({
  ready: false,
  unlocked: false,
  enquiries: SEED_ENQUIRIES,
  traffic: buildTraffic(90),
  range: 30,

  hydrate: () => {
    if (typeof window === "undefined") return;
    let enquiries = SEED_ENQUIRIES;
    let traffic = buildTraffic(90);
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = safeJsonParse<{ enquiries?: Enquiry[]; traffic?: DailyTraffic[] }>(raw);
        if (parsed) {
          const live = (parsed.enquiries ?? []).filter((item) => item.live);
          const seedIds = new Set(SEED_ENQUIRIES.map((item) => item.id));
          const kept = (parsed.enquiries ?? []).filter((item) => seedIds.has(item.id));
          const byId = new Map(SEED_ENQUIRIES.map((item) => [item.id, item]));
          for (const row of kept) byId.set(row.id, { ...byId.get(row.id)!, ...row, live: false });
          enquiries = [...byId.values(), ...live].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
          if (parsed.traffic?.length) {
            const extra = new Map(parsed.traffic.map((row) => [row.date, row]));
            traffic = traffic.map((row) => extra.get(row.date) ?? row);
          }
        }
      }
    } catch {
      /* keep seed */
    }
    const unlocked = sessionStorage.getItem(SESSION) === "1";
    set({ ready: true, unlocked, enquiries, traffic });
  },

  unlock: (code) => {
    const ok = sameText(code.toLowerCase(), CODE);
    if (ok && typeof window !== "undefined") sessionStorage.setItem(SESSION, "1");
    if (ok) set({ unlocked: true });
    return ok;
  },

  lock: () => {
    if (typeof window !== "undefined") sessionStorage.removeItem(SESSION);
    set({ unlocked: false });
  },

  setRange: (range) => set({ range }),

  addEnquiry: (input) => {
    const enquiry: Enquiry = {
      ...input,
      name: clip(input.name, 80),
      email: clip(input.email, 120).toLowerCase(),
      message: clip(input.message, 1500),
      stay: input.stay === "camp" || input.stay === "camp-stay" ? input.stay : "",
      id: `live-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "new",
      notes: [],
      live: true,
      partySize: Math.min(12, Math.max(1, Number(input.partySize) || 1)),
    };
    const liveCount = get().enquiries.filter((item) => item.live).length;
    if (liveCount >= 200) return;
    const enquiries = [enquiry, ...get().enquiries];
    const key = todayKey();
    const traffic = get().traffic.map((row) =>
      row.date === key ? { ...row, enquiries: row.enquiries + 1 } : row,
    );
    persist(enquiries, traffic);
    set({ enquiries, traffic });
  },

  setStatus: (id, status) => {
    const enquiries = get().enquiries.map((item) => (item.id === id ? { ...item, status } : item));
    persist(enquiries, get().traffic);
    set({ enquiries });
  },

  addNote: (id, text) => {
    const note = { at: new Date().toISOString(), text: clip(text, 500) };
    const enquiries = get().enquiries.map((item) =>
      item.id === id ? { ...item, notes: [...item.notes, note] } : item,
    );
    persist(enquiries, get().traffic);
    set({ enquiries });
  },

  trackView: (path) => {
    if (path.startsWith("/ops")) return;
    const key = todayKey();
    const sid = "hybrid-sid";
    let firstToday = false;
    if (typeof window !== "undefined") {
      const stamp = sessionStorage.getItem(sid);
      if (stamp !== key) {
        sessionStorage.setItem(sid, key);
        firstToday = true;
      }
    }
    const traffic = get().traffic.map((row) => {
      if (row.date !== key) return row;
      return {
        ...row,
        views: row.views + 1,
        uniques: row.uniques + (firstToday ? 1 : 0),
      };
    });
    persist(get().enquiries, traffic);
    set({ traffic });
  },
}));

export function filterRange(rows: DailyTraffic[], range: 7 | 30 | 90) {
  return rows.slice(-range);
}

export function countByKind(enquiries: Enquiry[], kinds?: EnquiryKind[]) {
  const list = kinds ? enquiries.filter((item) => kinds.includes(item.kind)) : enquiries;
  return list.length;
}

export function weekPlaces(enquiries: Enquiry[], week: Exclude<CampWeek, "">) {
  return enquiries
    .filter(
      (item) =>
        item.kind === "lanzarote" &&
        item.week === week &&
        (item.status === "held" || item.status === "booked"),
    )
    .reduce((sum, item) => sum + item.partySize, 0);
}

export function moneySnapshot(enquiries: Enquiry[]) {
  const lanzarote = enquiries.filter(
    (item) => item.kind === "lanzarote" && (item.status === "held" || item.status === "booked"),
  );
  const deposits = lanzarote.reduce((sum, item) => sum + 100 * item.partySize, 0);
  const campDue = lanzarote
    .filter((item) => item.status === "held" || item.status === "booked")
    .reduce((sum, item) => sum + 325 * item.partySize, 0);
  const stayDue = lanzarote
    .filter((item) => item.stay === "camp-stay")
    .reduce((sum, item) => sum + 355 * item.partySize, 0);
  return { deposits, campDue, stayDue, heldPlaces: lanzarote.reduce((s, i) => s + i.partySize, 0) };
}
