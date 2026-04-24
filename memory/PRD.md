# SwiftTickets - PRD

## Original Problem Statement
1. Redesign Safe/Easy/Fair icon tiles on /howitworks page (Phase 3 - completed)
2. Standardize all event/artist thumbnail sizes across all list-style cards (completed)
3. Fix concert card backgrounds + footer cleanup (completed)
4. Standardise font styling across ALL list card components (completed)

## Architecture
- **Frontend**: Vite + React + TypeScript at `/app/app/web`
- **Backend**: FastAPI at `/app/app/api`
- **Styling**: Tailwind CSS v4 + inline styles for glass effects

## What's Been Implemented

### 2026-04-24 - Icon Tile Redesign (Phase 3)
- Circular frosted glass containers, blue #2563EB icons

### 2026-04-24 - Thumbnail Standardization
- ALL list-style card thumbnails: 64px x 64px, border-radius 8px, object-fit cover

### 2026-04-24 - Concert Card Glassmorphism + Footer Cleanup
- Concert cards match festival/sports glassmorphism styling
- Footer: real copy, 4-column layout, proper spacing

### 2026-04-24 - Font Styling Standardization
**Standard applied to all list cards:**
- Event name: 16px (text-base), font-weight 600 (font-semibold)
- Venue/location: 14px (text-sm), font-weight 400, text-gray-500
- Date: 14px (text-sm), font-weight 400
- Badge: 12px, font-weight 400 (was 500)

**Section headings standardized:**
- Titles: 24px (text-2xl), font-weight 700 (font-bold) — removed responsive breakpoints
- Subtitles: 14px (text-sm), text-gray-500

**Files modified (10 components + 2 shared):**
- Title.tsx — `text-2xl font-bold` (removed lg:text-[30px] xl breakpoints)
- TicketBadge.tsx — fontWeight 400 (was 500)
- FestivalsForYou.tsx — event name text-base (was text-sm), venue text-sm (was text-xs), date text-sm (was text-xs)
- Concerts.tsx — event name text-base (was text-xl/2xl), venue added text-sm, TimerIcon 14px
- AllConcerts.tsx — same as Concerts
- AllSportsEvents.tsx — removed md:text-lg from title, removed font-semibold from date, standardized subtitle
- EventsListWithPagination.tsx — section title text-2xl (was text-3xl), event name text-base (was text-xl/2xl), venue/date standardized
- Events.tsx (EntranceTickets) — same as EventsListWithPagination
- PopularEvents.tsx — title font-bold (was font-semibold), removed md:text-lg, removed date font-semibold
- Trending.tsx — subtitle text-gray-500 text-sm (was text-secondaryText001)

**NOT changed (as specified):**
- Trending.tsx hero card content (text-xl md:text-2xl overlay text)
- SportsEvents.tsx full-bleed cards
- Navigation, footer, Safe/Easy/Fair icons, card backgrounds, thumbnails

## Testing Status
- Iteration 4: Icon tiles - 100% pass
- Iteration 5: Thumbnails - 100% pass
- Iteration 6: Concert cards + Footer - 100% pass
- Iteration 7: Font standardization - 100% pass (all 12 files verified)

## Backlog
- P2: Backend API connectivity in preview environment
