import { create } from "zustand";
import {
  CAMP_NOW,
  PEOPLE,
  currentWeekId,
  groupOf,
  type CampPerson,
  type GroupMap,
  type WeekGroupMap,
} from "@/data/camp";
import { saveCampKit } from "@/lib/camp-kit";
import { postCampNote, replyCampNote } from "@/lib/camp-mail";
import { clip, safeJsonParse } from "@/lib/guard";
import { beginSessionClock, clearSessionClock, sessionStillValid } from "@/lib/session-timeout";
import type { KitChoice } from "@/data/kit";

export type CampMessage = {
  id: string;
  fromId: string;
  body: string;
  tag: "injury" | "illness" | "other";
  at: string;
  seenBy: string[];
  reply?: string;
  mailedTo?: string[];
  mailStatus?: "sent" | "logged";
};

export type CampReview = {
  fromId: string;
  body: string;
  marketing: boolean;
  at: string;
};

export type TournamentRsvp = "yes" | "no" | "maybe";
export type TournamentRsvpBook = Record<string, Record<string, TournamentRsvp>>;

type CampState = {
  ready: boolean;
  me: CampPerson | null;
  groups: GroupMap;
  weekGroups: WeekGroupMap;
  groupChangedAt: Record<string, string>;
  messages: CampMessage[];
  reviews: Record<string, CampReview>;
  notify: boolean;
  kits: Record<string, KitChoice>;
  rsvps: TournamentRsvpBook;
  hydrate: () => void;
  login: (email: string) => boolean;
  logout: () => void;
  setGroup: (playerId: string, groupId: string | null, week?: number) => void;
  sendMessage: (tag: CampMessage["tag"], body: string) => Promise<void>;
  markSeen: (id: string) => void;
  replyTo: (id: string, reply: string) => Promise<void>;
  setNotify: (value: boolean) => void;
  saveReview: (body: string, marketing: boolean) => void;
  saveKit: (kit: Omit<KitChoice, "personId" | "updatedAt">) => Promise<void>;
  setRsvp: (eventId: string, value: TournamentRsvp) => void;
};

const KEY = "hybrid-camp-v4";
const SESSION = "hybrid-camp-email";
const KIT_KEY = "hybrid-camp-kit-v1";
const RSVP_KEY = "hybrid-camp-tournament-rsvp-v1";

const defaultGroups = (): GroupMap =>
  Object.fromEntries(PEOPLE.filter((p) => p.role === "player").map((p) => [p.id, p.groupId]));

const defaultWeekGroups = (): WeekGroupMap =>
  Object.fromEntries(
    PEOPLE.filter((p) => p.role === "player").map((p) => [
      p.id,
      Object.fromEntries(p.weeks.map((week) => [week, p.groupId])),
    ]),
  );

function persist(state: {
  groups: GroupMap;
  weekGroups: WeekGroupMap;
  groupChangedAt: Record<string, string>;
  messages: CampMessage[];
  reviews: Record<string, CampReview>;
  notify: boolean;
}) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

function persistKits(kits: Record<string, KitChoice>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KIT_KEY, JSON.stringify(kits));
}

function persistRsvps(rsvps: TournamentRsvpBook) {
  if (typeof window === "undefined") return;
  localStorage.setItem(RSVP_KEY, JSON.stringify(rsvps));
}

function withGroup(person: CampPerson, groups: GroupMap): CampPerson {
  if (person.role !== "player") return person;
  return { ...person, groupId: groups[person.id] ?? person.groupId };
}

export const useCamp = create<CampState>((set, get) => ({
  ready: false,
  me: null,
  groups: defaultGroups(),
  weekGroups: defaultWeekGroups(),
  groupChangedAt: {},
  messages: [
    {
      id: "m1",
      fromId: "priya",
      body: "Tweaked my right ankle on the last session at home. It is taped and I can train, but wanted it flagged.",
      tag: "injury",
      at: "2027-02-06T16:10:00.000Z",
      seenBy: ["martha"],
    },
  ],
  reviews: {},
  notify: false,
  kits: {},
  rsvps: {},

  hydrate: () => {
    if (typeof window === "undefined") return;
    let groups = defaultGroups();
    let weekGroups = defaultWeekGroups();
    let groupChangedAt: Record<string, string> = {};
    let messages = get().messages;
    let reviews: Record<string, CampReview> = {};
    let notify = false;
    let kits: Record<string, KitChoice> = {};
    let rsvps: TournamentRsvpBook = {};
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = safeJsonParse<{
          groups?: GroupMap;
          weekGroups?: WeekGroupMap;
          groupChangedAt?: Record<string, string>;
          messages?: CampMessage[];
          reviews?: Record<string, CampReview>;
          notify?: boolean;
        }>(raw);
        if (parsed) {
          groups = { ...groups, ...parsed.groups };
          weekGroups = { ...weekGroups, ...parsed.weekGroups };
          groupChangedAt = parsed.groupChangedAt ?? {};
          if (parsed.messages?.length) messages = parsed.messages.slice(0, 80);
          reviews = parsed.reviews ?? {};
          notify = Boolean(parsed.notify);
        }
      }
      const kitRaw = localStorage.getItem(KIT_KEY);
      if (kitRaw) {
        const parsedKits = safeJsonParse<Record<string, KitChoice>>(kitRaw);
        if (parsedKits) kits = parsedKits;
      }
      const rsvpRaw = localStorage.getItem(RSVP_KEY);
      if (rsvpRaw) {
        const parsedRsvps = safeJsonParse<TournamentRsvpBook>(rsvpRaw);
        if (parsedRsvps) rsvps = parsedRsvps;
      }
    } catch {
      /* seed */
    }
    let email = sessionStorage.getItem(SESSION);
    if (email) {
      if (!sessionStillValid()) {
        sessionStorage.removeItem(SESSION);
        email = null;
      } else {
        beginSessionClock();
      }
    }
    const found = email ? PEOPLE.find((p) => p.email.toLowerCase() === email.toLowerCase()) : null;
    set({
      ready: true,
      groups,
      weekGroups,
      groupChangedAt,
      messages,
      reviews,
      notify,
      kits,
      rsvps,
      me: found ? withGroup(found, groups) : null,
    });
  },

  login: (email) => {
    const found = PEOPLE.find((p) => p.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) return false;
    const current = get().me;
    if (current?.email.toLowerCase() === found.email.toLowerCase()) {
      if (typeof window !== "undefined") sessionStorage.setItem(SESSION, found.email);
      return true;
    }
    if (typeof window !== "undefined") sessionStorage.setItem(SESSION, found.email);
    beginSessionClock();
    set({ me: withGroup(found, get().groups) });
    return true;
  },

  logout: () => {
    if (typeof window !== "undefined") sessionStorage.removeItem(SESSION);
    clearSessionClock();
    set({ me: null });
  },

  setGroup: (playerId, groupId, week) => {
    const player = PEOPLE.find((p) => p.id === playerId);
    const groups = week == null ? { ...get().groups, [playerId]: groupId } : get().groups;
    const current = get().weekGroups[playerId] ?? {};
    const nextWeeks =
      week == null
        ? Object.fromEntries((player?.weeks ?? [1, 2, 3]).map((item) => [item, groupId]))
        : { ...current, [week]: groupId };
    const weekGroups = { ...get().weekGroups, [playerId]: nextWeeks };
    const groupChangedAt = { ...get().groupChangedAt, [playerId]: new Date().toISOString() };
    const me = get().me;
    persist({
      groups,
      weekGroups,
      groupChangedAt,
      messages: get().messages,
      reviews: get().reviews,
      notify: get().notify,
    });
    set({
      groups,
      weekGroups,
      groupChangedAt,
      me: me && me.id === playerId ? { ...me, groupId: groupId ?? me.groupId } : me,
    });
  },

  sendMessage: async (tag, body) => {
    const me = get().me;
    if (!me) return;
    const text = clip(body, 1000);
    if (!text) return;
    const week = currentWeekId(CAMP_NOW, me);
    const groupId = groupOf(me, week, get().groups, get().weekGroups);
    const receipt = await postCampNote({
      data: {
        fromEmail: me.email,
        tag,
        body: text,
        week,
        groupId: groupId === "a" || groupId === "b" || groupId === "c" ? groupId : null,
      },
    });
    const messages = [
      {
        id: receipt.id,
        fromId: receipt.fromId,
        body: receipt.body,
        tag: receipt.tag,
        at: receipt.at,
        seenBy: [me.id],
        mailedTo: receipt.mailedTo,
        mailStatus: receipt.mailStatus,
      },
      ...get().messages,
    ].slice(0, 80);
    persist({
      groups: get().groups,
      weekGroups: get().weekGroups,
      groupChangedAt: get().groupChangedAt,
      messages,
      reviews: get().reviews,
      notify: get().notify,
    });
    set({ messages });
  },

  markSeen: (id) => {
    const me = get().me;
    if (!me) return;
    const current = get().messages.find((item) => item.id === id);
    if (!current || current.seenBy.includes(me.id)) return;
    const messages = get().messages.map((item) =>
      item.id === id ? { ...item, seenBy: [...item.seenBy, me.id] } : item,
    );
    persist({ groups: get().groups, weekGroups: get().weekGroups, groupChangedAt: get().groupChangedAt, messages, reviews: get().reviews, notify: get().notify });
    set({ messages });
  },

  replyTo: async (id, reply) => {
    const me = get().me;
    if (!me) return;
    const current = get().messages.find((item) => item.id === id);
    const receipt = await replyCampNote({
      data: {
        fromEmail: me.email,
        messageId: id,
        reply: clip(reply, 1000),
        fromId: current?.fromId,
        tag: current?.tag,
        body: current?.body,
      },
    });
    const messages = get().messages.map((item) =>
      item.id === id
        ? {
            ...item,
            id: receipt.id,
            reply: receipt.reply,
            seenBy: [...new Set([...item.seenBy, me.id])],
            mailedTo: receipt.mailedTo,
            mailStatus: receipt.mailStatus,
          }
        : item,
    );
    persist({
      groups: get().groups,
      weekGroups: get().weekGroups,
      groupChangedAt: get().groupChangedAt,
      messages,
      reviews: get().reviews,
      notify: get().notify,
    });
    set({ messages });
  },

  setNotify: (notify) => {
    persist({ groups: get().groups, weekGroups: get().weekGroups, groupChangedAt: get().groupChangedAt, messages: get().messages, reviews: get().reviews, notify });
    set({ notify });
  },

  saveReview: (body, marketing) => {
    const me = get().me;
    if (!me) return;
    const text = clip(body, 800);
    if (!text) return;
    const reviews = {
      ...get().reviews,
      [me.id]: { fromId: me.id, body: text, marketing, at: new Date().toISOString() },
    };
    persist({
      groups: get().groups,
      weekGroups: get().weekGroups,
      groupChangedAt: get().groupChangedAt,
      messages: get().messages,
      reviews,
      notify: get().notify,
    });
    set({ reviews });
  },

  saveKit: async (kit) => {
    const me = get().me;
    if (!me) return;
    const saved = await saveCampKit({
      data: {
        fromEmail: me.email,
        top: kit.top,
        shorts: kit.shorts,
        printName: kit.printName,
        country: kit.country,
      },
    });
    const kits = { ...get().kits, [me.id]: saved };
    persistKits(kits);
    set({ kits });
  },

  setRsvp: (eventId, value) => {
    const me = get().me;
    if (!me || me.role !== "player") return;
    const mine = { ...(get().rsvps[me.id] ?? {}), [eventId]: value };
    const rsvps = { ...get().rsvps, [me.id]: mine };
    persistRsvps(rsvps);
    set({ rsvps });
  },
}));
