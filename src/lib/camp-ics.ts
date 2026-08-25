import type { CampEvent } from "@/data/camp";

function stamp(iso: string) {
  return iso.replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function icsEscape(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("\r", "").replaceAll("\n", "\\n").replaceAll(",", "\\,").replaceAll(";", "\\;");
}

export function isLunchBreak(event: CampEvent) {
  return event.kind === "break" || /lunch/i.test(event.title);
}

export function inviteEvents(events: CampEvent[]) {
  return events.filter((event) => !isLunchBreak(event));
}

export function eventDescription(event: CampEvent, coachView = false) {
  if (coachView && event.staffNote) return `${event.detail}\n\nOn you: ${event.staffNote}`;
  return event.detail;
}

function hasReminder(event: CampEvent) {
  return event.kind === "session" || event.kind === "tournament";
}

function vevent(event: CampEvent, coachView = false) {
  const lines = [
    "BEGIN:VEVENT",
    `UID:${event.id}@hybridvacations.com`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(event.start)}`,
    `DTEND:${stamp(event.end)}`,
    `SUMMARY:${icsEscape(event.title)}`,
    `LOCATION:${icsEscape(event.place)}`,
    `DESCRIPTION:${icsEscape(eventDescription(event, coachView))}`,
  ];
  if (hasReminder(event)) {
    lines.push(
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      "TRIGGER:-PT30M",
      `DESCRIPTION:${icsEscape(event.title)} starts in 30 minutes`,
      "END:VALARM",
    );
  }
  lines.push("END:VEVENT");
  return lines.join("\r\n");
}

export function eventIcs(event: CampEvent, coachView = false) {
  return calendar([event], event.title, coachView);
}

export function weekIcs(events: CampEvent[], coachView = false) {
  return calendar(inviteEvents(events), "Hybrid Lanzarote camp", coachView);
}

function calendar(events: CampEvent[], name: string, coachView = false) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hybrid Vacations//Lanzarote Camp//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${icsEscape(name)}`,
    ...events.map((event) => vevent(event, coachView)),
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export function googleUrl(event: CampEvent, coachView = false) {
  const dates = `${stamp(event.start)}/${stamp(event.end)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates,
    details: eventDescription(event, coachView),
    location: event.place,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function googleWeekUrl(events: CampEvent[], name: string, coachView = false) {
  const first = events[0];
  if (!first) return "https://calendar.google.com/calendar/r";
  if (events.length === 1) return googleUrl(first, coachView);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: name,
    dates: `${stamp(first.start)}/${stamp(events[events.length - 1]?.end ?? first.end)}`,
    details: events
      .map((event) => `${event.start.slice(11, 16)} ${event.title}`)
      .join("\n"),
    location: first.place,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function icsFile(events: CampEvent[], name: string, coachView = false) {
  return new File([weekIcs(events, coachView)], `${name.replace(/\s+/g, "-").toLowerCase()}.ics`, {
    type: "text/calendar",
  });
}
