# SwiftTickets - PRD

## Original Problem Statement
Design phase 3 — glassmorphism refinements across the SwiftTickets platform.

## Architecture
- **Frontend**: Vite + React + TypeScript at `/app/app/web`
- **Backend**: FastAPI at `/app/app/api`
- **Styling**: Tailwind CSS v4 + inline styles for glass effects

## What's Been Implemented

### Icon Tile Redesign — Circular frosted glass containers, blue #2563EB icons
### Thumbnail Standardization — All list cards: 64px square, 8px radius, object-cover
### Concert Card Glassmorphism + Footer Cleanup — Matching glass style, real copy, 4-col layout
### Font Styling Standardization — 16px/semibold titles, 14px/grey venue+date, 24px/bold headings
### Parallax Scroll Animation — Blue orbs move at 35%/-25% scroll speed

**Implementation details (parallax):**
- MainLayout.tsx: useRef + useEffect with requestAnimationFrame scroll listener
- Ticking guard pattern prevents excessive rAF calls
- Passive scroll listener for performance
- Proper cleanup (removeEventListener + cancelAnimationFrame)
- CSS: will-change: transform on both orbs for GPU compositing
- Accessibility: JS matchMedia check + CSS @media (prefers-reduced-motion: reduce)
- Orb properties (colour, size, blur, z-index) completely unchanged

## Testing Status
- Iteration 4: Icon tiles — 100% pass
- Iteration 5: Thumbnails — 100% pass
- Iteration 6: Concert cards + Footer — 100% pass
- Iteration 7: Font standardization — 100% pass
- Iteration 8: Parallax orbs — 100% pass (transforms verified: 350px/−250px at 1000px scroll)

## Backlog
- P2: Backend API connectivity in preview environment
