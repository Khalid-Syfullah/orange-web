# Orange

**We build what comes next.**
*Digital experiences. Engineered differently.*

Orange is the website for an independent creative-technology studio. It is a single-page, chapter-based
editorial experience: oversized typography, asymmetric layouts, restrained colour, and motion that supports
the content rather than decorating it. It is built as a custom-engineered site, not a template.

Design reference: the editorial language of [pear.no](https://pear.no) — typography-led, scroll-driven,
minimal — expressed in Orange's own identity.

---

## Contents

- [Highlights](#highlights)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [The page, section by section](#the-page-section-by-section)
- [Design system](#design-system)
- [Motion system](#motion-system)
- [Contact form and API](#contact-form-and-api)
- [Performance](#performance)
- [Accessibility](#accessibility)
- [Browser and device support](#browser-and-device-support)
- [Customising content](#customising-content)
- [Deployment](#deployment)
- [Known limitations](#known-limitations)

---

## Highlights

- **Editorial typography** — display headings from 32px to 280px, tight tracking, masked line reveals.
- **Chapter navigation** — four named chapters with an active-section indicator that glides between them,
  hide-on-scroll-down / reveal-on-scroll-up behaviour, and a full-screen mobile menu.
- **A signature 3D sphere** — a React Three Fiber orange sphere with physical material, studio lighting,
  spring-driven motion and a scroll-linked journey, with a CSS fallback for low-power devices.
- **Interactive services list** — hover (desktop) or tap/Enter (touch and keyboard) expands each service.
- **Scroll-driven process** — four large steps with alternating alignment, a sticky progress rail and
  active-step highlighting.
- **A real contact pipeline** — validated, sanitised, rate-limited, spam-trapped server endpoint that
  delivers email without exposing credentials to the browser.
- **Loading sequence, custom cursor and magnetic buttons** — each one earns its place and each respects
  reduced-motion preferences.

---

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language | TypeScript (strict) |
| UI | React 19 |
| Styling | Tailwind CSS 4 (CSS-first `@theme` tokens) |
| Scroll animation | [GSAP](https://gsap.com) 3 + ScrollTrigger |
| UI animation | [Motion](https://motion.dev) (`motion/react`) |
| Smooth scrolling | [Lenis](https://lenis.darkroom.engineering) |
| 3D | Three.js, React Three Fiber 9, `@react-three/drei` |
| Icons | Lucide |
| Fonts | Space Grotesk (display) and Inter (body) via `next/font` |
| Email delivery | [Resend](https://resend.com) HTTP API (no SDK dependency) |
| Linting | ESLint 9 with `eslint-config-next` |

---

## Getting started

**Requirements:** Node.js 20 or newer (developed on Node 22) and npm.

```bash
# install
npm install

# run the dev server on http://localhost:3000
npm run dev
```

In development the contact form works without any configuration: submissions are logged to the server
console instead of being emailed. See [Environment variables](#environment-variables) for production.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimised production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |

---

## Environment variables

All variables are **server-only**. Never prefix them with `NEXT_PUBLIC_`. Copy `.env.example` to
`.env.local` and fill it in:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | API key for the Resend email API |
| `CONTACT_TO_EMAIL` | Address that receives enquiries |
| `CONTACT_FROM_EMAIL` | Verified sender, e.g. `Orange <enquiries@your-domain.com>` |

If any are missing: in development the submission is logged to the console; in production the endpoint
returns `503` and the form shows a friendly error.

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx            Fonts, metadata, head script, loader, cursor, smooth scroll
│   ├── page.tsx              Page composition (below-the-fold sections are lazy)
│   ├── globals.css           Tailwind theme tokens, utilities, motion start-states
│   ├── icon.svg              Favicon
│   └── api/contact/route.ts  Contact endpoint (validation, spam checks, rate limit, email)
│
├── components/
│   ├── Header.tsx            Logo, chapter nav, progress bar, mobile menu (focus-trapped)
│   ├── Hero.tsx              Full-viewport hero with mouse-responsive disc
│   ├── AboutSection.tsx      Chapter 01 — The Idea
│   ├── ServicesSection.tsx   Chapter 02 — What We Do
│   ├── SphereSection.tsx     Pinned "Built to stand out." stage
│   ├── SphereCanvas.tsx      React Three Fiber scene (loaded on demand)
│   ├── StaticSphere.tsx      CSS sphere fallback
│   ├── PhilosophySection.tsx Chapter 03 — How We Think (belief + four-step process)
│   ├── ContactSection.tsx    Chapter 04 — Let's Talk (form)
│   ├── Footer.tsx            Tagline, navigation, social links, wordmark
│   ├── Loader.tsx            First-visit loading curtain
│   ├── Cursor.tsx            Desktop cursor accent
│   ├── SmoothScroll.tsx      Lenis ↔ GSAP ticker bridge
│   ├── AnchorLink.tsx        In-page link that scrolls through Lenis
│   └── animations/
│       ├── TextReveal.tsx    Masked word-by-word reveal
│       ├── ScrollReveal.tsx  Fade + rise on enter
│       ├── ScrubText.tsx     Words light up as a paragraph scrolls past
│       ├── ParallaxSection.tsx  Scrubbed parallax
│       └── MagneticButton.tsx   Magnetic CTA (solid / inverse / orange / outline)
│
├── hooks/
│   ├── useActiveChapter.ts   Which chapter is under the viewport middle
│   ├── useScrollProgress.ts  Smoothed 0–1 page progress
│   └── useMediaQuery.ts      SSR-safe media query hook
│
└── lib/
    ├── constants.ts          Copy and data: nav, services, process, socials, offices
    ├── animations.ts         Easing, GSAP registration
    ├── scroll.ts             Lenis instance, anchor navigation, scroll locking
    ├── spring.ts             Small damped-spring helper for the sphere
    ├── capability.ts         WebGL / low-power detection
    └── contact.ts            Shared form validation and sanitisation
```

---

## The page, section by section

| # | Section | Id | What it does |
| --- | --- | --- | --- |
| — | **Loader** | — | Counter + progress line while fonts and assets settle, then a curtain lift hands off to the hero |
| — | **Hero** | `top` | "Ideas, engineered." at up to 280px; orange disc with measurement rings follows the mouse; scroll cue |
| 01 | **The Idea** | `studio` | Manifesto: "Good ideas deserve great execution." with a scrubbed description and a closing statement |
| 02 | **What We Do** | `capabilities` | "Everything digital. Nothing ordinary." with five expandable services |
| — | **Built to stand out.** | `built` | Pinned stage; the 3D sphere enters from the right, swells, then sinks as the page turns dark |
| 03 | **How We Think** | `philosophy` | "Less noise. More impact." plus Discover → Design → Engineer → Evolve with a sticky progress rail |
| 04 | **Let's Talk** | `contact` | "Have something in mind?" and the enquiry form |
| — | **Footer** | — | Tagline, navigation, social links, copyright and an oversized wordmark |

The two sphere tone markers (`built`, `built-dark`) are registered in `CHAPTERS` so the header can switch to
light text when the stage turns dark, but they are not shown in the navigation.

---

## Design system

### Colour

| Token | Value | Use |
| --- | --- | --- |
| `orange` | `#FF6B00` | Primary accent, fills, the sphere, dark-background accents |
| `orange-soft` | `#FF8C32` | Secondary accent |
| `orange-deep` | `#E05A00` | Large accent text on paper (3.4:1) |
| `orange-ink` | `#B84700` | Small accent text on paper (4.9:1) |
| `paper` | `#F7F5F0` | Warm off-white background |
| `ink` | `#171717` | Dark sections and primary text on paper |
| `text` | `#202020` | Body text |
| `muted` | `#686663` | Secondary text (darkened from `#777777` to pass WCAG AA) |

Pure `#FF6B00` on `#F7F5F0` is only about 2.6:1, so orange is used for fills and on dark backgrounds, and the
deeper variants are used for text on paper.

### Typography

- **Space Grotesk** for display headings and labels; **Inter** for body copy.
- Headlines use `clamp()` sizes (hero 42–280px depending on viewport), negative tracking (about −0.05em)
  and tight leading (0.86–0.95).
- Labels are 13px uppercase with 0.12em tracking and carry the chapter system ("Chapter 02 — What We Do").

### Layout

- Full-width sections with a 12-column editorial grid and fluid gutters (`clamp(16px, 4vw, 64px)`).
- Thin rules separate content instead of cards; no heavy borders, shadows or rounded rectangles.
- Headline compositions are intentionally varied (indented, right-aligned, flush) so sections do not repeat a
  single template.

---

## Motion system

Motion is used to orient the reader, never as decoration.

- **Smooth scrolling** — Lenis, wired into the GSAP ticker so ScrollTrigger stays in sync. Native touch
  scrolling is kept on mobile; there is no scroll-jacking (the pinned sphere stage uses `position: sticky`).
- **Text** — masked word/line reveals (Motion), scrubbed word highlighting (GSAP).
- **Scroll-driven** — ScrollTrigger for the About, Philosophy and Hero hand-offs; Motion's `useScroll` for the
  header progress bar and the sphere stage.
- **Interaction** — magnetic buttons, sliding nav indicator, underline sweeps, accordion rows, cursor ring.
- **Performance rules** — transforms and opacity only (the one deliberate exception is the Services row
  expansion); GPU-friendly; heavy work paused when off-screen.
- **Reduced motion** — respected everywhere: Lenis is disabled, GSAP animations are wrapped in
  `matchMedia`, Motion uses zero-duration transitions, the loader and cursor are skipped, and the sphere
  falls back to a static render.

The loading sequence runs once per tab session. A script in the document head decides this before first paint
and a timeout guarantees the page is never left hidden.

---

## Contact form and API

**Form (`ContactSection.tsx`):** full name, email, company (optional), project description, estimated budget
(optional). Thin underline fields with an animated focus line, inline validation linked with
`aria-describedby`, focus moved to the first invalid field, a loading spinner, a success panel and error
handling for validation, rate-limit, server and network failures.

**Endpoint (`POST /api/contact`):**

1. Same-origin check and JSON-only content type
2. Per-IP rate limit — 5 requests per 10 minutes, `429` with `Retry-After`
3. Body capped at 20 KB
4. Spam traps — hidden honeypot field (answered with a convincing success), minimum fill time (1.5s),
   maximum three links per message
5. Validation and sanitisation (shared with the client in `lib/contact.ts`): control and bidi characters
   stripped, line breaks removed from single-line fields, email lower-cased, budget checked against an
   allow-list
6. Delivery through the Resend API; email content is HTML-escaped; credentials stay on the server
7. Responses are `Cache-Control: no-store`; other methods return `405`

> The rate limiter is held in memory per server instance. On serverless or multi-instance hosting, back it
> with a shared store (Redis, Upstash, KV); the logic stays the same.

---

## Performance

- The three.js bundle (~260 KB gzipped) is **not** part of the initial load. It is fetched only when the
  sphere section is about a screen away, and only on capable, motion-friendly devices.
- Below-the-fold sections are split into their own chunks.
- Fonts are self-hosted by `next/font` with `display: swap`. There are no raster images; artwork is CSS/SVG.
- The sphere renders only while visible, uses a 64-segment mesh and caps the device pixel ratio at 1.75. If the
  frame rate stays low it hands over to the static CSS sphere.
- ScrollTrigger is re-measured once fonts and the page have loaded.

---

## Accessibility

- Semantic landmarks, one `h1`, ordered headings, skip link to `main`.
- Full keyboard support with visible focus (2px outline, colour-matched to each section's tone).
- Mobile menu: `aria-expanded`, modal dialog, **focus trap**, `Escape` to close, focus returned to the toggle,
  page content made `inert` while open.
- Services use disclosure buttons (`aria-expanded`, `aria-controls`); closed panels are `inert`.
- Headline text is exposed through `aria-label` while the animated word spans are hidden from assistive tech.
- Form fields have visible labels, required/optional states, `aria-invalid` and linked error messages; status
  changes are announced with `role="status"` / `role="alert"`.
- Navigation still works without JavaScript: the chapter links render inline as plain anchors.
- Colour contrast follows WCAG AA (see the colour notes above).

---

## Browser and device support

Verified at 320, 375, 768, 1024, 1440 and 1920px with no horizontal overflow. Targets current evergreen
browsers on desktop and mobile. The 3D sphere needs WebGL; devices without it, or flagged as low-power
(2 or fewer cores, 2 GB or less memory, data-saver), get the static sphere automatically.

---

## Customising content

Most copy and data lives in **`src/lib/constants.ts`**: site name and taglines, contact email, navigation
labels, services, process steps, social links and office locations. Section-specific headlines are set in the
section components themselves.

Before launch:

- Replace the placeholder email (`hello@orange.studio`) and the social URLs in `constants.ts`.
- Set the three environment variables so the contact form can send mail.
- Update `metadata` in `src/app/layout.tsx` (and add Open Graph imagery if desired).

---

## Deployment

Any Node-capable Next.js host works (Vercel, a container, etc.).

```bash
npm run build
npm start
```

Set the environment variables on the host. Because the contact route runs on the Node.js runtime and the rate
limiter is in-memory, use a shared store if you run more than one instance.

---

## Known limitations

- Rate limiting is per-instance (see above).
- The contact form has no CAPTCHA; protection relies on the honeypot, timing check, link limit, origin check
  and rate limit. Add a CAPTCHA provider if you see abuse.
- Social links, the email address and studio locations are placeholders.
- The live sphere was verified with software WebGL; real-device GPU performance has not been measured.
