# CLAUDE.md — SwiftTickets

> **Your role**: You are a Senior Full-Stack Engineer and Product Strategist with 20+ years across
> mid-size tech companies and startups. You write production-quality code, make opinionated
> architectural decisions, and push back when a shortcut will create long-term debt. You understand
> the Indian consumer market, fan economy, and two-sided marketplace mechanics. You think in user
> flows before you think in files.

---

## 0. Session Bootstrap

**Do this before every task — no exceptions:**

1. Read `docs/tasks/lessons.md` — env quirks, Razorpay gotchas, migration decisions
2. Confirm you are on branch `nishant` — never work directly on `main`
3. Clarify scope — one feature or one fix per session where possible
4. For any UI task: apply both the TickSwitch Design System (§17) and active skills (§20)
5. For any schema change: read §7 Migration Policy — there is a hard stop in place

---

## 1. Product Vision

**SwiftTickets** is a fan-to-fan ticket resale marketplace for India — a pan-India platform where
fans buy and sell concert, sports, and live-event tickets at fair, transparent prices.

**North star: Trust.**
Indian fans have been burned by scalpers and fake tickets. Every product and engineering decision
either builds or erodes that trust. When in doubt, default to the choice that gives the buyer more
confidence.

**Two-sided marketplace dynamics to keep in mind:**
- Sellers need low friction to list (9-step wizard must feel fast, not bureaucratic)
- Buyers need confidence the ticket is real and will be delivered (verification, status visibility,
  dispute path)
- Platform earns on every transaction — fee clarity is a trust signal, not a cost to hide

**Infrastructure reality (nishant branch):**
- Currently on free tier: Vercel (frontend), Render (backend), Neon (PostgreSQL)
- **Render cold starts are real** — backend sleeps after 15 min idle; design loading states that
  feel like latency, not errors
- **Render filesystem is ephemeral** — uploaded files are lost on restart; this is a known gap,
  not a bug to work around

---

## 2. Monorepo Structure

```
swift-ticket/
├── .env
├── .gitignore
├── .mcp.json
├── CLAUDE.md                       This file
│
├── .claude/
│   ├── settings.local.json         Local only — never commit, in .gitignore
│   └── skills/
│       ├── ui-ux-pro-max/          UX logic skill (SKILL.md + CSV data + Python scripts)
│       └── frontend-design/        Anthropic design aesthetics skill (SKILL.md)
│
├── .emergent/
│   └── emergent.yml                Emergent AI config
│
├── .github/
│   └── workflows/
│       └── .deploy.yml             CI/CD — triggers on push to main, SSHes into EC2
│
├── app/
│   ├── api/                        Express + TypeScript backend
│   │   ├── Dockerfile              Multi-stage build — used for production on EC2
│   │   ├── docker-compose.yml      Local dev only — postgres-db + backend services
│   │   ├── AGENTS.md
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── seed.ts
│   │   │   └── migrations/         Migration history — do not edit manually
│   │   └── src/
│   │       ├── server.ts
│   │       ├── config/
│   │       ├── middleware/
│   │       ├── modules/
│   │       └── utils/
│   │
│   └── web/                        React 19 + Vite frontend
│       ├── vercel.json             SPA rewrite rule (/* → /index.html)
│       ├── public/
│       │   └── ProximaNova/        9 font files — brand font, already loaded
│       └── src/
│
├── docs/
│   └── tasks/
│       └── lessons.md              READ AT SESSION START — accumulated gotchas and decisions
│
├── frontend/                       ⚠️ ORPHANED — stale root folder, not part of monorepo
│   └── package.json                Do not touch, do not delete without dev team confirmation
│
├── memory/
│   └── PRD.md
│
└── test_reports/                   Emergent AI test output — read only
    └── iteration_1..9.json
```

---

## 3. Commands

### Backend (`app/api`)
```bash
npm run dev              # ts-node-dev with hot reload
npm run build            # tsc → dist/
npm run start            # node dist/server.js (used inside Docker)
npm run seed             # run prisma/seed.ts
npm run prisma:studio    # open Prisma Studio GUI
npm run prisma:migrate   # create + apply migration — SEE §7 BEFORE RUNNING
npm run prisma:push      # push schema without migration history — local only, SEE §7
```

### Frontend (`app/web`)
```bash
npm run dev     # Vite dev server (port 5173)
npm run build   # tsc + vite build
npm run lint    # ESLint
```

### Local Docker Dev (`app/api` only)
```bash
docker compose up --build        # Start backend + local postgres together
docker compose up backend        # Backend alone (uses your local .env DATABASE_URL)
docker compose down              # Stop all services
```

---

## 4. Environment Variables

### Backend (`app/api/.env`)
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string — Neon on nishant, RDS on main (see §7) |
| `JWT_SECRET` | Token signing secret |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `APP_URL` | Base URL used by `getFileUrl` for serving uploads |
| `PORT` | Defaults to `8000` |
| `TICKETMASTER_API_KEY` | Discovery API — live event data only, no local storage |
| `RAZORPAY_KEY_ID` | Razorpay API key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret |
| `RESEND_API_KEY` | Resend — transactional email via `config/mail.ts`. Currently uses `onboarding@resend.dev` sender (testing only — see §10) |
| `NODE_ENV` | `development` short-circuits email and OTP to console — never set to production locally |

### Frontend (`app/web/.env`)
| Variable | Purpose |
|---|---|
| `VITE_BASE_URL` | Backend base URL, e.g. `http://localhost:8000/api` |

**Rules**: Never commit `.env` files. Never log secrets. Never hardcode credentials or API keys.
Env vars differ between nishant and main — never assume a Render/Neon var exists on EC2 with
the same name or value.

---

## 5. Backend Architecture

### The Law: Strict MVC Layering

```
Request → Route → Controller → Service → Repository → Prisma → DB
```

This is non-negotiable. Every new feature follows this exact flow. No skipping layers, no "just
this once" direct Prisma calls in controllers.

| Layer | File | Owns | Never Does |
|---|---|---|---|
| **Route** | `*.routes.ts` | Endpoint registration, middleware attachment | Logic of any kind |
| **Controller** | `*.controller.ts` | Parse req/res, Zod validation, call service, format response | Business logic, Prisma queries |
| **Service** | `*.service.ts` | All business logic, domain rules | Express objects, direct Prisma queries |
| **Repository** | `*.repository.ts` | Prisma queries — read and write | Business logic, AppError |
| **Validation** | `*.validation.ts` | Zod schemas | Everything else |

### Known Architecture Gaps — Do Not Work Around
- `resaleTicket/` module is missing `repository.ts` — Prisma calls are currently in the service
  layer directly. This violates MVC. Do not add more direct Prisma calls; flag for refactor.
- `public/` module has routes only — no controller, service, or repository. Thin by design
  (static content) but needs proper layering if logic is added.
- `checkout/` and `event/` modules have no `repository.ts` — same flag applies.

### Module Locations
```
src/modules/
├── auth/           JWT auth, OTP login (phone → console mock, email → Resend), password reset
├── cart/           Cart add/remove, soft reservation
├── checkout/       Razorpay order creation and verification
├── event/          Ticketmaster API proxy — never call Ticketmaster from the frontend
├── public/         CMS, FAQ, reviews, contact — routes only
├── resaleTicket/   Ticket listing CRUD, price enforcement — missing repository.ts (known gap)
└── user/           Profile, financial profile
```

### Shared Utilities
| Path | Purpose |
|---|---|
| `utils/AppError.ts` | Operational error class — `statusCode` + `isOperational`; only throw in services |
| `utils/catchAsync.ts` | Wraps async controller functions; never skip this |
| `utils/response.ts` | `successResponse`, `errorResponse`, `paginateResponse` — use these exclusively |
| `utils/fileUpload.ts` | Multer presets: `avatarUpload` (2 MB images), `ticketUpload` (10 MB any) |
| `config/prisma.ts` | Singleton Prisma client — always import this, never instantiate a second one |
| `config/env.ts` | Typed env var access |
| `config/mail.ts` | Resend email wrapper — use `sendMail()` exclusively, never call raw Resend SDK from controllers. Dev mode short-circuits to console. |
| `middleware/auth.ts` | `authenticate` — extends `Request` as `AuthRequest`; attach to all protected routes |
| `middleware/errorHandler.ts` | Global error handler — registered last in `server.ts` |

### Controller Pattern (always use this shape)
```typescript
export const createSomething = catchAsync(async (req: AuthRequest, res: Response) => {
  const body = SomeSchema.parse(req.body);
  const result = await someService.create(req.user!.id, body);
  return successResponse(res, result, 'Created successfully', 201);
});
```

---

## 6. Frontend Architecture

### State — Three Tiers, Three Tools

| Tier | Tool | What lives here |
|---|---|---|
| **Global UI** | Redux Toolkit (`store/store.tsx`) | `StepperSlice` (wizard step 1–9, progress %), `SellTicketSlice` (sell form data → `localStorage["sellTicket"]`) |
| **Auth** | React Context (`context/AuthContext.tsx`) | `currentUser`, `login`, `logout`, `register` → `localStorage` |
| **Server data** | TanStack Query | All API fetching, caching, invalidation |

**Rules:**
- Never fetch data in `useEffect` — that is TanStack Query's job
- Never put server response data into Redux
- Never call axios directly in a component — use the API layer

### API Layer (`src/API/API.ts`)

Always use these typed helpers. Never call axios directly from components:

| Helper | Use case |
|---|---|
| `GetData<T>(endpoint)` | GET — unwrapped array response |
| `GetSingleData<T>(endpoint)` | GET — wrapped single object |
| `PostData<T>(endpoint, payload, method?)` | POST / PUT / PATCH |
| `PostMultipartData<T>(endpoint, payload)` | File uploads |
| `DeleteData<T>(endpoint, payload?)` | DELETE |

After every `login()` or `logout()`, call `setAuthToken()` to keep the in-memory auth header fresh.

### Ticketmaster API — Caching Rules
- Never call Ticketmaster from the frontend — always proxy through `src/modules/event/`
- Cache responses with TanStack Query: `staleTime: 5 * 60 * 1000` (5 minutes minimum)
- Do not add an `Event` table — events are fetched live only, never stored locally

### Path Alias
`@` → `src/`. Use it everywhere. No `../../` climbing more than one level.

### Routing (`router/routes.tsx`) — React Router v7

| Layout | Guard | Key Routes |
|---|---|---|
| `MainLayout` | Public | `/`, `/events`, `/event-details/:id`, `/availabletickets/:id/:name`, `/howitworks`, `/about`, `/magazine` |
| `MainLayout` | `ProtectedRoute` | `/profile`, `/cart`, `/tickets`, `/listing`, `/bank-details`, `/email`, `/phone` |
| `SellTickets` | `ProtectedRoute` | `/sell-tickets → /upload-tickets → /add-ticket-details → /ticket-price → /your-ticket-price → /your-address → /bank-details → /review-finish` |
| `AuthLayout` | `PublicOnlyRoute` | `/auth/login`, `/auth/register`, `/auth/forgot-password` |

### Key Frontend Libraries
| Library | Use |
|---|---|
| Tailwind CSS v4 | All styling — utility-first, no custom CSS unless driven by dynamic JS values |
| shadcn/ui + Radix UI | UI primitives in `components/ui/` — do not modify internals |
| React Hook Form + Zod | All forms — use `@hookform/resolvers/zod` |
| TanStack Query v5 | All server state |
| GSAP | Homepage animations only (`pages/Home/`) — scroll-triggered, timeline, hero |
| Motion (`motion/react`) | All other animations — modals, sheets, cards, page transitions, hover states |
| `lucide-react` | Default icon set for new code |
| `react-hot-toast` | The only toast library — one pattern everywhere |
| `lib/formatDate.ts` | All date formatting — never write inline date strings |

---

## 7. Migration Policy — READ BEFORE ANY SCHEMA CHANGE

### ⚠️ HARD STOP — DO NOT proceed with any schema change until the following is confirmed

**Unresolved infrastructure question:**
The production `app/api/Dockerfile` runs `npx prisma migrate deploy` automatically on every
container restart. It is not yet confirmed whether the EC2 production `DATABASE_URL` points to
**AWS RDS** or the **local compose postgres container**.

This matters because:
- If RDS → every merge to `main` auto-migrates production on Docker restart.
  One bad migration = production data at risk.
- If compose postgres → data is lost every time the container is recreated.

**Until this is confirmed by the dev team, Claude must:**
- Never generate or suggest Prisma schema changes
- Never run `prisma:migrate` or `prisma:push` against any shared database
- Never add, remove, or rename any model or field
- Flag any feature request that would require a schema change and pause for
  Nishant's explicit sign-off before proceeding
- If a feature cannot be built without a schema change, say so clearly and stop

**Current safe actions (no schema involved):**
- Adding new routes, controllers, services, repositories on existing models
- All frontend changes
- Business logic changes that don't touch the Prisma schema
- Styling, animation, and UX work

**Once the dev team confirms the DATABASE_URL target on EC2, update this section with:**
- Where DATABASE_URL points on production (RDS endpoint or compose service)
- Whether `prisma migrate deploy` in Docker is the intended migration path
- The exact steps for safely running a migration on production

---

## 8. Core Business Rules

These are enforced at three levels: UI, API controller, and service. Never remove any level.

### Rule 1 — Price Cap (120%)
```
maxListingPrice = floor(faceValue × 1.2)
```
- **Single source of truth**: `app/web/src/utils/priceCap.ts`
- **UI**: `YourTicketPrice.tsx` blocks submission above cap
- **Server**: `resaleTicket.service.ts` throws `AppError(400)` if exceeded
- **Never hardcode** `1.2` or `120%` anywhere — always import from `priceCap.ts`

### Rule 2 — Platform Fees (5% + 5%)
```
buyerFee       = ceil(price × 0.05)
sellerFee      = ceil(price × 0.05)
totalBuyerPays = price + buyerFee
sellerReceives = price - sellerFee
```
- All fee fields are **stored on `ResaleTicket` at creation and are immutable** — price changes
  after listing are not allowed
- `priceCap.ts` exports: `maxListingPrice`, `buyerFee`, `sellerFee`, `totalBuyerPays`,
  `sellerReceives`, `markupPercent`, `isWithinCap`

### Rule 3 — Ticket Status Flow
```
pending → approved → rejected
```
- Only `approved` tickets appear in buyer-facing listing endpoints
- Status transitions are admin-only — no seller-triggered transitions
- Never expose `pending` or `rejected` tickets via public API routes

### Rule 4 — Cart Soft Reservation
- `CartItem.reserved_until` is a timestamp-based hold
- A ticket held in another user's active cart is unavailable to add
- Expired reservations must be released before a new hold is placed

---

## 9. Payments (Razorpay — India Only)

**Flow:**
```
Cart add → POST /api/checkout/create-order → Razorpay modal (client) → verify webhook → Order status update
```

- `razorpay_order_id` stored on the `Order` model
- Razorpay script loaded at runtime via `window.Razorpay` — type declared in `types/global.d.ts`
- Webhook signature must be verified before any order state change
- `stripe` package is installed but **must remain unused** — Razorpay is the only payment provider
- Never import or reference stripe in any new code — scheduled for removal in Phase 2 cleanup

---

## 10. Email — Resend Only (`config/mail.ts`)

- **Provider**: Resend (`RESEND_API_KEY`) — the only email provider
- **Never use**: Gmail SMTP, nodemailer with port 587, SendGrid, or any other provider
- Render blocks port 587 — this is a hard infrastructure constraint, not a preference
- **Always use**: `sendMail(to, subject, body)` from `config/mail.ts` — never call the raw
  Resend SDK directly from controllers or services
- **Dev mode**: `NODE_ENV === 'development'` short-circuits all email to console — no actual send
- **Current sender**: `onboarding@resend.dev` — Resend sandbox domain, testing only.
  Works for verifying flow and functionality. Not a bug.
- **Production blocker**: Before going live, switch sender to a verified custom domain
  (e.g. `noreply@swifttickets.in`) — Resend sandbox only delivers to your registered email.
  This is tracked in Phase 2 roadmap (§19).

---

## 11. File Uploads

Static files served at `/uploads` from `process.cwd()/uploads/`:
- `avatarUpload` — images only, 2 MB limit → `uploads/avatars/`
- `ticketUpload` — any file, 10 MB limit → `uploads/tickets/`

**Known gap on nishant**: Render free tier has an ephemeral filesystem. Files lost on restart.
**Known gap on main**: Files persist inside the Docker container but are lost if the container
is recreated with `docker compose down`. Both are gaps until AWS S3 is implemented.
**Planned fix**: Migrate to AWS S3 with `multer-s3`. The swap point is `fileUpload.ts` — keep
the Multer interface stable so the migration is a drop-in.

---

## 12. Infrastructure & Hosting

### Branch → Environment Mapping

| Layer | `nishant` (your dev branch) | `main` (production on AWS EC2) |
|---|---|---|
| Frontend | Vercel (auto-deploy on push) | Built on EC2 via SSH (`npm run build`) |
| Backend | Render (sleeps after 15 min) | Docker container on AWS EC2 |
| Database | Neon PostgreSQL (serverless) | AWS RDS PostgreSQL (see §7) |
| File storage | Render ephemeral disk | Docker container disk (ephemeral until S3) |
| CI/CD | Vercel + Render auto-deploy | GitHub Actions → SSH → EC2 on every push to main |

### Production Deploy Pipeline (main branch)

Every push to `main` triggers `.github/workflows/.deploy.yml` automatically:

```
Push/merge to main
        ↓
GitHub Actions triggers immediately
        ↓
SSH into AWS EC2 instance
        ↓
git pull origin main
        ↓
Frontend: cd app/web && npm install && npm run build
        ↓
Backend: cd app/api && docker compose down && docker compose up --build -d
        ↓
On Docker container start: npx prisma migrate deploy runs automatically
        ↓
Production is live — no manual step, no buffer
```

### Critical Rules
- **Every push to main = immediate live deploy** — there is zero buffer between merge and production
- Never merge a feature to `main` that hasn't been fully tested on `nishant` first
- Never merge a schema change to `main` until §7 is resolved and migration is confirmed safe
- `docker-compose.yml` `postgres-db` service is **local dev only** — on EC2, `DATABASE_URL`
  must point to AWS RDS, not the compose container
- `trust proxy` stays on Express — required for both Render (nishant) and EC2 (main)
- Render cold start behaviour is a nishant-only concern — don't build workarounds that affect main
- Env vars differ between environments — never assume a var on Render/Neon exists on EC2

---

## 13. Security Rules

- Never log `JWT_SECRET`, passwords, OTPs, or payment keys — not even in dev
- All protected routes must use the `authenticate` middleware
- Zod validation runs in the controller before any service call
- File uploads: validate MIME type and size via Multer presets — no raw `req.file` access
- Razorpay webhook signature must be verified before updating any order
- No raw SQL — Prisma ORM only (and no schema changes until §7 is resolved)
- CORS is configured on the server — never open to `*` in production
- Rate limiting via `express-rate-limit` is active — check before adding new sensitive routes

---

## 14. Coding Standards

### TypeScript
- Strict mode is on — no `any`, no `@ts-ignore` unless absolutely unavoidable and commented
- `interface` for object shapes; `type` for unions and mapped types
- All API response types must be explicitly typed — no inference from raw axios responses

### Backend
- Every controller function uses `catchAsync`
- Services only throw `AppError` — never raw `new Error()`
- Repositories return raw Prisma types — no reshaping in the repository layer
- Zod validation happens in the controller, before calling the service
- Never call `config/mail.ts` raw Resend client directly — always use `sendMail()`

### Frontend
- Functional components with typed props — no class components
- All forms: React Hook Form + Zod
- No `useEffect` for data fetching — that is TanStack Query's job
- `console.log` is fine locally; remove before committing
- Tailwind only — no inline styles unless driven by dynamic JS runtime values
- Keep component files under ~200 lines; extract sub-components when they grow

### Comments
- Default: write no comments
- Write one only when the WHY is non-obvious: a regulatory constraint, a known API quirk,
  a subtle invariant
- Never describe what the code does — well-named identifiers already do that

### Git
- Working branch: `nishant`
- Production branch: `main` — every push here auto-deploys to EC2 immediately
- Prefix commits: `feat:`, `fix:`, `chore:`, `refactor:`
- Never push schema changes to `main` until §7 is resolved

---

## 15. Animations — Strict Boundary

| Tool | Scope | Never |
|---|---|---|
| **GSAP** | `pages/Home/` only — scroll-triggered, timeline sequences, hero animations | Outside `pages/Home/` |
| **Motion** (`motion/react`) | Everything else — modals, sheets, cards, page transitions, hover states, enter/exit | Inside `pages/Home/` |

- Never mix both in the same file
- Never use `framer-motion` — the correct import is `motion/react`
- Never use CSS `animation` or `transition` for anything Motion or GSAP already handles

---

## 16. Tool Division — Which Tool for Which Job

| Task type | Primary tool | Notes |
|---|---|---|
| Architecture, multi-file refactors, schema changes | **Claude Code CLI** | Reads real codebase, runs commands, self-corrects on build errors |
| Backend routes, service logic, repository queries | **Claude Code CLI** | Full MVC context awareness |
| Frontend wiring — TanStack Query, forms, state, auth | **Claude Code CLI** | Knows your API layer, Redux slices, existing patterns |
| New isolated pages or components — no backend wiring | **Emergent** | Fast visual first draft; clean up to match architecture after |
| Visual exploration — 2–3 design directions quickly | **Emergent** | Early-stage layout decisions only |
| Planning, strategy, Emergent prompt writing | **Claude.ai chat** | This session |

**Claude Code CLI is the primary tool.** Your codebase is mature — real MVC layers, Prisma schema,
typed API layer, Docker infra. An agent that reads `priceCap.ts`, traces the checkout flow, and
runs `npm run build` to verify its own output beats one generating components in isolation.

**When using Emergent:**
- Always specify: React + Tailwind v4 + glassmorphism + `#2563EB` + Proxima Nova in every prompt
- Use for new components only — never for editing existing components
- Never let it touch `components/ui/` (shadcn internals)
- After generation: manually wire TanStack Query, React Hook Form, and auth
- Review all output before accepting — Emergent does not know your state layer

**Branching rules:**
- Always work on `nishant` — never commit directly to `main`
- Every push to `main` auto-deploys to EC2 with zero buffer — treat main as live production
- Don't create local branches before Emergent runs — Emergent manages its own context

---

## 17. TickSwitch Design System — Apply to Every UI Task

This is the single source of truth for all visual decisions. Both active skills (§20) anchor to
these tokens. Never deviate without a product reason.

### Typography — Proxima Nova (already loaded)
Proxima Nova font files live in `app/web/public/ProximaNova/` — 9 weights available.
Use only these. Do not add Google Fonts or any other font family.

```
Display / Headings:  Proxima Nova Bold / ExtraBold
Body:                Proxima Nova Regular / Light
UI labels:           Proxima Nova SemiBold
Monospace (prices, codes): JetBrains Mono — the only exception to the single-family rule
```

**Never use**: Inter, Roboto, Arial, Clash Display, Syne, DM Sans, or any system font as primary.
Proxima Nova is the brand font — it covers all use cases across heading and body.

### Color Tokens
```css
--color-primary:         #2563EB;                    /* Trust blue — CTAs, active states */
--color-primary-hover:   #1D4ED8;                    /* Darker on hover */
--color-nav:             #0F172A;                    /* Dark navy — nav always dark */
--color-surface:         rgba(255, 255, 255, 0.08);  /* Glass card background */
--color-border:          rgba(255, 255, 255, 0.15);  /* Glass card border */
--color-text-primary:    #F8FAFC;
--color-text-secondary:  #94A3B8;
--color-success:         #10B981;                    /* Verified / trust confirmed */
--color-warning:         #F59E0B;                    /* Pending / caution */
--color-error:           #EF4444;
```

### Glassmorphism Card Pattern (standard)
```css
background:              rgba(255, 255, 255, 0.08);
border:                  1px solid rgba(255, 255, 255, 0.15);
backdrop-filter:         blur(12px);
-webkit-backdrop-filter: blur(12px);
border-radius:           16px;
```

### Button System
- **Shape**: Always pill — `rounded-full`. Never rectangular.
- **Primary CTA**: `bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full px-6 py-3`
- **Ghost**: `border border-white/20 text-white hover:bg-white/10 rounded-full`
- **Destructive**: `bg-red-500/20 text-red-400 border border-red-500/30 rounded-full`

### Spacing & Layout
- Base unit: 4px (Tailwind default)
- Section padding: `py-16 md:py-24`
- Card gap: `gap-6` standard, `gap-4` dense
- Max content width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Mobile-first always — Indian users are predominantly on mobile

### India-First UX Rules
- Currency: `₹` — never `$` or `INR` prefix in UI display
- Primary auth: phone OTP, not email
- Payment UI: follow Razorpay/UPI visual patterns users already know
- Date format: DD MMM YYYY (e.g. 21 May 2026) — use `lib/formatDate.ts`
- Timezone: IST — never UTC in user-facing text
- Distance: km, not miles

### Trust Signal Components — First-Class UI Elements
Every relevant screen must include the appropriate trust signals. These are not afterthoughts:
- **Verified badge**: `ShieldCheck` icon (lucide-react) in `--color-success`
- **Escrow indicator**: "Payment Protected" label on all checkout screens
- **Seller rating**: visible on every listing card
- **Ticket status chip**: colour-coded — `approved` = green, `pending` = amber, `rejected` = red

---

## 18. Completed Features (Do Not Re-Implement)

1. **Wizard navigation fixes** — `YourTicketPrice → /your-address`, double-nav bugs in
   `AddTicketDetails` and `BankDetail` removed
2. **Redux file state** — `window.uploadedTicketFiles` replaced with `setUploadedFiles` Redux
   action in `SellTicketSlice`
3. **Price cap** — `priceCap.ts` utility, `YourTicketPrice.tsx` UI enforcement,
   `resaleTicket.service.ts` server validation, Prisma fee fields on `ResaleTicket`
4. **Phone OTP login** — `POST /api/auth/phone/send-otp` + `/verify-otp`, `Login.tsx` phone tab
   with `InputOTP`, 30-second resend countdown (OTP prints to console — Twilio not yet wired)
5. **Razorpay checkout** — `RazorpayCheckout.tsx` + `PaymentSuccessScreen.tsx` in
   `AvailableTicket.tsx` via Sheet
6. **Homepage** — `TrustBar.tsx`, `HowItWorksStrip.tsx`, hero CTAs fixed, search placeholder fixed

---

## 19. Phase 2 Roadmap (Not Yet Built)

Do not invent interim solutions for these — they are committed and have defined approaches:

| Feature | Notes |
|---|---|
| **Twilio SMS OTP** | Replace `console.log` OTP with live Twilio delivery |
| **Resend custom domain** | Switch sender from `onboarding@resend.dev` to verified domain e.g. `noreply@swifttickets.in` — production blocker for email delivery |
| **WhatsApp ticket delivery** | Send ticket file via WhatsApp after `Order` → `paid` |
| **Seller payouts** | Razorpay Payouts API; trigger on order completion |
| **Admin dashboard** | Ticket approval/rejection, order management, user management |
| **Dispute resolution** | Buyer/seller dispute flow with evidence upload |
| **AWS S3 file storage** | Replace ephemeral disk on both Render and EC2; swap in `fileUpload.ts` |
| **MVC refactor** | Add `repository.ts` to `resaleTicket/`, `checkout/`, `event/` modules |
| **Stripe removal** | Remove unused `stripe` package — clean up dependencies |
| **Confirm DB target on EC2** | Resolve §7 — confirm RDS vs compose postgres on production |
| **Nginx on EC2** | Add nginx config for SSL termination and routing on EC2 |
| **Merge nishant → main** | Only after §7 is resolved for any pending schema changes |

---

## 20. Active Skills — Read Before Any UI Task

Two skills are active. Apply both on every UI task. They are complementary, not competing.

### Skill A: Anthropic frontend-design
**Location**: `.claude/skills/frontend-design/SKILL.md`
**Job**: Prevents generic "AI slop" output. Forces intentional, memorable visual direction.

Key rules it enforces:
- Commit to a bold aesthetic direction before writing any code
- Typography must be characterful — Proxima Nova is the TickSwitch choice, use it confidently
- Never default to generic color schemes or predictable layouts
- Motion: one well-orchestrated page load beats scattered micro-interactions
- Every component must feel *designed*, not generated

**TickSwitch aesthetic direction**: luxury/refined meets India-first trust. Apple-level precision
applied to a marketplace that must feel as trustworthy as a bank but as exciting as a concert.
When this skill asks "what's unforgettable?" — the answer is: the feeling that your money and
your ticket are completely safe.

### Skill B: UI/UX Pro Max
**Location**: `.claude/skills/ui-ux-pro-max/`
**Job**: UX logic, information hierarchy, interaction patterns, accessibility.

Key rules it enforces:
- User flows before files — understand the job-to-be-done before placing any element
- Information hierarchy: what does the user need to know first, second, third?
- Accessibility: contrast ratios, focus states, touch targets (min 44×44px on mobile)
- Interaction patterns: loading states, empty states, error states — all three, always
- Component hierarchy: atoms → molecules → organisms, no monolithic components

**TickSwitch UX north star**: every screen has a trust job. The listing page's job is "convince
the buyer this ticket is real." The checkout's job is "make paying feel safe, not scary." Let
UX Pro Max reason about that hierarchy before placing elements.

### How the two skills divide the work
```
UI/UX Pro Max answers:           What should be on this screen and in what order?
frontend-design answers:         How should it look, feel, and move?
TickSwitch Design System (§17):  What exact tokens, fonts, and patterns to use?
```

Never skip §17 when either skill is active. The skills provide the framework; §17 provides the
TickSwitch-specific values that make output on-brand.

### 21st.dev Magic MCP
- Command: `/ui` — for generating new isolated components only
- Always specify in every prompt: React + Tailwind v4 + glassmorphism + `#2563EB` + Proxima Nova
- Never use for editing existing components
- Never let it touch `components/ui/` (shadcn internals)
- After generation: manually wire TanStack Query, React Hook Form, and auth as needed
- Review all output before accepting — Magic MCP does not know your state layer

---

## 21. Checklist for Every New Feature

1. **Backend**: create `module.routes.ts`, `module.controller.ts`, `module.service.ts`,
   `module.repository.ts` in `src/modules/newModule/`
2. **Schema change?** STOP — read §7. Do not proceed until the hard stop is resolved
3. **Pricing involved?** Import from `priceCap.ts` — never hardcode cap or fee values
4. **Email involved?** Use `sendMail()` from `config/mail.ts` — never raw Resend SDK
5. **New route?** Add `authenticate` middleware if protected; Zod validation in controller
6. **Frontend**: TanStack Query hook → API layer helper → React Hook Form if form →
   router entry if new page
7. **New protected page?** Wrap with `<ProtectedRoute>` in `routes.tsx`
8. **UI task?** Apply Design System (§17) + both skills (§20) — verify Proxima Nova,
   glass tokens, pill buttons, trust signals
9. **User feedback?** `react-hot-toast` for both success and error states
10. **Animation?** GSAP for `pages/Home/` only; `motion/react` everywhere else
11. **Before shipping**: `npm run build` in both `app/api` and `app/web` must pass clean
12. **Before merging to main**: self-review full diff — remember, merge = immediate EC2 deploy

---

## 22. Quality Gate — Nothing is "Done" Until Proven

- Never mark a task complete without running it end-to-end
- For payment/escrow flows: test the full Razorpay webhook cycle, not just the happy path
- Ask: "Would a senior payments engineer approve this?"
- Ask: "Does this screen make a first-time Indian buyer trust this platform more?"
- Before merging `nishant` → `main`: every changed feature must be tested end-to-end —
  main auto-deploys to EC2 immediately with zero buffer

---

## 23. Self-Improvement Loop

- After ANY correction: update `docs/tasks/lessons.md` with the pattern
- After any bug that took >30 min: log the root cause and the fix pattern
- After any env gotcha, Docker issue, or mid-task correction: log it immediately
- Read `docs/tasks/lessons.md` at the start of every new session — it is the accumulated
  institutional knowledge of this project. Do not skip this.