
# Platform 9¾ Birthday Experience — Build Plan

A five-page narrative micro-site for Umema's birthday. Original magical aesthetic (no copyrighted assets), atmospheric particles, page-to-page fade-blur transitions, mobile-first. Stack adapted to the project's TanStack Start template.

## Stack & conventions

- TanStack Start + React 19 + Tailwind v4 (already installed).
- Framer Motion (`motion`) for animations, transitions, snitch physics.
- `canvas-confetti` for the finale burst.
- Fonts loaded via `<link>` in `src/routes/__root.tsx`: **Cinzel** (display) + **EB Garamond** (body).
- All copy in `src/content/siteContent.ts` — placeholder-but-lovely text you can rewrite later. Photo slots use gradient placeholders with captions.

## Design tokens (added to `src/styles.css`)

```
--maroon:    #7A1F2B
--gold:      #C9A85C
--ink:       #0D0D14
--parchment: #F0E6D2
--forest:    #1B4332
```

Mapped through `@theme inline` so Tailwind classes like `bg-ink`, `text-gold`, `border-maroon` work. Body defaults to ink background, parchment foreground, EB Garamond. Headings use Cinzel via `--font-display`.

## Routes

```
src/routes/
  __root.tsx          fonts, meta, particle background layer, page transitions
  index.tsx           / — The Letter
  sorting.tsx         /sorting — The Sorting Hat quiz
  map.tsx             /map — The Marauder's Map
  platform.tsx        /platform — Heartfelt letter
  celebration.tsx     /celebration — Snitch + confetti
```

Each route sets its own `head()` (title, description, og). Nav uses `<Link to="/sorting">` etc. No auth, no backend.

## Shared pieces (`src/components/`)

- `layout/ParticleBackground.tsx` — 40 floating embers via Framer Motion, fixed, `pointer-events-none`, low opacity.
- `layout/PageTransition.tsx` — wraps `<Outlet />` in `AnimatePresence` keyed by `location.pathname`; fade + slight blur + subtle y offset (0.6s).
- `ui/ContinueButton.tsx` — gold-outlined Cinzel button used across pages.

## Page-by-page

### 1. `/` The Letter
- Dark scene, embers drifting.
- Centered envelope (SVG) with a maroon wax seal (SVG "H"-style crest, original).
- Tap seal → seal cracks (two halves scale + rotate away), envelope flap opens, parchment letter slides up and unfolds (scaleY 0→1 with easing).
- Letter reveals invitation to "The [Friendship Name] School of Magic" (copy from siteContent).
- "Begin" continue button → `/sorting`.

### 2. `/sorting` The Sorting Hat
- Original stylized hat SVG at top with idle sway animation.
- `useQuizLogic` hook: 5 questions, each answer tagged with house weights. State machine advances one card at a time via `AnimatePresence` (slide + fade).
- Progress dots at top.
- After last question: hat "thinks" (wobble + glow, 2s), then reveal card — Gryffindor-primary with a Slytherin twist paragraph. Original crest built from CSS/SVG (shield + lion silhouette + serpent flourish), no trademarked art.
- Continue → `/map`.

### 3. `/map` The Marauder's Map
- Parchment-texture background (CSS radial + noise via SVG filter).
- Fade-in trigger line: *"I solemnly swear that I am up to no good."* Tap to unlock → dotted path + 5 footprint markers animate in.
- Each marker pulses; click opens a modal styled as unfolding parchment (scaleY origin-top) with a photo slot (gradient placeholder + caption from siteContent).
- Closing line + Continue → `/platform`.

### 4. `/platform` Heartfelt Letter
- Brick-wall texture (CSS gradient pattern). Prompt: "Tap to run through."
- Tap triggers full-screen blur + white flash + fade transition.
- Reveals long parchment scroll card with the heartfelt letter. Generous spacing, EB Garamond, drop-cap first letter in gold.
- Continue → `/celebration`.

### 5. `/celebration` Golden Snitch
- Snitch: gold sphere + two animated wings (SVG). Moves in a Perlin-ish path via `useAnimationFrame` bouncing off viewport bounds, slight jitter.
- Cursor becomes crosshair over snitch. On click: confetti burst (gold + maroon), snitch settles center, "Happy Birthday, Umema" headline fades in with final short message.
- Replay button → `/`.

## Content file (`src/content/siteContent.ts`)

Single typed export with sections: `letter`, `quiz` (questions + answer weights + reveal copy), `map` (array of {title, caption, imageSlot}), `platformLetter` (paragraphs), `celebration` (headline + message). All wording tasteful placeholders styled to the theme; easy find-and-replace later.

## Not doing (per your prompt)

- No Supabase / backend / guestbook.
- No copyrighted HP imagery, logos, or movie stills — all visuals are original SVG + CSS.
- No user accounts, analytics, or persistence.

## Deliverable

After build: 5 working routes, smooth transitions, mobile-tested layout, particle ambience, one editable content file. You then swap placeholder text + drop real photos into `public/images/memories/` and update the `imageSlot` paths in `siteContent.ts`.
