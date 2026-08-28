# Story Time — add to the current Hybrid Vacations site

This is a **feature pack**, not a site replacement.

Do **not** clone, reset, or overwrite the workspace.
Do **not** `git pull` / `git checkout main` in a way that replaces work since 25 Aug.
Copy **only** the files listed below from GitHub, then make the small wiring edits.

Repo: `https://github.com/jordanjblake-ai/mint-topaz-ivory-turbo`
Branch: `story-time`

Raw file base:
`https://raw.githubusercontent.com/jordanjblake-ai/mint-topaz-ivory-turbo/story-time/`

---

## 1. Copy these files in full (create folders if missing)

| Destination | Source on branch `story-time` |
|---|---|
| `src/components/story/HybridStory.tsx` | `src/components/story/HybridStory.tsx` |
| `src/components/story/story.css` | `src/components/story/story.css` |
| `src/data/scenes.ts` | `src/data/scenes.ts` |
| `src/lib/sound.ts` | `src/lib/sound.ts` |
| `src/lib/ios-press.ts` | `src/lib/ios-press.ts` |
| `src/routes/story-time.tsx` | `src/routes/story-time.tsx` |
| `src/routes/history.tsx` | `src/routes/history.tsx` |
| `public/art/*.jpg` (16 plates) | `public/art/` |
| `public/logos/logo-badge.png` | `public/logos/logo-badge.png` |
| `public/logos/logo-wordmark.png` | `public/logos/logo-wordmark.png` |

`public/art/` files:

```
00-title.jpg
01-empty-court.jpg
02-founding.jpg
03-lanzarote.jpg
04-first-camp.jpg
05-performance.jpg
06-uk-tour.jpg
07-london.jpg
08-champions.jpg
09-world-tour.jpg
10-2027.jpg
ch-01.jpg
ch-02.jpg
ch-03.jpg
ch-04.jpg
ch-05.jpg
```

If `src/lib/sound.ts` or `src/lib/ios-press.ts` already exist and are **this** Hybrid story audio / iOS press helper, keep them. If they are something else, put the story copies at `src/lib/story-sound.ts` and `src/lib/story-press.ts` and retarget the imports in `HybridStory.tsx`.

Do not copy `src/styles.css`, `src/routes/index.tsx`, `vite.config.ts`, or `package.json` from this branch — those belong to an older snapshot.

---

## 2. Wire into the current site (edit, don’t replace)

### Nav — `src/data/site.ts`

Add Story Time. If a History item exists, replace it.

```ts
{ label: "Story Time", href: "/story-time" },
```

Keep it with About / Contact. Footer should already map over `nav`.

### Immersive chrome — `src/components/layout/site-shell.tsx`

Story Time has no site header, footer, cookie banner, or tracking. Treat it like `/ops` and `/camp`:

```ts
pathname.startsWith("/story-time") ||
pathname === "/history";
```

### Header overflow

Seven nav items can wrap at 1280px. If the desktop nav is `lg:flex` with a large gap, switch it to `xl:flex` and `gap-4`, and the hamburger to `xl:hidden`.

### Homepage band — `src/routes/index.tsx`

Add a short band before the main CTA (do not remove existing homepage work):

```tsx
<Section className="bg-surface">
  <Container>
    <Kicker>Story Time</Kicker>
    <Display className="mt-2 text-5xl sm:text-6xl">The story isn’t finished.</Display>
    <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
      Sixteen months from a name to a world-tour court. Scroll the Hybrid history
      as a graphic novel — still open at 2027.
    </p>
    <Button asChild className="mt-8">
      <Link to="/story-time">Open Story Time</Link>
    </Button>
  </Container>
</Section>
```

### Fonts — wherever the Google Fonts stylesheet is built (`src/lib/cdn.ts` or `__root.tsx`)

Keep the site’s existing families. **Add** (do not replace):

- `Anton`
- `Caveat:wght@500;600`
- `Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400`

### CDN allowlist — `src/lib/cdn.ts` (if it has `CDN_PATHS`)

Add `"/art/"` and `"/logos/"` if missing.

### SEO / sitemap

- Add `{ path: "/story-time", changefreq: "monthly", priority: "0.6" }` to public pages.
- Add `https://hybridvacations.com/story-time` to `public/sitemap.xml` if that file is static.

### Wix / old History URLs — `src/data/wix-redirects.ts`

```ts
"/history": "/story-time",
```

`src/routes/history.tsx` already 307-redirects `/history` → `/story-time`. Keep that even if History never shipped.

---

## 3. Behaviour you must keep

- Full-bleed scrollytelling. No site chrome on `/story-time`.
- Whisper **Hybrid** top-left links home (`class="story-home"`).
- Sound is optional. Labelled toggle, default on. Unlock only from a real tap/click, never from scroll.
- **Do not** put back a blocking BEGIN overlay.
- Official Hybrid marks only. Never both wordmark and badge on one frame. No fake HYBRID lettering on kits.
- Chapters I–V, per-scene colour grades, sticky full-viewport plates.

---

## 4. Done when

- Nav / footer show **Story Time**, not History.
- `/story-time` opens the ink story.
- `/history` redirects there.
- Homepage still looks like the **current** Hybrid Vacations site (work since 25 Aug intact), plus the Story Time band.
- Mobile 390px: no horizontal overflow; hamburger includes Story Time.
