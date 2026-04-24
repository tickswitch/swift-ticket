# SwiftTickets — Phase 1 Glassmorphism

## Branch
`design/glassmorphism-phase1` (DO NOT touch or merge into `nishant`)

## Original problem statement
Apply Phase 1 glassmorphism to the SwiftTickets frontend (`app/web`). Light mode site; blue `#2563EB` is the primary colour (do not change). Do not change any colours, layouts, data, API calls, routing, or component logic. Only upgrade the visual/styling layer. Specs for cards, navbar, buttons, search bar, and hero orbs were provided verbatim and followed.

## User choices (captured Jan 2026)
- Scope of cards: **all card-like surfaces** across the app.
- Buttons: **all buttons** (primary + secondary) get pill border-radius.
- Hero orbs: **all hero sections across pages**.
- Testing: **run frontend testing subagent** for visual verification.

## What's been implemented (Jan 2026)
1. `/app/app/web/src/index.css` — added Phase 1 glassmorphism CSS:
   - `.glass-card` + broad targeting of `bg-white` + rounded patterns → translucent white, 12px blur, blue-12% border, soft blue shadow, 20px radius.
   - `.glass-nav` — rgba white 80%, 20px blur, blue-10% border-bottom, with scoped overrides to flip previously-white nav text to dark so content stays readable on the new light glass surface.
   - `.glass-search` — rgba white 60%, 8px blur, blue-15% border, 50px radius.
   - Pill-shape border-radius on all `<button>` elements (plus override for common Tailwind `rounded-*` utilities so existing buttons become pills).
   - `.hero-orbs` — two decorative `#2563EB` orbs at 7% opacity / 300px / blur(80px), rendered via `::before` (top-right) & `::after` (bottom-left). Uses `isolation: isolate` + `z-index: -1` so orbs stay behind content without touching child positioning.
2. `ui/card.tsx` — base `<Card>` uses `glass-card` + `rounded-[20px]`.
3. `ui/button.tsx` — base `rounded-md` → `rounded-full` for default/sm/lg.
4. `Common/Header.tsx` — navbar container uses `glass-nav`; desktop + mobile search bars use `glass-search`.
5. Hero `.hero-orbs` class added on:
   - `Common/Banner.tsx` (home hero)
   - `HowItWorksComponents/WhySwift.tsx`
   - `HowToSellComponents/SellTicket.tsx`
   - `About/AboutUs.tsx`
   - `TicketAlerts/Events.tsx` (events list hero)

## Testing status
Frontend testing subagent verified 100% on 6 pages + mobile viewport. Computed styles match spec (glass-nav bg rgba(255,255,255,0.8) / blur 20px; orbs rgb(37,99,235) opacity 0.07 blur 80px; buttons border-radius 9999px). Login page pre-existing dark translucent design preserved.

## Files modified
- `app/web/src/index.css`
- `app/web/src/components/ui/card.tsx`
- `app/web/src/components/ui/button.tsx`
- `app/web/src/components/Common/Header.tsx`
- `app/web/src/components/Common/Banner.tsx`
- `app/web/src/components/HomePage/...` (unchanged — inherit via CSS rules)
- `app/web/src/components/HowItWorksComponents/WhySwift.tsx`
- `app/web/src/components/HowToSellComponents/SellTicket.tsx`
- `app/web/src/components/About/AboutUs.tsx`
- `app/web/src/components/TicketAlerts/Events.tsx`

## Backlog / Future phases (P1/P2)
- Narrow the global `button { border-radius: 9999px }` to scoped selectors once all button usages are audited.
- Narrow `.bg-white[class*='rounded-']` card rule to explicit `.glass-card` classes for precision.
- Phase 2: consider semantic CSS variables for dark/light theming beyond light-mode only.
- Audit remaining ticket/checkout/profile sub-pages to confirm glass treatment is desirable everywhere.
