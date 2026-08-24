# Beachy Theme — Visual & Animation Spec

> Applies to the structure defined in `01-website-structure.md`. This file defines the **mood, color system, typography, and per-section animation/visual treatment** to turn the awwwards-style template into a beach/coastal-themed portfolio.

---

## 1. Mood Board / Concept

**Concept:** Golden-hour coastline — warm sand, deep ocean blue, soft coral accents, sunlight glinting on water. Feels relaxed but premium: think boutique surf brand or a high-end beach resort site, not "cartoon tropical."

Keywords: *sun-warmed, fluid, breathing, tactile, unhurried, glowing.*

Replace the reference template's "space / planet + golden ring" hero motif with an **ocean / horizon** motif — e.g. a stylized 3D wave, floating island, surfboard, or sun-over-water sphere with a rippling "ring" (the ring becomes a **sun halo** or **wave ripple ring** instead of a planetary ring — keeps the same animation rigging, new skin).

---

## 2. Color Palette

| Role | Name | Hex | Usage |
|---|---|---|---|
| Background (base) | Deep Sea | `#0B2A3D` | Dark background sections, nav-on-scroll |
| Background (alt) | Twilight Teal | `#123B4F` | Secondary section background |
| Primary accent | Sunset Coral | `#FF7F5C` | CTAs, links, highlight text |
| Secondary accent | Golden Sand | `#F4C87A` | Hero glow, hover underlines, numerals |
| Tertiary accent | Foam White | `#F7F3E9` | Body text on dark bg, card surfaces |
| Ocean blue (mid) | Lagoon | `#2F86A6` | Gradients, 3D wave material |
| Ocean blue (light) | Shallow Water | `#8FD6E1` | Highlights, glow, particle color |
| Neutral/dark text | Driftwood | `#2B2420` | Body text on light backgrounds |
| Light surface | Bone Sand | `#EFE6D8` | Light-mode section background (if used) |

**Gradient presets:**
- **Sunset gradient**: `#FF7F5C → #F4C87A → #FFE9C7` (hero glow, buttons)
- **Deep ocean gradient**: `#0B2A3D → #123B4F → #2F86A6` (page background, footer)
- **Foam gradient**: `#8FD6E1 → #F7F3E9` (dividers, wave SVGs)

Keep overall palette to **2 backgrounds + 2 accents + 1 neutral text** per section to avoid visual noise — swap gradient direction/intensity between sections instead of introducing new colors.

---

## 3. Typography

| Role | Style direction |
|---|---|
| Display / Headlines | Tall, slightly condensed serif or humanist sans with organic curves (e.g. something in the spirit of *Fraunces*, *Reckless*, or *Editorial New*) — evokes hand-lettered resort signage without being literal/cartoonish |
| Body | Clean geometric/humanist sans (e.g. *Inter*, *General Sans*, *Satoshi*) for legibility |
| Accent/numerals (section numbers, tags) | Monospace or condensed uppercase, letter-spaced — like stenciled beach-hut signage |

Type motion: headlines can have a subtle "wave" letter-stagger on reveal (each character/word rises with a slight delay + easing, like it's rolling in with the tide) rather than a flat fade.

---

## 4. Global Motion Language

- **Easing:** favor soft, fluid easing curves (`power2.out`, `sine.inOut`) — nothing snappy/mechanical. Motion should feel like water: gentle acceleration, slow settle.
- **Timing:** section reveals ~0.8–1.2s, staggered children ~60–100ms apart.
- **Recurring motif:** a sine-wave path used repeatedly — nav underlines, dividers, loader, cursor trail, button hover — for visual cohesion.
- **Respect `prefers-reduced-motion`:** swap wave/parallax/3D-rotation motion for simple opacity fades.

---

## 5. Section-by-Section Treatment

### 5.1 Loader
- Full-screen Deep Sea background
- Animated **sun rising over the horizon line** (simple SVG: circle rising behind a curved horizon path) as the loading indicator, OR a filling wave that rises to fill a percentage/logo mark
- Loading percentage text in Golden Sand
- Exit transition: horizon "sun" flashes/glows, then wipes up like a wave revealing the hero underneath

### 5.2 Navbar
- Transparent over hero; once scrolled, background becomes a frosted Deep Sea glass panel (`backdrop-blur` + translucent fill)
- Logo: simple wave or sun-glyph monogram
- Link hover state: **wave-shaped underline** draws in (SVG path animated via GSAP `drawSVG`-style stroke reveal) instead of a straight line
- Mobile overlay menu: background is a slow-moving gradient mimicking light refracting through water; links stagger in like items floating up

### 5.3 Hero
- 3D scene: replace "planet + ring" with a **stylized low-poly wave crest / floating island / sun-and-horizon sphere** with a soft "halo ring" (glow ring using Golden Sand emissive material) that pulses gently, echoing the original ring's rotation but reading as a sun-glare halo
- Background: Deep-sea-to-sunset vertical gradient
- Ambient particles: slow-drifting **light specks / bubbles / sand motes** instead of stars/dust
- Headline: name + rotating role text (Designer / Developer / Surfer of interfaces — playful optional line)
- Scroll cue: an icon of a small wave or an animated "downward ripple" arrow, gently bobbing
- Optional: soft looping ambient wave-audio toggle (muted by default, user opt-in only — never autoplay with sound)

### 5.4 Service Summary / Intro Marquee
- Horizontal scroll-linked text band, background tinted Twilight Teal
- Text glides like it's drifting on a current; direction/speed tied to scroll (as defined in structure doc)
- Optional thin wave-pattern SVG divider above/below the band

### 5.5 Works / Projects
- Cards on Foam White or translucent glass surfaces over the dark background
- On hover: preview image reveals with a **clip-path wipe that mimics a wave washing over the image** (diagonal or curved wipe, not a plain fade)
- Card border/accent: thin Golden Sand line that "fills in" like a tide line on hover
- Custom cursor over cards morphs into a small circular "View" bubble tinted Sunset Coral
- Tags/pills styled like small shell or pebble chips (soft rounded, subtle drop shadow)

### 5.6 About
- Portrait image revealed via a **clip-path shaped like a wave crest or shoreline curve** (animated open on scroll, not a hard rectangle wipe)
- Bio text: line-by-line reveal, each line drifting up slightly as it fades in (like surfacing from underwater)
- Background: soft Bone Sand or light gradient panel to contrast the dark hero/works sections — signals "landing on the beach" after the "ocean" sections above
- Small decorative SVG accents (a single gull silhouette, a subtle wave line under the heading) — keep minimal, avoid literal clipart tropicana

### 5.7 Marquee Bands (secondary)
- Repeating skills/tools text or a tagline ("Building calm, considered interfaces" etc.)
- Background: thin animated wave-line SVG loop behind the text, moving opposite direction to the text for parallax depth
- Text color alternates Foam White / Golden Sand per repetition for subtle rhythm

### 5.8 Contact
- Background returns to Deep Sea / sunset gradient — "returning to the water at dusk"
- Large heading with the wave letter-stagger reveal
- Email link: on hover, an animated **paper-boat or ripple** trail follows the cursor briefly
- Form fields (if used): minimal, underline-only inputs; underline animates in as a wave draw-on when focused
- Social icons: simple line icons, hover state ripples outward (radial scale + fade, like a droplet)

### 5.9 Footer
- Deep Sea background with a **wave SVG divider** (animated, slow horizontal drift loop) separating it from Contact
- Copyright + credit line in small Foam White text
- "Back to top" control styled as a small rising sun/bubble icon, scrolls smoothly to hero

---

## 6. Cursor & Micro-interactions
- Custom cursor: small circle with a soft glow (Golden Sand), leaves a brief fading trail (like light on water) as it moves
- Buttons: on hover, a subtle **ripple expands from the click/hover point** (radial gradient scale + fade) rather than a flat color swap
- Links (inline): underline animates in left-to-right with a slight wave curve instead of a straight line
- Scroll-triggered numerals (section indices "01", "02"...) can have a soft glow pulse as they enter view

---

## 7. Asset Checklist
- [ ] 3D model or procedural geometry for hero wave/island/sun-halo object
- [ ] Wave-pattern SVGs (for dividers, underlines, clip-paths) — at least 2–3 variants for visual variety
- [ ] Loader sun/horizon animation asset
- [ ] Particle/bubble texture (small circular sprite, soft glow)
- [ ] Icon set restyled in a consistent line-weight matching the organic wave motif
- [ ] Optional ambient wave-sound loop (short, seamless, user-toggled only)
- [ ] Two font families licensed/self-hosted (display + body, per Section 3)

---

## 8. What to Avoid
- Literal tropical clipart (palm trees, cocktails, cartoon suns) — keep it editorial/premium, not "vacation brochure"
- Overusing bright saturated blue/orange together at full strength — lean on the muted Deep Sea / Twilight Teal base so Coral and Golden Sand pop as accents, not the whole palette
- Autoplaying audio
- Motion that doesn't ease — anything linear or "bouncy/cartoonish" breaks the calm-water feel; keep all easing soft and fluid
