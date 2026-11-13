# CLAUDE.md — One-Taxi One-Page Website

> Drop this file in the project root. Claude Code reads it automatically.
> In claude.ai, paste it at the start of the conversation or add it to a Project's instructions.

---

## 1. Project Summary

A single-page, mobile-first website for **one taxi (one car, one driver)** in **Jönköping, Sweden**.

**Primary goals (in priority order):**
1. Make it effortless to **contact the driver** (call, WhatsApp, SMS, email) in one tap.
2. Show the car in a **scroll-driven story**: as the visitor scrolls, the drawn car drives in and stops for them (see §6).
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
Write a plan first if a task involves **any** of: more than one file, a new dependency, the car scene, layout changes, performance work, or anything ambiguous. Trivial edits (typo, color tweak, copy change) need no plan.

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
- Never hijack scrolling (no `preventDefault` on wheel/touch, no forced scroll snapping in the car scene).
- Never commit secrets or personal data beyond what the owner explicitly provides.

---

## 3. Tech Stack (decided, do not change without asking)

| Concern | Choice |
|---|---|
| Framework | **Astro** (static output, zero JS by default) + TypeScript |
| Styling | **Tailwind CSS** + a small set of CSS variables for design tokens |
| Icons | **Lucide** (`astro-icon` or inline SVG) |
| Fonts | **Inter** or **Geist**, self-hosted via Fontsource, `font-display: swap` |
| Car scene | Inline **SVG drawing** moved by CSS variables from a small vanilla-TS scroll script (see §6). No library needed. |
| Animation | CSS + **IntersectionObserver**. GSAP/ScrollTrigger only if native sticky + scroll events prove insufficient. |
| Smooth scroll | None by default. Lenis only if asked, and it must keep native scrolling behavior. |
| SEO | `@astrojs/sitemap`, JSON-LD (`TaxiService`/`LocalBusiness`), Open Graph tags |
| Images | Astro `<Image>` / Sharp for page images. |
| Hosting | Cloudflare Pages, Netlify, or Vercel (free tier) |
| Quality | ESLint + Prettier, Lighthouse, axe (accessibility) |

Package manager: `npm`. The owner develops on **Windows**; give commands that work in PowerShell.

---

## 4. Page Structure (single page, anchored sections)

1. **Header**: minimal name + "Call" button. Sticky, subtle blur on scroll.
2. **Hero**: short headline, one-line subtitle, primary CTA (**Call now**), secondary CTA (**WhatsApp**).
3. **Car scene**: tall scroll section; the car drives in as the visitor scrolls through it (see §6). Optional short captions that fade in at set points, using text from `site.ts` only.
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

## 6. Car Scene Specification (scroll-only)

Decided 2026-11-13: the 360° frame rotation was replaced by a **drawn 2D side view** of the car, told as a scroll story. It matches the illustrated night scenes and stays sharp at any size.

**Source:** `src/components/CarDrawing.astro`, one inline SVG traced from a side photo of the real car (white Škoda Octavia Combi, roof rails, tow bar). The car faces left. Branding is the Länstaxi logo only; no plate, no invented details. Change the drawing only against a real photo of the car.

**Behavior** (`CarViewer.astro` + `src/scripts/carViewer.ts`)
- The hero is a tall section with a `position: sticky` inner container of full viewport height (`100svh` on mobile), split into five scenes (`storyEdges` in `Page.astro`).
- The script only measures scroll progress and writes `data-scene` plus the progress through each scene as CSS variables `--t0 … --t4`. All movement is CSS: the car drives in (scene 2), the wheels turn and lane markings slide by (scene 3), the brake lights come on (scene 4).
- **No drag, no autoplay of the car, no scroll hijacking.** Scrolling is the only control. Passive scroll listener, updates inside `requestAnimationFrame`.

**Fallbacks and accessibility**
- `prefers-reduced-motion: reduce` and no JS: the section is one screen, showing the last scene with the car standing still.
- The SVG has `role="img"` and an `aria-label` from `site.ts` (`car.alt`).

---

## 7. Performance, Accessibility, SEO Budgets (definition of "done")

**Performance**
- Lighthouse mobile: **Performance ≥ 90**, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- LCP < 2.5s, CLS < 0.1, INP < 200ms.
- Initial JS < 100 KB.
- Always set `width`/`height` on images to avoid layout shift.
- Car scene scrubbing must stay smooth on a mid-range phone; test with CPU throttling.

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
│  ├─ favicon.svg
│  ├─ og-image.jpg
│  └─ robots.txt
└─ src/
   ├─ assets/driver/       # driver photo
   ├─ components/          # Header, Hero, CarViewer, CarDetails, Driver, Contact, StickyCallBar, Footer
   ├─ data/site.ts         # ALL editable content
   ├─ layouts/Base.astro
   ├─ pages/index.astro
   ├─ scripts/carViewer.ts
   └─ styles/{global.css,tokens.css}
```

Keep **all editable content in `src/data/site.ts`** so the owner can update phone, text, or hours without touching components.

---

## 9. Build Phases (follow in order; verify before moving on)

1. **Discovery**: confirm content (§11) and check the car reference photos. List anything missing.
2. **Setup**: scaffold Astro + Tailwind + TS, fonts, tokens, lint/format.
3. **Static layout**: all sections with placeholder content, fully responsive (360px to 1440px).
4. **Contact features**: `tel:`/WhatsApp/SMS/email links, sticky mobile bar, QR code, JSON-LD.
5. **Car scene**: build per §6. Verify: smooth scrubbing, correct start/end state of each scene, mobile Safari and Chrome, reduced-motion, no-JS.
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
- [x] Side photo of the car (the drawing in `CarDrawing.astro` is traced from it)
- [ ] Domain name (if any)
