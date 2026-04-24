# SwiftTickets - PRD

## Original Problem Statement
1. Redesign Safe/Easy/Fair icon tiles on /howitworks page (Phase 3 - completed)
2. Standardize all event/artist thumbnail sizes across all list-style cards for visual consistency

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
- Applied border-radius: 8px (rounded-lg) to all thumbnails
- Applied object-fit: cover (object-cover) to all thumbnails
- Added flex-shrink-0 to prevent thumbnail shrinking in flex containers
- Files modified:
  - `/app/app/web/src/components/HomePage/FestivalsForYou.tsx` - Already 64px, added data-testid
  - `/app/app/web/src/components/HomePage/Concerts.tsx` - Changed from 80px to 64px
  - `/app/app/web/src/components/HomePage/AllConcerts.tsx` - Changed from 80px to 64px
  - `/app/app/web/src/components/HomePage/AllSportsEvents.tsx` - Changed from 78x80px to 64px, added object-cover
  - `/app/app/web/src/components/HomePage/EventsListWithPagination.tsx` - Changed from 128px to 64px
  - `/app/app/web/src/components/TicketAlerts/Events.tsx` (EntranceTickets) - Changed from 128px to 64px

### Unchanged (by design)
- Trending.tsx - Hero/carousel cards with full-bleed images
- SportsEvents.tsx - Full-bleed genre cards
- ExploreEvents.tsx - Venue cards with initials
- Event.tsx - Hero banner cards
- EventbriteNearby.tsx - Cards without event thumbnails
- WhySwift.tsx - Safe/Easy/Fair glassmorphism icons

## Testing Status
- Iteration 4: Icon tile redesign - 100% pass
- Iteration 5: Thumbnail standardization - 100% pass (code verification)

## Backlog
- P2: Backend API connectivity issues in preview environment (data-dependent sections)
