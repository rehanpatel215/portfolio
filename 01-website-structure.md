# Portfolio Website — Structure & Component Spec

> Reference sites analyzed:
> - Live template: https://awwwards-portfolio-template.vercel.app/
> - Source repo: https://github.com/elijah-farrell/Awwwards-Portfolio (based on Ali-Sanati's awwwards-portfolio)
> - Live template repo: https://github.com/HamishMW/portfolio.git
> - Live site: https://hamishw.com/
>
> This file defines **what** the site is made of — layout, sections, navbar, components, and file structure — independent of visual theme. The theme (colors, motion style, "beachy" mood) is covered in `02-beachy-theme.md`.

---

## 1. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | React (Vite) | App shell, fast dev/build |
| Styling | Tailwind CSS | Utility-first styling |
| Scroll/UI animation | GSAP + ScrollTrigger | Section reveals, pinning, timelines |
| Micro/marquee animation | Framer Motion | Velocity-based marquees, hover/tap transitions |
| 3D | Three.js via React Three Fiber + Drei | Hero 3D scene, ambient 3D objects |
| Routing (optional) | React Router or Remix-style routes | Home / Project detail / Contact / Articles |
| Fonts | Self-hosted variable fonts | Performance, consistent typography |
| Deployment | Vercel / Cloudflare Pages | Static hosting + edge functions for contact form |

---

## 2. Global Page Shell

Every page shares this shell, in DOM order:

1. **Skip link** — "Skip to main content" (accessibility, hidden until focused)
2. **Preloader / Loading screen** — shown on first load only, hides once critical assets (3D model, fonts) are ready
3. **Custom cursor** (desktop only) — replaces default cursor, reacts to hoverable elements
4. **Navbar** — fixed/sticky, present on every route
5. **`<main>`** — page content, each page built from stacked `<section>` blocks
6. **Footer** — present on every route
7. **Scroll progress indicator** (optional) — thin bar or dot tracker along one edge

---

## 3. Navbar

**Layout:** fixed to top, full width, transparent over hero → solid/blurred background after scrolling past hero (scroll-state driven class toggle).

**Structure (left → right):**
- **Logo / Monogram** — links to `/` (home / `#intro`)
- **Primary nav links** (center or right-aligned):
  - Home
  - Projects / Work
  - About / Details
  - Articles (optional, if a blog exists)
  - Contact
- **Social icon cluster** (far right, desktop only): GitHub, LinkedIn, X/Bluesky, Dribbble/Figma — icon-only, opens in new tab
- **Mobile hamburger toggle** — replaces nav links + socials below a breakpoint (e.g. `md`)

**Behavior:**
- On page load: links animate in with a **staggered slide/fade** (each link offset ~50–80ms from the last)
- On scroll: navbar background transitions from transparent to solid/blurred; can also shrink in height slightly
- On mobile: hamburger opens a full-screen overlay menu; links stagger in vertically; body scroll is locked while open
- Active section highlighting (optional): current section's nav link gets an underline/dot indicator via `ScrollTrigger` or `IntersectionObserver`
- Keyboard accessible: all links reachable via Tab, overlay traps focus while open, `Esc` closes mobile menu

**Component:** `Navbar.jsx`
Sub-components: `NavLink.jsx`, `MobileMenu.jsx`, `SocialIcons.jsx`

---

## 4. Section-by-Section Breakdown

### 4.1 Hero Section
- Full viewport height (`100svh`)
- **3D canvas** (React Three Fiber) centered or offset — primary focal object (currently a "planet + golden ring" in the reference template)
- Large **headline** (name / role, e.g. "Designer + Developer")
- Supporting **subheadline** — rotating/typewriter list of roles (Designer / Developer / Prototyper / Animator) mirroring hamishw.com's rotating title treatment
- **Scroll-down affordance** — animated arrow, mouse icon, or text link ("Scroll to projects") that smooth-scrolls to the next section
- Ambient background motion (subtle parallax or particle drift) independent of the 3D hero object

Component: `Hero.jsx` → renders `HeroScene.jsx` (3D canvas), `HeroText.jsx`

### 4.2 Service Summary / Intro Strip
- Short horizontal band introducing capabilities or a personal tagline
- Text moves horizontally on scroll (GSAP scroll-linked horizontal translate — not a constant-speed marquee, tied to scroll velocity/position)
- Often paired with numbered labels (01, 02, 03) as in hamishw.com's project numbering

Component: `ServiceSummary.jsx`

### 4.3 Works / Projects Section
- Grid or stacked-list of project cards (hamishw.com uses a stacked full-width list with numbered entries: 01, 02, 03)
- Each **project card** contains:
  - Index number
  - Project title
  - One-line description
  - Tags/stack pills (optional)
  - Thumbnail/preview image or video, revealed on hover (image reveals via clip-path or scale-in)
  - "View project" / "View website" link
- Hover state: image overlay fades/scales in, cursor may morph into a "View" label (custom cursor state)
- Click → navigates to project detail route or external link

Component: `Works.jsx` → `ProjectCard.jsx` (repeated), `ProjectPreview.jsx`

### 4.4 About Section
- Two-column layout on desktop: portrait image (left) + bio copy (right), stacks on mobile
- **Image reveal animation** — image masked with a `clip-path` that animates open on scroll into view
- **Text reveal** — words/lines fade or type in as user scrolls (typewriter or staggered line reveal)
- Short bio paragraph (current role, focus areas, personal interests) — mirrors hamishw.com's "Hi there" block
- Optional links: résumé/CV download, "uses" page, secondary personal project mention
- CTA button: "Send me a message" → links to Contact section/page

Component: `About.jsx`

### 4.5 Marquee / Scroll-Velocity Bands
- One or more full-width bands of repeating text (skills, tools, or a tagline) that scroll horizontally
- Speed reacts to scroll velocity using Framer Motion (`useVelocity` / `useTransform`) — scrolling faster speeds up the marquee, momentarily reversing direction on scroll-up
- Used as a rhythm/breathing section between Works and About, or About and Contact

Component: `Marquee.jsx`

### 4.6 Contact Section
- Large call-to-action heading ("Let's talk", "Get in touch")
- Direct email link (mailto, large clickable text)
- Contact form (optional): name, email, message fields — submits via serverless function (AWS SES / Lambda or Cloudflare function) or a `mailto:`/service like Formspree
- Social links repeated (GitHub, LinkedIn, etc.)
- Availability note (optional): "Currently open to new projects" indicator

Component: `Contact.jsx` → `ContactForm.jsx`

### 4.7 Footer
- Copyright line with current year (dynamic via `new Date().getFullYear()`)
- Credit line ("Crafted by [Name]")
- Secondary nav links (repeat of primary nav or legal links)
- Back-to-top control

Component: `Footer.jsx`

---

## 5. Supporting/Global Components

| Component | Purpose |
|---|---|
| `Loader.jsx` | Preloader screen shown until assets are ready |
| `CustomCursor.jsx` | Custom mouse follower with hover-state morphing |
| `ScrollProgress.jsx` | Progress bar/indicator tied to page scroll |
| `SectionHeading.jsx` | Reusable animated heading (used across sections for consistent reveal-in-view behavior) |
| `Button.jsx` | Reusable CTA button with hover/tap micro-interaction |
| `Divider.jsx` | Reusable section-break visual (SVG shape, line, etc.) |
| `SEO.jsx` / `<Meta>` | Per-page meta tags, OG image, title |

---

## 6. Suggested File/Folder Structure

```
src/
├── assets/            # images, textures, 3D models, icons
├── components/        # shared/reusable UI (Navbar, Footer, Button, Loader, Cursor...)
├── sections/           # page sections (Hero, Works, About, Marquee, Contact)
│   ├── Hero/
│   ├── Works/
│   ├── About/
│   ├── Marquee/
│   └── Contact/
├── constants/          # site content: nav links, project data, social links, copy text
├── hooks/              # custom hooks (useScrollVelocity, useMediaQuery, useIsMobile)
├── lib/ or utils/       # animation helpers, GSAP registration, easing presets
├── styles/              # tailwind config extensions, global.css
├── App.jsx
├── main.jsx
└── index.css
public/
├── models/              # .glb/.gltf 3D assets
├── images/
└── favicon, social-preview image
```

---

## 7. Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| Desktop (≥1024px) | Full 3D hero, custom cursor active, multi-column About, horizontal marquees at full speed |
| Tablet (768–1023px) | 3D scene simplified/scaled down, cursor reverts to default, columns may stack |
| Mobile (<768px) | 3D scene reduced or replaced with static image/lighter geometry for performance; hamburger nav; marquees still run (transform-based, cheap); touch-friendly tap targets (≥44px) |

Performance notes:
- Lazy-load the Three.js canvas (render only once in viewport / after loader completes)
- Reduce particle counts and shadow quality on mobile/low-end GPUs
- Respect `prefers-reduced-motion`: disable/simplify parallax, marquee, and 3D auto-rotation for users who request it

---

## 8. Content Inventory to Prepare

Before building, gather:
- [ ] Name, role/title, and 2–3 rotating role variants
- [ ] Short bio (~80–120 words)
- [ ] 3–6 project entries: title, description, tags, cover image, live/repo link
- [ ] Skills/tools list (for marquee)
- [ ] Social links (GitHub, LinkedIn, etc.)
- [ ] Contact email / form endpoint
- [ ] Portrait photo, resume/CV file (optional)
- [ ] Favicon + social preview (OG) image
