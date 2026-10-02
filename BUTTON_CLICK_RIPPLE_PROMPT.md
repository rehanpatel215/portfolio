# PROMPT: "Explore Work" Button Click → Water Ripple Over the Existing 3D Scene

> **Instruction to the AI reading this:**
> This is a **small, surgical change** to an existing React + Vite portfolio. Read the whole file before touching code. **Do not remove, rewrite, restyle, or reorganize anything that already exists.** The only goal is to add one behavior: *what happens when the user clicks the center button*. Write complete, working code (no pseudo-code, no TODOs).

---

## 1. Context (what already exists, DO NOT TOUCH)

The site already has a hero with:

- A **3D background built with `react-three-fiber`** (inside a `<Canvas>`):
  1. Blue ocean waves swaying at the bottom
  2. A glowing golden sun with a halo floating in the middle
  3. Small sand particles / bubbles drifting upward
- **REHAN PATEL**, the "UI/UX Designer" text, and a **center button** (the "EXPLORE WORK" button)
- A **Projects section** below the hero

**All of this stays exactly as it is.** Same visuals, same animations, same layout, same performance. If the page is idle, it must look pixel-for-pixel the same as before my change.

---

## 2. The One Thing To Build

> **Before the click:** nothing changes. No ripples, no mouse effects, no distortion.
>
> **When the user clicks the center button:** a realistic **water ripple** starts at the button and spreads across the screen, **distorting the 3D scene itself** (the waves, the sun, the halo, and the particles all bend and shimmer as the rings pass through them). While the ripple plays, the page smoothly scrolls to the **Projects section**.

That's all. Nothing else is in scope.

---

## 3. Exact Click Sequence

| Time after click | What happens |
|---|---|
| **0 ms** | Button gives a quick press feedback: scale `1 → 0.9 → 1` (about 350ms, springy) plus a short glow flash. Button becomes `disabled` / `aria-busy="true"` so it can't be double-clicked. |
| **0 ms** | **Ripple #1** spawns at the button's center, strength **1.6** |
| **220 ms** | **Ripple #2** (echo) at the same point, strength **1.1** |
| **440 ms** | **Ripple #3** (echo) at the same point, strength **0.7** |
| **400 ms** | Smooth scroll to `#projects` begins (duration about **1.6s**, ease: expo in-out) |
| **~2.0 s** | Scroll arrives at Projects. Ripples keep fading naturally |
| **~3.6 s** | Ripples fully gone. Button re-enabled. Everything idle again. |

Clicking again after completion replays the whole sequence.

---

## 4. How To Implement (follow this approach)

The ripple must distort **what the 3D canvas renders**, so it is done as a **post-processing pass inside the existing `<Canvas>`**, not as an overlay image.

### 4.1 Install

```bash
npm i postprocessing @react-three/postprocessing
```

> Check version compatibility with the project's existing `@react-three/fiber` and React versions. `@react-three/postprocessing` v2.x pairs with R3F v8 / React 18, and v3.x pairs with R3F v9 / React 19. Use whichever matches.

### 4.2 `src/lib/rippleStore.ts` (shared state, no React needed)

```ts
const t0 = performance.now();
export const now = () => (performance.now() - t0) / 1000;

const MAX = 8;

export const rippleStore = {
  MAX,
  head: 0,
  ripples: Array.from({ length: MAX }, () => ({
    x: 0.5, y: 0.5, start: -1000, strength: 0,
  })),

  /** clientX / clientY in CSS pixels */
  spawn(clientX: number, clientY: number, strength = 1) {
    const r = this.ripples[this.head];
    r.x = clientX / window.innerWidth;
    r.y = 1 - clientY / window.innerHeight;   // flip Y for GL
    r.start = now();
    r.strength = strength;
    this.head = (this.head + 1) % MAX;
  },
};
```

### 4.3 `src/components/RippleEffect.tsx` (the post-processing effect)

```tsx
import { forwardRef, useMemo } from "react";
import { Effect, BlendFunction } from "postprocessing";
import { Uniform, Vector4 } from "three";
import { rippleStore, now } from "../lib/rippleStore";

const fragmentShader = /* glsl */ `
  uniform float uNow;
  uniform float uAspect;
  uniform vec4  uRipples[8];   // x, y, startTime, strength

  const float SPEED = 0.5;     // how fast rings expand
  const float FREQ  = 48.0;    // number of rings
  const float SHARP = 9.0;     // ring thickness
  const float DECAY = 1.2;     // fade over time
  const float AMP   = 0.02;    // distortion strength
  const float LIFE  = 3.2;     // seconds a ripple lives

  // returns: xy = uv offset, z = crest highlight
  vec3 ripples(vec2 uv) {
    vec2 offset = vec2(0.0);
    float crest = 0.0;
    for (int i = 0; i < 8; i++) {
      vec4 r = uRipples[i];
      float age = uNow - r.z;
      if (age < 0.0 || age > LIFE) continue;

      vec2 d = (uv - r.xy) * vec2(uAspect, 1.0);
      float dist = length(d);
      float radius = age * SPEED;
      float ring = exp(-abs(dist - radius) * SHARP);
      float wave = sin((dist - radius) * FREQ);
      float fade = exp(-age * DECAY)
                 * smoothstep(0.0, 0.1, age)
                 * (1.0 - smoothstep(LIFE - 0.6, LIFE, age));
      float k = wave * ring * fade * r.w;

      vec2 dir = d / (dist + 1e-5);
      offset += dir * vec2(1.0 / uAspect, 1.0) * k * AMP;
      crest  += max(k, 0.0);
    }
    return vec3(offset, crest);
  }

  void mainUv(inout vec2 uv) {
    uv += ripples(uv).xy;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float crest = ripples(uv).z;
    outputColor = vec4(inputColor.rgb + crest * 0.10, inputColor.a); // soft light on crests
  }
`;

class RippleEffectImpl extends Effect {
  constructor() {
    super("RippleEffect", fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map<string, Uniform>([
        ["uNow",   new Uniform(0)],
        ["uAspect", new Uniform(1)],
        ["uRipples", new Uniform(
          Array.from({ length: 8 }, () => new Vector4(0.5, 0.5, -1000, 0))
        )],
      ]),
    });
  }

  update(_renderer: unknown, inputBuffer: { width: number; height: number }) {
    this.uniforms.get("uNow")!.value = now();
    this.uniforms.get("uAspect")!.value = inputBuffer.width / inputBuffer.height;

    const arr = this.uniforms.get("uRipples")!.value as Vector4[];
    rippleStore.ripples.forEach((r, i) => arr[i].set(r.x, r.y, r.start, r.strength));
  }
}

export const RippleEffect = forwardRef<RippleEffectImpl>((_, ref) => {
  const effect = useMemo(() => new RippleEffectImpl(), []);
  return <primitive ref={ref} object={effect} dispose={null} />;
});
```

### 4.4 Add it inside the EXISTING `<Canvas>` (add only, do not edit anything else)

Find the existing component that renders the `<Canvas>`. Add the composer as the **last child**. Leave every existing child untouched:

```tsx
import { EffectComposer } from "@react-three/postprocessing";
import { RippleEffect } from "./RippleEffect";

<Canvas /* existing props unchanged */>
  {/* ...ALL EXISTING waves / sun / halo / particles / lights, untouched... */}

  <EffectComposer multisampling={4} disableNormalPass>
    <RippleEffect />
  </EffectComposer>
</Canvas>
```

**Regression guard (important):**
1. Take a screenshot of the hero **before** adding the composer.
2. After adding it, with no click, the hero must look **identical** (same colors, same sun glow, same waves).
3. Adding `EffectComposer` can shift colors or tone mapping. If the scene looks different (washed out, darker, brighter), fix it by matching the old setup. For example, add `<ToneMapping />` from `@react-three/postprocessing` with the same mode the scene used before, or set the composer's color space to match. **The idle look must not change.**
4. The Canvas must be rendering continuously (`frameloop="always"`, the default). If the project uses `frameloop="demand"`, call `invalidate()` while ripples are active.

### 4.5 The button click handler

Find the existing center button component. **Do not change its markup or styling.** Only add an `onClick` and a press-feedback CSS class.

```ts
// src/lib/exploreClick.ts
import { rippleStore } from "./rippleStore";

const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function handleExploreClick(btn: HTMLButtonElement) {
  if (btn.disabled) return;

  const rect = btn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  // 1. lock the button + press feedback
  btn.disabled = true;
  btn.setAttribute("aria-busy", "true");
  btn.classList.add("is-pressed");
  setTimeout(() => btn.classList.remove("is-pressed"), 400);

  // 2. ripples (skipped for reduced motion)
  if (!reduced()) {
    rippleStore.spawn(cx, cy, 1.6);
    setTimeout(() => rippleStore.spawn(cx, cy, 1.1), 220);
    setTimeout(() => rippleStore.spawn(cx, cy, 0.7), 440);
  }

  // 3. scroll to Projects
  setTimeout(() => scrollToProjects(), reduced() ? 0 : 400);

  // 4. unlock
  setTimeout(() => {
    btn.disabled = false;
    btn.removeAttribute("aria-busy");
  }, reduced() ? 600 : 3600);
}

function scrollToProjects() {
  const el = document.getElementById("projects");
  if (!el) return;

  // Use the project's EXISTING smooth-scroll method if there is one
  // (Lenis / GSAP ScrollTo / etc.). Otherwise use the native fallback below.
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}
```

> **Smooth scroll note:** if the project already uses Lenis, call `lenis.scrollTo("#projects", { duration: 1.6, easing: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t) })` instead of `scrollIntoView`. If it uses GSAP ScrollToPlugin, use that. Match what exists. The target section id must be `projects`. If it differs, use the real id instead of renaming it.

Press feedback CSS (add to the existing stylesheet; do not change existing button rules):

```css
.is-pressed {
  animation: orb-press 0.35s cubic-bezier(.2, 1.4, .4, 1);
}
@keyframes orb-press {
  0%   { transform: scale(1);   box-shadow: 0 0 0 0 rgba(124, 245, 225, 0.0); }
  40%  { transform: scale(0.9); box-shadow: 0 0 40px 10px rgba(124, 245, 225, 0.55); }
  100% { transform: scale(1);   box-shadow: 0 0 0 0 rgba(124, 245, 225, 0.0); }
}
```

If the button already has a transform-based hover/magnetic effect, make sure `.is-pressed` doesn't fight it. Use a wrapper element or `scale` instead of `transform`.

---

## 5. Edge Cases

| Case | Required behavior |
|---|---|
| Double click / rapid clicks | Ignored while the button is locked |
| `prefers-reduced-motion` | No ripples, no distortion. Quick smooth scroll only |
| Window resized mid-ripple | Ripple keeps working (it uses 0–1 screen coordinates) |
| Mobile / touch | Same sequence on tap. Keep `dpr` as it already is. Don't increase resolution |
| Tab hidden during ripple | Fine. Time-based, so it just finishes |
| User scrolls manually during the sequence | Don't fight them. Let the browser win; ripples simply play out |
| Canvas isn't fixed and scrolls away with the hero | Fine. The ripple just plays on the canvas wherever it is. **Do not change the layout.** |
| WebGL context lost / postprocessing fails | Page must still work: the click still scrolls to Projects, and the console shows no uncaught errors |

---

## 6. Fallback (only if the post-processing approach cannot work)

If `EffectComposer` cannot be used without visibly changing the idle look, then as a **last resort** use a pure-CSS fallback: 3 expanding circular rings from the button center (`border: 2px solid rgba(255,255,255,.5)`, `border-radius: 50%`, `scale 0 → 40`, `opacity .8 → 0`, 1.6s, staggered by 220ms, `pointer-events: none`, `mix-blend-mode: screen`). This is not real distortion, so tell me in your final message that you had to use it and why.

---

## 7. Tunable Values (put in one `rippleConfig.ts`)

| Name | Default | Effect |
|---|---|---|
| `SPEED` | 0.5 | How fast rings spread |
| `FREQ` | 48 | Number of rings |
| `AMP` | 0.02 | How strongly the scene bends |
| `DECAY` | 1.2 | How quickly it fades |
| `ECHO_DELAYS` | 220 / 440 ms | Timing of ripples #2 and #3 |
| `SCROLL_DELAY` | 400 ms | When the scroll starts |
| `SCROLL_DURATION` | 1.6 s | Scroll time to Projects |
| `FOLLOW_MOUSE_AFTER_CLICK` | `false` | If `true`, after the first click, moving the mouse spawns small ripples (strength 0.3, throttled to 1 per 45ms) |

Wire the shader constants to uniforms if needed so these can actually be tuned.

---

## 8. Acceptance Checklist

- [ ] Idle hero looks **identical** to before (waves, golden sun, halo, particles, text, button)
- [ ] No ripples or effects appear before the button is clicked
- [ ] Clicking the center button spawns a ripple **from the button's position**
- [ ] The waves, sun, halo, and particles visibly **bend** as the rings pass through them
- [ ] There are 3 rings total (main plus two echoes) that fade out smoothly
- [ ] The page smoothly scrolls to `#projects` about 400ms after the click
- [ ] The button shows the press and glow feedback, and can't be double-clicked
- [ ] After about 3.6s everything returns to idle, and the button works again
- [ ] `prefers-reduced-motion` gets scroll only, with no distortion
- [ ] No console errors, no new layout shift, no frame-rate drop while idle
- [ ] No existing file was deleted, and existing 3D components were not edited (only the composer added as the last Canvas child)

---

## 9. DO NOT

- Do **not** remove or replace the 3D ocean / sun / halo / particle background
- Do **not** add a new full-screen WebGL canvas or any new background
- Do **not** add mouse-move ripples before the click
- Do **not** change fonts, colors, text, spacing, or the Projects section
- Do **not** add the "dive" color transition, depth meter, bubbles, custom cursor, or any other effect from the earlier spec files. They are **out of scope** for this task
- Do **not** leave `console.log`s or unused code

---

## 10. Final Message From the AI

When done, reply with: (1) the list of files created and files edited, (2) confirmation that the idle look is unchanged, and (3) any deviation from this prompt and why.
