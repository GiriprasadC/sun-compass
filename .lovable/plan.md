# SUN Academic Research & Training — Website Plan

## Overview
Swap out the TanStack Start scaffold and rebuild on **Vite + React 18 + react-router-dom v6**, matching the provided spec exactly. Three real routes (`/`, `/services`, `/contact`), Tailwind design system in SUN green, Framer Motion animations, lucide-react icons, and a fully validated (UI-only) enquiry form.

## Pages & Routes
- `/` — Home: Navbar, Hero, About, Why Choose Us (animated counters), Footer
- `/services` — Services grid (4 data-driven cards) with "Learn More" modal
- `/contact` — 3-column: contact info, validated enquiry form, Google Maps iframe

## Design System (Tailwind tokens in `src/styles.css`)
- Primary green `#2E7D32`, hover `#256428`, tint `#E8F5E9`
- Text `#1A1A1A` / `#6B7280`, border `#E5E7EB`, surface white
- Headings Plus Jakarta Sans 600–700, body Inter 400–500 (loaded via `<link>` in `index.html`)
- Radius: `xl` cards, full pills; soft shadow, elevate on hover
- Section padding `py-20 md:py-28`
- Respect `prefers-reduced-motion`

## Tech
- React 18, Vite, react-router-dom v6
- Tailwind CSS v4 (keep current setup, retune tokens)
- framer-motion, lucide-react, react-hook-form, zod, react-intersection-observer

## Folder Structure
```text
src/
  assets/            hero.jpg, director.jpg (generated placeholders)
  components/
    layout/          Navbar.tsx, Footer.tsx
    home/            Hero.tsx, About.tsx, WhyChooseUs.tsx, AnimatedCounter.tsx
    services/        ServiceCard.tsx, ServiceModal.tsx
    contact/         ContactInfo.tsx, EnquiryForm.tsx, MapEmbed.tsx
    ui/              Button.tsx, SectionHeading.tsx, Container.tsx
  data/              services.ts, stats.ts, navLinks.ts
  pages/             Home.tsx, Services.tsx, Contact.tsx
  App.tsx            <BrowserRouter> + <Routes>
  main.tsx
  index.css
index.html
```

## Component Specs (per user spec, condensed)
- **Navbar** — sticky, blur bg, shadow-on-scroll, active NavLink underline, mobile hamburger with AnimatePresence, green pill "Contact Us" CTA.
- **Hero** — 2-col; H1 "Empowering Research, Education & Professional Development", two CTAs (`/contact` filled, `/services` outline), placeholder hero image right with soft green blob backdrop.
- **About** — Prof. Dr. R. Rajendran bio exactly as supplied, credential pill badges, placeholder profile photo.
- **WhyChooseUs + AnimatedCounter** — 4 stats (35+, 85+, 10+, 1000+), counter animates when in view via `useInView` + `requestAnimationFrame`, preserves `+` suffix.
- **Services** — `.map()` over `data/services.ts` (4 services with full topics/methodology/duration/venue/timing). Card = green icon badge, title, 2–3 line summary, "Learn More" button opening a Radix-style modal (focus-trapped) with full detail lists.
- **ContactInfo** — icon rows: Director, Address, Phone (tel:), Email (mailto:), Office Hours 9AM–8PM.
- **EnquiryForm** — react-hook-form + zod (name ≥2, Indian 10-digit phone regex, valid email, message ≥10). Inline errors, loading state, on submit resolves after a short delay and shows success banner with checkmark. **No backend wired** — a `TODO` comment marks the integration point.
- **MapEmbed** — plain Google Maps `<iframe>` for Kilpauk Chennai 600010, `loading="lazy"`, rounded-2xl.
- **Footer** — 4 cols (brand, quick links, contact, socials), copyright 2026.

## Animations (framer-motion)
- Scroll reveal: `initial{opacity:0,y:24}` → `whileInView`, `viewport={{once:true, amount:0.2}}`
- Staggered children for card grids
- Hover `scale:1.03`, tap `0.97`
- Navbar shadow via `useScroll`
- Mobile menu via `AnimatePresence`

## Assets
Generate two placeholder images with the image tool:
- `hero.jpg` — abstract academic/research scene, green accent
- `director.jpg` — neutral professional portrait placeholder

## SEO / Head
Each page sets its own `<title>` and `<meta name="description">` via a small `useDocumentHead` hook (no SSR, no head library needed).

## Accessibility
Semantic landmarks, one H1/page, labelled inputs (`aria-invalid`, `aria-describedby`), focus-trapped modal, keyboard nav, WCAG AA contrast on green buttons.

## Technical Notes
- Rip out TanStack Start: remove `src/routes/`, `src/router.tsx`, `src/server.ts`, `src/start.ts`, `src/routeTree.gen.ts`, TanStack Router/Start plugins from `vite.config.ts`, `@tanstack/*` deps except react-query (drop it too — not needed).
- Add `index.html` with root `<div id="root">` + font `<link>` tags.
- New `src/main.tsx` mounts `<App />` under `<BrowserRouter>`.
- Rewrite `vite.config.ts` to plain `@vitejs/plugin-react` + Tailwind v4 Vite plugin.
- `src/styles.css` keeps `@import "tailwindcss"` and gets the SUN color tokens under `@theme` / `:root`.
- Install: `react-router-dom framer-motion lucide-react react-hook-form zod @hookform/resolvers react-intersection-observer`; remove TanStack packages.
- Note: dropping SSR means slightly weaker SEO than TanStack Start, but matches the requested stack.

## Deliverable Checklist (from spec)
Sticky responsive navbar · Hero + dual CTA · About with real bio · 4 data-driven service cards with modal · Animated stats · Contact 3-col with validated form + success + map · Footer · Mobile-first responsive · Reduced-motion support · Placeholder image slots marked.
