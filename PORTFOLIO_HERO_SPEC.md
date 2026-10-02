# PORTFOLIO SPEC: "DIVE": Water Ripple Hero + Projects

> **Instruction to the AI reading this:**
> You are a senior creative front-end developer. Build exactly what is described below. Follow every section in order. Do not skip the accessibility, performance, or fallback requirements. Where you see `{{PLACEHOLDER}}`, use the sample content provided, and make it trivially easy to replace (keep all content in one `content.js` / `content.ts` file). Ask me before changing the concept, stack, or palette.

---

## 1. Project Overview

| Item | Value |
|---|---|
| Owner | **Rehan Patel** |
| Role | UI/UX Designer |
| Type | Single-page personal portfolio |
| Concept | "Dive": the visitor starts at the **water surface** (hero) and **dives deeper** as they scroll into the **Projects** section |
| Mood | Calm, premium, immersive, modern, slightly playful |
| Primary goal | Make recruiters/clients say "wow" in 3 seconds, then guide them to the work |

### The original rough idea (for context)

```
        REHAN PATEL
        UI/UX Designer
             ◉
        EXPLORE WORK
              ↓
        ~ ~ ~ ~ ~ ~ ~
      🌊 WATER RIPPLE 🌊
              ↓
          DIVE...
      → then show Projects section
```

This spec upgrades that idea into a polished, high-end experience.

---

## 2. Recommended Tech Stack

Use this unless told otherwise:

- **Framework:** React 18 + Vite (or Next.js App Router if SSR is needed)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS variables for design tokens
- **Animation:** GSAP + ScrollTrigger (scroll, text reveals, depth transition)
- **Smooth scroll:** Lenis
- **Water effect:** Raw WebGL (or `ogl` / `three.js`) with a custom fragment shader
- **Fonts:** Google Fonts: **"Clash Display"** or **"Syne"** (headings), **"Inter"** or **"General Sans"** (body), **"JetBrains Mono"** (small labels)
- **Deploy target:** Vercel / Netlify

> Fallback if the user wants zero build tools: plain HTML + CSS + vanilla JS + CDN GSAP, same visuals.

---

## 3. Design System

### 3.1 Color tokens (define as CSS variables)

```css
:root {
  /* Surface (top of page) */
  --surface-1: #E8F7FF;
  --surface-2: #BDE8FA;

  /* Depth gradient (scroll-driven) */
  --depth-1: #5CC8F2;   /* shallow */
  --depth-2: #1E7FC4;   /* mid */
  --depth-3: #0B3C7A;   /* deep */
  --depth-4: #050B24;   /* abyss (projects bg) */

  /* Accents */
  --accent: #7CF5E1;    /* aqua glow */
  --accent-2: #A78BFA;  /* soft violet, used sparingly */

  --text-on-light: #07182B;
  --text-on-dark: #EAF6FF;
  --muted: rgba(234, 246, 255, 0.6);

  --glass-bg: rgba(255, 255, 255, 0.08);
  --glass-border: rgba(255, 255, 255, 0.18);
}
```

### 3.2 Typography

| Use | Font | Size (desktop) | Weight |
|---|---|---|---|
| Name (hero H1) | Clash Display / Syne | `clamp(3.5rem, 11vw, 10rem)` | 600–700 |
| Role | Inter | `clamp(1rem, 2vw, 1.5rem)` | 400, letter-spacing `0.3em`, uppercase |
| Section titles | Clash Display | `clamp(2.5rem, 6vw, 5rem)` | 600 |
| Body | Inter | 16–18px | 400 |
| Labels / meta | JetBrains Mono | 12px, uppercase | 500 |

### 3.3 Motion principles

- Easing: `power3.out` / `expo.out` for entrances, `sine.inOut` for ambient loops
- Durations: entrance 0.8–1.4s, hover 0.3–0.5s
- Nothing should feel snappy or robotic. Everything should feel like it's moving **through water**: soft, slightly delayed, flowing

---

## 4. Page Structure

```
<body>
 ├─ <CustomCursor />            (desktop only)
 ├─ <DepthMeter />              (fixed side indicator)
 ├─ <Navbar />                  (minimal, glass)
 ├─ <Hero />                    (SURFACE: water ripple canvas)
 ├─ <DiveTransition />          (scroll-driven zone between hero and projects)
 ├─ <Projects />                (DEEP: project cards)
 ├─ <About /> (optional)        (placeholder: ask user)
 └─ <Contact /> (optional)      (placeholder: ask user)
```

---

## 5. HERO SECTION (Surface)

### 5.1 Layout (100vh, centered)

Top to bottom, centered:

1. **Small label** (mono): `PORTFOLIO — 2026` (top-left) and `AVAILABLE FOR WORK ●` (top-right, green pulsing dot)
2. **Name:** `REHAN PATEL` (giant, kinetic text)
3. **Role:** `UI/UX DESIGNER` (wide letter-spacing)
4. **Short tagline** (1 line): `I design calm, clear digital experiences that people actually enjoy using.`
5. **Floating orb button:** circular glass button with a ◉ inside, label `EXPLORE WORK` curving around it (rotating SVG text path)
6. **Scroll cue:** animated arrow ↓ + small text `DIVE...`

### 5.2 The Water Ripple Effect (core feature)

**Background:** a full-screen WebGL canvas behind all hero content (`position: fixed/absolute; inset: 0; z-index: 0`).

**Base image/gradient to distort:**
- A soft gradient from `--surface-1` → `--depth-1` with a subtle caustics texture overlay (procedural noise in the shader, no external image needed)

**Ripple behavior:**
1. **On mouse move:** spawn small, fast-fading ripples along the cursor path (throttle: max 1 every ~40ms)
2. **On click/tap:** spawn one large, slow ripple
3. **On page load:** auto-spawn 1 ripple at center after 600ms as a "welcome drop"
4. **Idle state:** very subtle ambient wave motion (low-amplitude sine/noise) so the water never looks dead

**Shader approach (implement this):**

Keep a uniform array of up to **12 active ripples**: `vec3 uRipples[12]` = `(x, y, startTime)` plus `uRippleCount`.

For each fragment:

```glsl
vec2 uv = vUv;
vec2 offset = vec2(0.0);

for (int i = 0; i < 12; i++) {
  if (i >= uRippleCount) break;
  vec2 center = uRipples[i].xy;
  float age = uTime - uRipples[i].z;
  float dist = distance(uv * aspectCorrection, center * aspectCorrection);

  float radius = age * speed;                         // expanding ring
  float wave   = sin((dist - radius) * frequency);    // ripple wave
  float falloff = exp(-age * decay) * exp(-abs(dist - radius) * ringSharpness);

  vec2 dir = normalize(uv - center);
  offset += dir * wave * falloff * amplitude;
}

vec2 distortedUV = uv + offset;
// sample/generate base color with distortedUV
// add specular highlight where offset magnitude is high (fake light on wave crest)
```

Suggested starting values: `speed 0.35`, `frequency 45.0`, `decay 1.6`, `ringSharpness 12.0`, `amplitude 0.012`. Tune until it feels like real water.

**Extras to add in the shader (this is what makes it look premium):**
- **Caustics:** animated light-pattern overlay (layered, moving Voronoi/noise)
- **Specular shine** on ripple crests (white-ish, low opacity)
- **Chromatic aberration** of 1–2px that scales with ripple intensity
- **Soft vignette** at edges

**Performance rules for the canvas:**
- Clamp device pixel ratio: `Math.min(window.devicePixelRatio, 2)`
- Pause the render loop when the hero is off-screen (IntersectionObserver)
- Pause when the tab is hidden (`visibilitychange`)
- Handle resize with a debounce
- **Fallback:** if WebGL is unavailable, or `prefers-reduced-motion: reduce`, show a static CSS gradient with a CSS-only gentle wave animation (SVG wave layers)

### 5.3 Extra visual polish for the hero ("make it more good looking")

Implement all of these:

1. **Kinetic name reveal:** split `REHAN PATEL` into letters; each letter rises from below with a mask + slight blur → sharp, staggered 0.04s
2. **Letters react to ripples:** on hover, each letter gently shifts/skews as if floating on water (small `y` and `rotate` offset based on distance to cursor)
3. **Floating bubbles:** 15–25 small translucent circles drifting upward at different speeds/sizes (CSS or canvas), with a soft wobble
4. **Glassmorphism orb button:** circular, `backdrop-filter: blur(16px)`, glass border, inner glow; **magnetic effect** (the button gently follows the cursor within ~80px); on hover, it spawns a ripple in the water behind it
5. **Rotating circular text** around the orb: `EXPLORE WORK • EXPLORE WORK •`
6. **Light rays:** 2–3 soft diagonal "god ray" beams from the top, slow-moving, low opacity, `mix-blend-mode: soft-light`
7. **Film grain overlay:** very subtle noise at ~4% opacity for a premium feel
8. **Custom cursor:** small dot + larger trailing ring; ring expands into a "ripple" on click; hide on touch devices

---

## 6. DIVE TRANSITION (Hero → Projects)

This is the signature moment. Triggered by clicking **EXPLORE WORK** or scrolling.

**On click of EXPLORE WORK:**
1. Fire a big ripple from the button's position
2. Hero content (name, role, tagline) fades/blurs/scales down slightly (0.6s)
3. Smooth-scroll (Lenis `scrollTo`) to `#projects` with a 1.6s `expo.inOut` ease
4. During scroll, the "DIVE" effect plays (below)

**Scroll-driven dive (GSAP ScrollTrigger, scrub):**
- Background color interpolates: `--surface-1` → `--depth-1` → `--depth-2` → `--depth-3` → `--depth-4`
- A **waterline** (wavy SVG edge) passes upward through the screen as the user crosses from surface to underwater
- Bubbles speed up and rise past the viewport
- Light rays fade out gradually
- Caustics intensity decreases with depth
- Text color switches from `--text-on-light` to `--text-on-dark` at the waterline crossing
- A big word **`DIVE`** appears huge and outlined (stroke only), parallax-scrolling, then dissolves

**Depth Meter (fixed, right edge, desktop only):**
- Thin vertical line with a small marker
- Displays live depth in meters: `0m` at hero → `10m` at projects start → scales with scroll progress
- Mono font, subtle, low opacity

---

## 7. PROJECTS SECTION (Deep)

Section id: `#projects`. Background: deep navy (`--depth-4`) with faint floating particles ("plankton") and slow-moving caustic light at the top fading out.

### 7.1 Header

- Label (mono): `SELECTED WORK — (06)`
- Title: `Projects` or `Things I've made underwater` (pick one; keep it easy to change)
- Short line: `Case studies from research to final pixels.`

### 7.2 Project card layout (pick the best, build as a switchable layout)

**Primary layout: Alternating large cards (vertical scroll)**
- Each card is large (≈ 80vw, max 1200px), with a big cover image/mockup, project number, title, category tags, year, and a "View case study →" link
- Cards **rise from the depths** as they enter the viewport (translate Y + blur→sharp + opacity)
- Cover image has a **parallax** inner movement on scroll

**Optional alternate layout: Horizontal pinned scroll gallery** (GSAP pin + horizontal scrub). Provide a config flag `layout: "vertical" | "horizontal"`.

### 7.3 Card hover interactions

- Cover image gets a **water ripple/displacement** distortion on hover (small WebGL or SVG `feTurbulence` + `feDisplacementMap` filter)
- Title letters shift slightly
- Cursor changes to a "VIEW" bubble
- Card border glows with `--accent` at low opacity

### 7.4 Project data (put in `content.ts`)

Use this structure. Include 6 sample projects until the user supplies real ones:

```ts
export const projects = [
  {
    id: "01",
    title: "{{Project Name}}",
    category: ["UI/UX", "Mobile App"],   // tags
    year: "2026",
    role: "Lead Designer",
    description: "One or two lines about the problem and outcome.",
    cover: "/projects/01-cover.jpg",
    link: "/work/project-name",          // case study or external URL
    color: "#7CF5E1"                     // optional per-project accent
  },
  // ...5 more
];
```

### 7.5 Below the cards

- CTA: `Have a project in mind?` → button `Let's talk` (opens mailto or scrolls to Contact)
- A subtle "surface again ↑" button that scrolls back to the top with a reverse-dive

---

## 8. Navbar

- Fixed, centered pill, glass effect
- Items: `Work`, `About`, `Contact`, plus a small `Resume ↗`
- Hides on scroll down, shows on scroll up
- Adapts text color to the section behind it (light on dark, dark on light)
- Mobile: collapses to a menu button with a full-screen overlay (ripple-reveal animation)

---

## 9. Responsive Behavior

| Breakpoint | Changes |
|---|---|
| ≥1280px | Full experience, custom cursor, depth meter, all effects |
| 768–1279px | Reduce bubbles to 10, ripple count max 8, hide depth meter |
| <768px | Tap = ripple, no mouse-move ripples, no custom cursor, bubbles 8, simplified shader (no chromatic aberration), name font scales down, cards stack full-width |

Test at 375px, 768px, 1024px, 1440px, 1920px.

---

## 10. Accessibility (required)

- Respect `prefers-reduced-motion`: disable WebGL ripples, parallax, kinetic text, bubbles, and use simple fades
- All interactive elements keyboard-focusable with a visible focus ring (`--accent`, 2px offset)
- Semantic HTML: one `<h1>` (the name), `<nav>`, `<main>`, `<section aria-labelledby>`
- Canvas has `aria-hidden="true"`; decorative layers are `pointer-events: none`
- Text contrast ≥ 4.5:1 (check text over water gradient at both light and dark ends)
- "Explore Work" must work with Enter/Space and scroll to `#projects`
- Alt text for every project image

---

## 11. Performance Targets

- Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95
- LCP < 2.5s, CLS < 0.1
- Hero canvas must hold 60fps on a mid-range laptop; degrade gracefully (lower DPR, fewer ripples) if frame time exceeds 20ms for 30 consecutive frames
- Lazy-load project images (`loading="lazy"`, `decoding="async"`), use WebP/AVIF
- Preload the heading font; use `font-display: swap`
- Total JS bundle (gzipped) under ~250KB excluding images

---

## 12. Suggested File Structure

```
/src
  /components
    Hero.tsx
    WaterCanvas.tsx          // WebGL ripple
    Bubbles.tsx
    OrbButton.tsx
    DiveTransition.tsx
    DepthMeter.tsx
    Projects.tsx
    ProjectCard.tsx
    Navbar.tsx
    CustomCursor.tsx
  /shaders
    water.frag.glsl
    water.vert.glsl
  /hooks
    useReducedMotion.ts
    useMagnetic.ts
    useRipples.ts
  /content
    content.ts               // ALL text + project data
  /styles
    tokens.css
    globals.css
  main.tsx
```

---

## 13. Build Order (follow in this sequence)

1. Set up project, fonts, tokens, global styles, Lenis
2. Build static hero layout (no effects) and make it responsive
3. Implement WebGL water canvas with idle waves
4. Add mouse/click/auto ripples
5. Add caustics, specular, chromatic aberration
6. Add kinetic text, orb button, bubbles, rays, grain, cursor
7. Build Projects section with static cards
8. Implement the dive transition + depth meter + color interpolation
9. Add card reveal animations and hover distortion
10. Navbar, then Contact/About if provided
11. Accessibility + reduced-motion + fallbacks pass
12. Performance pass + Lighthouse
13. Cross-browser test: Chrome, Safari (iOS too), Firefox

---

## 14. Acceptance Checklist (verify before finishing)

- [ ] Ripples appear on mouse move, click, tap, and on load
- [ ] Water never looks static, and idle waves are visible
- [ ] Clicking EXPLORE WORK smoothly dives into Projects
- [ ] Background color changes progressively with scroll depth
- [ ] Depth meter updates live
- [ ] Project cards animate in and show hover distortion
- [ ] Works with `prefers-reduced-motion` (no WebGL motion, still looks good)
- [ ] Works on mobile Safari and Android Chrome
- [ ] No console errors or layout shift
- [ ] All content editable from `content.ts` only
- [ ] README explains how to add a new project and swap colors

---

## 15. INFO NEEDED FROM REHAN (AI: use placeholders until provided)

1. **Real project list:** name, category, year, your role, 1–2 line description, cover image, link (aim for 4–8)
2. **Brand colors:** keep the ocean palette above, or give your own?
3. **Tagline:** keep the sample or write your own?
4. **About section:** short bio + photo? (yes/no)
5. **Contact info:** email, LinkedIn, Behance, Dribbble, Instagram, resume link
6. **Availability status:** "Available for work" or something else?
7. **Stack preference:** React + Vite (default) or plain HTML/CSS/JS?
8. **Sound:** optional soft water-drop sound on click (default: off)

---

## 16. Out of Scope (do NOT do unless asked)

- No backend, CMS, or database
- No auto-playing audio
- No heavy 3D models
- No external image dependencies for the water effect (must be procedural)
- No dark patterns, popups, or cookie banners
