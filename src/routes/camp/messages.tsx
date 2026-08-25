import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { PEOPLE, groupOf } from "@/data/camp";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCamp } from "@/lib/camp-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/camp/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  const me = useCamp((s) => s.me);
  const groups = useCamp((s) => s.groups);
  const weekGroups = useCamp((s) => s.weekGroups);
  const messages = useCamp((s) => s.messages);
  const sendMessage = useCamp((s) => s.sendMessage);
  const markSeen = useCamp((s) => s.markSeen);
  const replyTo = useCamp((s) => s.replyTo);
  const [tag, setTag] = useState<"injury" | "illness" | "other">("injury");
  const [body, setBody] = useState("");
  const [reply, setReply] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [mailError, setMailError] = useState("");

  useEffect(() => {
    if (!me) return;
    messages.forEach((item) => {
      const from = PEOPLE.find((p) => p.id === item.fromId);
      const fromGroupMatch =
        from &&
        me.role !== "player" &&
        from.role === "player" &&
        (me.role === "head" ||
          from.weeks.some(
            (week) =>
              me.weeks.includes(week) &&
              groupOf(from, week, groups, weekGroups) === (me.leadsGroup ?? me.groupId),
          ));
      const mine = item.fromId === me.id;
      const forCoach = Boolean(fromGroupMatch);
      if ((mine || forCoach) && !item.seenBy.includes(me.id)) markSeen(item.id);
    });
    // Intentionally once per visit to this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?.id]);

  if (!me) return null;

  const visible = messages.filter((item) => {
    if (me.role === "player") return item.fromId === me.id;
    const from = PEOPLE.find((p) => p.id === item.fromId);
    if (!from) return false;
    if (me.role === "head") return from.role === "player";
    return (
      from.role === "player" &&
      from.weeks.some(
        (week) =>
          me.weeks.includes(week) &&
          groupOf(from, week, groups, weekGroups) === (me.leadsGroup ?? me.groupId),
      )
    );
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Private</p>
      <h1 className="mt-2 font-display text-5xl text-fg sm:text-6xl">
        {me.role === "player" ? "Message the coaches" : "Player messages"}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        {me.role === "player"
          ? "Injury, illness, or something you do not want on the sand in front of the group. This emails your group coach and Mark, and sits here for them too. Not the other players."
          : "Private notes from your players. Mark is copied on every email. A reply here emails the player and Mark as well."}
      </p>

      {me.role === "player" ? (
        <form
          className="mt-8 grid gap-4 rounded-md bg-surface p-5 shadow-border"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!body.trim() || busy) return;
            setBusy(true);
            setMailError("");
            try {
              await sendMessage(tag, body);
              setBody("");
            } catch (err) {
              setMailError(err instanceof Error ? err.message : "That note did not send.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <div>
            <Label htmlFor="tag">About</Label>
            <select
              id="tag"
              value={tag}
              onChange={(e) => setTag(e.target.value as typeof tag)}
              className="h-11 w-full rounded-sm border border-border bg-bg px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <option value="injury">Injury</option>
              <option value="illness">Illness</option>
              <option value="other">Something else</option>
            </select>
          </div>
          <div>
            <Label htmlFor="note">Message</Label>
            <Textarea
              id="note"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What is going on, and what you need today."
            />
          </div>
          {mailError ? <p className="text-sm text-accent">{mailError}</p> : null}
          <Button type="submit" disabled={busy}>
            {busy ? "Sending…" : "Send to coaches"}
          </Button>
        </form>
      ) : null}

      {mailError && me.role !== "player" ? <p className="mt-6 text-sm text-accent">{mailError}</p> : null}

      {visible.length ? (
        <ul className="mt-10 space-y-4">
          {visible.map((item) => {
            const from = PEOPLE.find((p) => p.id === item.fromId);
            return (
              <li key={item.id} className="rounded-md bg-surface p-5 shadow-border">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{item.tag}</p>
                <p className="mt-2 text-sm font-semibold text-fg">
                  {from?.name} · {format(new Date(item.at), "d MMM, HH:mm")}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-fg">{item.body}</p>
                {item.mailedTo?.length ? (
                  <p className="mt-2 text-xs text-muted">
                    {item.mailStatus === "sent" ? "Emailed" : "Queued to"} {item.mailedTo.join(" and ")}
                  </p>
                ) : null}
                {item.reply ? (
                  <p className="mt-3 text-sm leading-relaxed text-muted">Reply: {item.reply}</p>
                ) : me.role !== "player" ? (
                  <form
                    className="mt-4 grid gap-2"
                    onSubmit={async (event) => {
                      event.preventDefault();
                      const text = reply[item.id]?.trim();
                      if (!text || busy) return;
                      setBusy(true);
                      setMailError("");
                      try {
                        await replyTo(item.id, text);
                        setReply((current) => ({ ...current, [item.id]: "" }));
                      } catch (err) {
                        setMailError(err instanceof Error ? err.message : "That reply did not send.");
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    <textarea
                      value={reply[item.id] ?? ""}
                      onChange={(e) => setReply((current) => ({ ...current, [item.id]: e.target.value }))}
                      rows={2}
                      className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      placeholder="Reply to this player"
                    />
                    <Button type="submit" size="sm" disabled={busy}>
                      {busy ? "Sending…" : "Send reply"}
                    </Button>
                  </form>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}

      <ReviewBlock />
    </main>
  );
}

function ReviewBlock() {
  const me = useCamp((s) => s.me);
  const reviews = useCamp((s) => s.reviews);
  const saveReview = useCamp((s) => s.saveReview);
  const [body, setBody] = useState("");
  const [marketing, setMarketing] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  if (!me) return null;
  const existing = reviews[me.id];

  return (
    <section className="mt-14 border-t border-border pt-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">After the week</p>
      <h2 className="mt-2 font-display text-4xl text-fg">Leave a review</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        How the week actually felt. If you say yes, we may use your name and these words on the
        site or Instagram. No is fine. It still comes to us.
      </p>

      {existing ? (
        <div className="mt-6 rounded-md bg-surface p-5 shadow-border">
          <p className="text-sm leading-relaxed text-fg">{existing.body}</p>
          <p className="mt-3 text-xs uppercase tracking-wide text-muted">
            {existing.marketing ? "Yes, we can use this" : "No, keep it private"}
          </p>
        </div>
      ) : (
        <form
          className="mt-6 grid gap-4 rounded-md bg-surface p-5 shadow-border"
          onSubmit={(event) => {
            event.preventDefault();
            if (!body.trim()) {
              setError("Write a few words first.");
              return;
            }
            if (marketing === null) {
              setError("Yes or no on using this.");
              return;
            }
            saveReview(body, marketing);
          }}
        >
          <div>
            <Label htmlFor="review">Your review</Label>
            <Textarea
              id="review"
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                setError("");
              }}
              placeholder="The week, the coaching, the group."
            />
          </div>
          <div>
            <p className="text-sm font-medium text-fg">Can we use this for marketing?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setMarketing(true);
                  setError("");
                }}
                className={cn(
                  "h-11 min-w-24 rounded-sm px-4 text-xs font-semibold uppercase tracking-wide",
                  marketing === true ? "bg-accent text-accent-fg" : "bg-bg text-muted hover:text-fg",
                )}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => {
                  setMarketing(false);
                  setError("");
                }}
                className={cn(
                  "h-11 min-w-24 rounded-sm px-4 text-xs font-semibold uppercase tracking-wide",
                  marketing === false ? "bg-accent text-accent-fg" : "bg-bg text-muted hover:text-fg",
                )}
              >
                No
              </button>
            </div>
          </div>
          {error ? <p className="text-sm text-accent">{error}</p> : null}
          <Button type="submit">Send review</Button>
        </form>
      )}
    </section>
  );
}
