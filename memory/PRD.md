# SwiftTickets - PRD

## Original Problem Statement
1. Redesign Safe/Easy/Fair icon tiles on /howitworks page (Phase 3 - completed)
2. Standardize all event/artist thumbnail sizes across all list-style cards (completed)
3. Fix concert card backgrounds + footer cleanup (completed)

## Architecture
- **Frontend**: Vite + React + TypeScript at `/app/app/web`
- **Backend**: FastAPI at `/app/app/api`
- **Styling**: Tailwind CSS v4 + inline styles for glass effects

## What's Been Implemented

### 2026-04-24 - Icon Tile Redesign (Phase 3)
- Replaced solid colored square icon containers with circular frosted glass containers
- Applied exact CSS specs for glassmorphism
- Changed icon colors from white to #2563EB

### 2026-04-24 - Thumbnail Standardization
- Standardized ALL list-style card thumbnails to 64px x 64px (w-16 h-16)
- Applied border-radius: 8px (rounded-lg) and object-fit: cover to all thumbnails

### 2026-04-24 - Concert Card Glassmorphism + Footer Cleanup
**Fix 1 — Concert cards:**
- Replaced `bg-slate-200` with glassmorphism inline styles on both `Concerts.tsx` and `AllConcerts.tsx`
- Applied: background rgba(255,255,255,0.7), backdrop-filter blur(12px), border 1px solid rgba(37,99,235,0.12)
- Cards now match festivals and sports sections

**Fix 2 — Footer:**
- Replaced Lorem ipsum with real copy: "India's trusted fan-to-fan ticket marketplace. Buy and sell tickets safely with SecureSwap protection."
- Upgraded from 3-column to 4-column grid layout (Brand | Menu | Support | Follow+Apps)
- Added 32px+ gaps between columns (gap-10 md:gap-8)
- Updated copyright from "LogoIpsum" to "SwiftTickets"
- Added data-testid attributes throughout

## Testing Status
- Iteration 4: Icon tile redesign - 100% pass
- Iteration 5: Thumbnail standardization - 100% pass
- Iteration 6: Concert cards + Footer - 100% pass

## Backlog
- P2: Backend API connectivity issues in preview environment
