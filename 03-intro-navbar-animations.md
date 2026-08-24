# Intro / Navbar / Hero Animation Spec

> Adds to `01-website-structure.md` and `02-beachy-theme.md`. This file covers three specific changes requested:
> 1. The uploaded beach photo becomes the **Hero/intro background**, styled after hamishw.com's intro treatment.
> 2. Navbar moves from **top horizontal** to a **fixed left-side vertical navbar**.
> 3. Nav links get a **draw-on / draw-off underline** on hover (line animates in when hovered, animates back out when not).
> 4. On page load, the **name in the hero cycles through several languages, one word/line at a time, before settling on the English version** — a language-cycle intro reveal.

Reference asset: the uploaded photo (`Beach_Desktop_Wallpapers_Free_Download.jpg` — turquoise lagoon, white sand, palms) is the hero background. Save it to `public/images/hero/beach-hero.jpg` (compress/export a WebP version too for performance: `beach-hero.webp`).

---

## Phase 1 — Hero Background Photo

**Goal:** Replace the abstract 3D scene background with the real beach photo, treated the way hamishw.com treats its intro (big bold name over a clean backdrop, generous whitespace, confident typography) — but with a photo instead of a plain color.

**Steps:**
1. Set the uploaded photo as a full-bleed background image on the Hero section (`background-size: cover; background-position: center;`), OR render it inside a `<canvas>`/`<img>` layered behind the content — either approach works, `<img>` with `object-fit: cover` is simplest and best for performance.
2. Add a **dark gradient overlay** on top of the photo (e.g. `linear-gradient(180deg, rgba(11,42,61,0.15) 0%, rgba(11,42,61,0.55) 100%)`) so the white/light hero text stays readable against the bright sky and water.
3. Keep the existing 3D wave/sun-halo object (from `02-beachy-theme.md`) as an **optional foreground accent** floating over the photo — smaller and subtler than before, e.g. a soft glowing ring near the horizon line in the photo — rather than the dominant hero element. If it competes visually with the photo, cut it entirely for this version and let the photo carry the hero.
4. Add a **slow, subtle parallax** on the background photo: it drifts a few pixels opposite to scroll direction (translateY tied to scroll position) so it feels alive without being distracting. Respect `prefers-reduced-motion` — disable parallax for those users.
5. Optional: a soft, slow **zoom-in (Ken Burns effect)** on the photo over ~20–30s loop — image scales from `1.0` to `1.05` and holds, very subtle, restarts on loop.

**Content layout over the photo (matches hamishw.com's intro pattern):**
- Large name/title, left-aligned or centered depending on final layout choice
- Rotating role subtitle beneath it (Designer / Developer / etc., as already defined)
- Scroll-down cue at the bottom
- All text sits inside the gradient-overlay zone so it's legible regardless of where in the photo it sits

---

## Phase 2 — Left-Side Vertical Navbar

**Goal:** Move the navbar off the top edge and onto a fixed vertical column on the left side of the viewport, present on every page.

**Layout:**
- Fixed position, full viewport height, narrow width (e.g. `80–110px` collapsed, or `220–260px` if labels are always visible — pick one style, see options below)
- Structure top → bottom:
  1. **Logo/monogram** at the very top
  2. **Primary nav links** stacked vertically, vertically centered in the remaining space (Home, Work, About, Contact, etc.)
  3. **Social icons** stacked at the very bottom
- Background: translucent Deep Sea panel with `backdrop-blur`, OR fully transparent over the hero photo with just text/icons floating on it (choose based on contrast — test against the beach photo, since bright sky area may wash out light text)

**Two style options — pick one:**
- **Option A — Icon rail:** Narrow column (~80px), only icons/short glyphs visible by default; hovering a link expands a text label tooltip beside it.
- **Option B — Text rail:** Wider column (~220px), link labels always visible, stacked vertically with generous spacing (this most closely matches typical "side awwwards nav" style and is simpler to build first).

**Recommended for this build:** Option B (text rail) — simpler, more accessible by default, easier to layer the underline-draw hover effect onto full text labels.

**Responsive behavior:**
- Below `md`/tablet breakpoint: the left rail collapses into the existing hamburger + full-screen overlay menu pattern already defined in `01-website-structure.md` (a permanent left rail doesn't work well on narrow mobile viewports)
- Between mobile and desktop (tablet): consider collapsing to Option A (icon-only rail) to save horizontal space

**Page content offset:**
- All `<main>` content gets a `margin-left` / `padding-left` equal to the rail's width on desktop, so page content doesn't sit underneath the nav
- Hero photo can extend full-bleed behind the rail (rail sits on top with its own background/blur), while text content inside hero respects the offset

**Component changes:**
- `Navbar.jsx` restructured to render a vertical flex column instead of a horizontal row
- `NavLink.jsx` updated for the new underline hover behavior (Phase 3)
- Mobile hamburger logic stays as previously defined, just triggered from the collapsed rail instead of a top bar

---

## Phase 3 — Hover Underline Draw Animation

**Goal:** When hovering a nav link (e.g. "Home"), a thin line animates in — drawing itself under (or beside, since nav is now vertical) the text. When the cursor leaves, it animates back out the same way it came in, rather than just disappearing instantly.

**Mechanics (works for both a horizontal or vertical rail):**
1. Each nav link is wrapped so it has its own underline element — a `<span>` positioned absolutely, or an SVG `<line>`/`<path>`, sitting just below the link text (for a left rail, this can instead be a short line to the left of the text, or still underneath — underline reads cleanly either way).
2. Default state: the line exists in the DOM but is scaled to `0` width, anchored from one end (`transform-origin: left` if it should draw left→right, or `bottom` for a vertical variant).
3. On `mouseenter`: animate `transform: scaleX(0) → scaleX(1)` (or `scaleY` if vertical) over ~300–400ms with a soft ease (`power2.out` / CSS `cubic-bezier(0.22, 1, 0.36, 1)`).
4. On `mouseleave`: animate back `scaleX(1) → scaleX(0)`, but anchor the transform-origin to the **opposite end** so it looks like it draws back out the way it came (or the same end, for a simple retreat — test both, most awwwards-style sites retreat from the trailing edge for a satisfying "wipe" feel).
5. Use GSAP (`gsap.to()`) or a CSS transition — GSAP gives more control over easing and lets the draw/retreat directions differ; a CSS `transition: transform 0.35s cubic-bezier(...)` on `scaleX` is a lighter-weight alternative if GSAP feels like overkill just for this.
6. Color/weight: the drawn line uses the Golden Sand or Sunset Coral accent from the beachy palette, ~2px thick.
7. Currently-active section's nav link (the one the user has scrolled to) keeps its underline permanently visible (no need to hover) — layer this on top of the hover logic so the active link's line is always drawn, and hovering a different link temporarily draws its own line alongside.
8. Apply the exact same underline component/behavior to **every nav link** (Home, Work, About, Contact, etc.) and reuse it in the footer's secondary nav links for consistency.

**Accessibility:** also trigger the same animation on keyboard `:focus-visible`, not just mouse hover, so keyboard users see the same feedback.

---

## Phase 4 — Multi-Language Name Intro Animation

**Goal:** On first page load (during/after the loader), the hero name doesn't just appear — it **cycles through the name written in a few different languages/scripts, one at a time, before landing on the final English version**, like a quick flicker through translations that settles into place.

**Example sequence (name = placeholder "ELIJAH", swap for actual name):**
```
エリヤ        (Japanese)
   ↓
엘리야        (Korean)
   ↓
Элайджа       (Russian)
   ↓
Elías          (Spanish variant)
   ↓
ELIJAH        (English — final, stays)
```
Pick 3–5 languages max (including the final English) so the sequence feels quick and intentional, not gimmicky. Choose scripts that render well in the chosen display font, or load a fallback font stack that supports Latin, Cyrillic, CJK, etc. for the transition frames only.

**Timing/mechanics:**
1. Runs once, right after the loader finishes and the hero becomes visible (or can run *during* the tail end of the loader, with the final English name landing exactly as the loader wipes away — nice synced moment).
2. Each language variant displays for **~150–250ms**, swapped to the next with a quick, soft transition — a slight blur+fade or a quick vertical slide (translateY a few px + opacity 0→1→0) works well; avoid anything jarring/flashing.
3. Total sequence duration: roughly **1–1.5 seconds** across all variants, then the final English name settles in with a slightly longer, more confident reveal (e.g. 500–600ms ease-out) and **stays permanently** — this last step should feel distinctly more "settled" than the flickers before it (e.g. slight scale bounce-in or a letter-by-letter stagger reveal) so the user clearly registers "this is the real one."
4. Implementation: a simple state array of strings cycled with `setTimeout`/`setInterval` in React (or a GSAP timeline with labeled steps) — swap the displayed text content for each step, animate opacity/transform on each swap.
5. Pair with the rotating-role subtitle beneath it (already defined in the structure doc) — the subtitle can wait until the name settles, then run its own rotate-through-roles loop continuously afterward (name = one-time intro effect; subtitle = ongoing loop).
6. Respect `prefers-reduced-motion`: skip straight to the final English name with a simple fade, no cycling.

**Optional enhancement:** stagger this effect per-letter instead of swapping the whole word at once — each letter position independently cycles through a couple of language glyphs before locking into its final English letter, landing at slightly different times (a more elaborate "decoding" effect similar to a text-scramble animation). This is a nice-to-have upgrade once the simple whole-word version is working.

---

## Build Order Summary

| Phase | What | Depends on |
|---|---|---|
| 1 | Hero background photo + overlay + parallax | — |
| 2 | Left-side vertical navbar layout | — (can build in parallel with Phase 1) |
| 3 | Hover underline draw/retreat animation on nav links | Phase 2 (needs the rail in place) |
| 4 | Multi-language name intro cycle | Phase 1 (hero must exist), loader logic from `01-website-structure.md` |

Recommended order: **Phase 1 → Phase 2 → Phase 3 → Phase 4**, since the navbar and hero are structural, and the intro animation is a polish layer added once the hero text container exists.
