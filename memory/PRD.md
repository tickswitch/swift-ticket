# SwiftTickets - PRD

## Architecture
- **Frontend**: Vite + React + TypeScript at `/app/app/web`
- **Backend**: FastAPI at `/app/app/api`

## What's Been Implemented (design/phase3)

### Icon Tile Redesign — Circular frosted glass, blue #2563EB icons
### Thumbnail Standardization — 64px square, 8px radius, object-cover
### Concert Card Glassmorphism + Footer — Glass style, real copy, 4-col layout
### Font Standardization — 16px/semibold titles, 14px/grey venue+date, 24px/bold headings
### Parallax Orbs — 35%/-25% scroll speed, rAF, prefers-reduced-motion
### Full-Width Hero Area — Nav, carousel, trust bar edge-to-edge

**Full-width details:**
- Header.tsx: `w-full left-0` (removed rounded-2xl, max-w, width %, translate-x)
- Banner.tsx: `w-full` (removed max-w-[1720px] mx-auto rounded-2xl from container, swiper, slides, all 4 slider images+overlays)
- Carousel autoplay: `reverseDirection: true` for left-to-right advance
- HomePage.tsx: Restructured — Banner+TrustBar in full-width wrapper, rest in w-[95%] mx-auto
- MainLayout.tsx: Homepage gets no px-5 padding; non-homepage retains px-5 lg:px-0

## Testing Status
- Iterations 4-9: All 100% pass (icons, thumbnails, concerts, footer, fonts, parallax, full-width)
- Iteration 9: 15 tests — header/banner/trustbar all 1920px wide at x=0, all rounded-2xl removed, reverseDirection confirmed, orbs still animating, footer unaffected

## Backlog
- P2: Backend API connectivity in preview environment
