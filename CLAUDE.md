# CLAUDE.md — One-Taxi One-Page Website

> Drop this file in the project root. Claude Code reads it automatically.
> In claude.ai, paste it at the start of the conversation or add it to a Project's instructions.

---

## 1. Project Summary

A single-page, mobile-first website for **one taxi (one car, one driver)** in **Jönköping, Sweden**.

**Primary goals (in priority order):**
1. Make it effortless to **contact the driver** (call, WhatsApp, SMS, email) in one tap.
2. Show the car in a **scroll-driven 360° rotation**: as the visitor scrolls, the car turns.
3. Look **modern, professional, and minimal**, and load fast on mobile networks.

**Non-goals:** no booking engine, no user accounts, no CMS, no backend, no blog, no multi-page routing.

**Audience:** travelers and locals on a phone, often outdoors, often in a hurry. Design for thumbs and slow connections first.

### Known facts (use these; do not invent others)
- Car: white **Škoda Octavia Combi (estate) 4x4** with tow bar and roof rack.
- Livery: **SWE Taxi Jönköping**, navy blue and yellow "T" logo.
- Phone number printed on the car: **036-39 39 39**. Treat as a placeholder until the owner confirms whether the site shows this number or the driver's own.
- License plate is intentionally hidden in all assets. Never show or mention it.

---

## 2. Working Method (READ THIS FIRST)

Claude must **think step by step and plan before acting** on anything non-trivial.

### 2.1 When a plan is required
Write a plan first if a task involves **any** of: more than one file, a new dependency, the car viewer, layout changes, performance work, or anything ambiguous. Trivial edits (typo, color tweak, copy change) need no plan.

### 2.2 Plan-before-act protocol
Before writing code for a non-trivial task, output this block and wait for approval when the plan is large or has open questions:

```
## Plan
Goal:            <one sentence>
Assumptions:     <what I am assuming; flag anything uncertain>
Steps:           1. … 2. … 3. …   (small, verifiable steps)
Files touched:   <list>
Risks/unknowns:  <what could go wrong>
Verification:    <how I will prove it works>
Questions:       <only if blocking; max 3>
```

### 2.3 Execution rules
- Work in **small increments**. Finish and verify one step before starting the next.
- After each step, run the relevant check (`npm run build`, `npm run lint`, or view in the dev server) and report the result honestly.
- **Read existing files before editing them.** Never overwrite work blindly.
- If something is unclear, missing, or contradictory, **ask instead of inventing it**. Use obvious placeholders like `[[DRIVER_PHONE]]` and list them in the final summary.
- If an approach fails twice, stop, explain what was tried, and propose alternatives instead of looping.
- Prefer the **simplest thing that works**. Do not add libraries, abstractions, or features that were not requested.
- At the end of each task, give a short summary: what changed, what was verified, what is left.

### 2.4 Never do
- Never fabricate contact details, prices, reviews, licence numbers, or car specs.
- Never use AI-generated imagery that misrepresents the real car (wrong color, wrong model, invented branding, visible plate).
- Never add trackers, cookie banners, or third-party scripts without asking.
- Never hijack scrolling (no `preventDefault` on wheel/touch, no forced scroll snapping in the viewer).
- Never commit secrets or personal data beyond what the owner explicitly provides.

---

## 3. Tech Stack (decided, do not change without asking)

| Concern | Choice |
|---|---|
| Framework | **Astro** (static output, zero JS by default) + TypeScript |
| Styling | **Tailwind CSS** + a small set of CSS variables for design tokens |
| Icons | **Lucide** (`astro-icon` or inline SVG) |
| Fonts | **Inter** or **Geist**, self-hosted via Fontsource, `font-display: swap` |
| Car viewer | Custom vanilla-TS **scroll-driven canvas image sequence** (see §6). No library needed. |
| Animation | CSS + **IntersectionObserver**. GSAP/ScrollTrigger only if native sticky + scroll events prove insufficient. |
| Smooth scroll | None by default. Lenis only if asked, and it must keep native scrolling behavior. |
| SEO | `@astrojs/sitemap`, JSON-LD (`TaxiService`/`LocalBusiness`), Open Graph tags |
| Images | Astro `<Image>` / Sharp for page images. Viewer frames are pre-optimized WebP served from `public/`. |
| Hosting | Cloudflare Pages, Netlify, or Vercel (free tier) |
| Quality | ESLint + Prettier, Lighthouse, axe (accessibility) |

Package manager: `npm`. The owner develops on **Windows**; give commands that work in PowerShell.

---

## 4. Page Structure (single page, anchored sections)

1. **Header**: minimal name + "Call" button. Sticky, subtle blur on scroll.
2. **Hero**: short headline, one-line subtitle, primary CTA (**Call now**), secondary CTA (**WhatsApp**).
3. **Car viewer**: tall scroll section; the car rotates as the visitor scrolls through it (see §6). Optional short captions that fade in at set points, using text from `site.ts` only.
4. **Car details**: model, key features (icons), 4 to 6 items max, only confirmed facts.
5. **Driver**: photo, name, languages, one-paragraph bio (only if provided).
6. **Contact**: phone, WhatsApp, SMS, email, service area, hours, QR code. Large buttons using `tel:`, `https://wa.me/…`, `sms:`, `mailto:`. Phone number also shown as plain text.
7. **Footer**: name, copyright, small print. No clutter.

**Mobile-only:** a fixed bottom bar with **Call** and **WhatsApp** buttons, visible after the hero.

All copy is placeholder until the owner supplies real text. Keep copy short, warm, and factual.

---

## 5. Design Principles (modern, professional, minimal)

- **Whitespace over decoration.** Generous spacing, one column on mobile, max content width about 1100px.
- **Palette from the livery:** navy blue (primary), taxi yellow (accent, used sparingly for CTAs/highlights), near-black text, light neutral surfaces. Provide a dark theme via `prefers-color-scheme`.
- **The car is white.** Never place it on pure white. Viewer background: a soft light-gray radial gradient (about `#E9ECEF` → `#F8F9FA`) with a subtle elliptical ground shadow under the car. In dark mode use deep navy, and check frame edges for light halos.
- **Typography:** one font family, 2 to 3 weights, large confident headings, body ≥ 16px, line-height about 1.6.
- **Spacing scale:** multiples of 4/8px. **Radius:** one consistent radius (about 12 to 16px).
- **Motion:** subtle fade/translate on scroll (≤ 400ms). No parallax overload, no auto-playing sound, no carousels.
- **Buttons:** minimum 48px tall, high contrast, clear labels ("Call now", not "Submit").
- Define tokens once in `src/styles/tokens.css` and reuse them; no magic numbers scattered in components.

---

## 6. Car Viewer Specification (scroll-only)

**Source:** an AI-generated rotation video of the real car, split into frames with the background removed.

**Frames**
- Location: `public/car360/frame_001.webp … frame_NNN.webp` (transparent WebP, sequential, no gaps).
- Expected count: about **60 to 90** frames. Store the count in `src/data/site.ts` as `carFrames.count`; never hard-code it in the component.
- Budget: total folder **≤ 4 MB**. If larger, report it and propose dropping every other frame or lowering WebP quality. Do not do it silently.

**Behavior**
- The viewer section is tall (about **300vh** desktop, **250vh** mobile) and contains a `position: sticky` inner container of full viewport height (`100svh` on mobile).
- Scroll progress through the section (0 → 1) maps **linearly** to frame index: `index = Math.round(progress * (count - 1))`.
- **No drag, no auto-rotation, no keyboard rotation logic.** Scrolling (wheel, touch, arrow keys, space) is the only control, so it works with native browser scrolling.
- Optional: a small "Scroll to rotate" hint that fades out after the first frame change.

**Rendering**
- Draw frames to a `<canvas>`, scaled for `devicePixelRatio`, fitted with "contain" and centered.
- Update inside `requestAnimationFrame`; redraw only when the index changes. Use a passive scroll listener.
- Re-measure on resize/orientation change.

**Loading**
- Frame 1 renders immediately as a normal `<img>` (poster, LCP candidate, no-JS fallback) with explicit width/height.
- Start preloading the rest when the section is within about one viewport (IntersectionObserver). Load every 4th frame first, then fill the gaps. Until a frame is ready, draw the nearest loaded frame.
- Use `img.decode()` before first draw of each frame to avoid jank.

**Fallbacks and accessibility**
- `prefers-reduced-motion: reduce`: no scrubbing; collapse the section to normal height and show a single static frame.
- If JS fails: the poster `<img>` stays visible.
- Canvas gets `role="img"` and an `aria-label` such as "White Škoda Octavia taxi, rotating as you scroll".

**Component API:** `<CarViewer frames={...} count={...} alt="..." />`, so the source can later be swapped (new frames, or `<model-viewer>` with a `.glb`) without touching the page.

---

## 7. Performance, Accessibility, SEO Budgets (definition of "done")

**Performance**
- Lighthouse mobile: **Performance ≥ 90**, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- LCP < 2.5s, CLS < 0.1, INP < 200ms.
- Initial JS < 100 KB (viewer frames are lazy-loaded and do not count).
- Always set `width`/`height` on images to avoid layout shift.
- Viewer scrubbing must stay smooth on a mid-range phone; test with CPU throttling.

**Accessibility**
- WCAG 2.2 AA contrast, visible focus states, semantic landmarks (`header`, `main`, `section`, `footer`).
- Every image has meaningful `alt` text; decorative images use `alt=""`.
- Respect `prefers-reduced-motion`.

**SEO / Local**
- Unique `<title>` and meta description, Open Graph image, canonical URL.
- JSON-LD `TaxiService` with name, phone, area served, opening hours (real data only).
- Correct `lang` on `<html>`; add `hreflang` only if multiple languages are actually built.

---

## 8. Suggested Project Structure

```
/
├─ CLAUDE.md
├─ astro.config.mjs
├─ public/
│  ├─ car360/              # frame_001.webp … frame_NNN.webp
│  ├─ favicon.svg
│  ├─ og-image.jpg
│  └─ robots.txt
└─ src/
   ├─ assets/driver/       # driver photo
   ├─ components/          # Header, Hero, CarViewer, CarDetails, Driver, Contact, StickyCallBar, Footer
   ├─ data/site.ts         # ALL editable content + carFrames.count
   ├─ layouts/Base.astro
   ├─ pages/index.astro
   ├─ scripts/carViewer.ts
   └─ styles/{global.css,tokens.css}
```

Keep **all editable content in `src/data/site.ts`** so the owner can update phone, text, or hours without touching components.

---

## 9. Build Phases (follow in order; verify before moving on)

1. **Discovery**: confirm content (§11) and check the frames in `public/car360/` (count, sizes, total weight, naming). List anything missing.
2. **Setup**: scaffold Astro + Tailwind + TS, fonts, tokens, lint/format.
3. **Static layout**: all sections with placeholder content, fully responsive (360px to 1440px).
4. **Contact features**: `tel:`/WhatsApp/SMS/email links, sticky mobile bar, QR code, JSON-LD.
5. **Car viewer**: build per §6. Verify: smooth scrubbing, correct first/last frame at section start/end, mobile Safari and Chrome, reduced-motion, no-JS.
6. **Polish**: captions, dark theme, micro-interactions, favicon/OG image.
7. **Optimize and audit**: images, fonts, Lighthouse, axe, real-device test.
8. **Deploy and handoff**: connect domain, verify HTTPS, write a short "how to edit content" note in `README.md`.

At the end of each phase, summarize what was done and confirm the acceptance checks passed.

---

## 10. Commands

```bash
npm install
npm run dev        # local dev server
npm run build      # production build (must pass with 0 errors)
npm run preview    # preview the production build
npm run lint       # ESLint + Prettier check
```

---

## 11. Content Checklist (owner must supply)

- [ ] Business/driver display name
- [ ] Which phone number to show (company number on the car, or the driver's own) and the WhatsApp number
- [ ] Email (optional)
- [ ] Service area and operating hours
- [ ] Languages spoken, and site language(s): Swedish, English, or both
- [ ] Confirmed car features to list (seats, luggage, 4x4, child seat, etc.)
- [ ] Driver photo (with permission) and short bio
- [ ] Permission to use the SWE Taxi name/logo on the site
- [x] Car rotation frames (in `public/car360/`)
- [ ] Domain name (if any)
