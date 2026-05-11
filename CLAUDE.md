# CLAUDE.md — SwiftTickets

> **Your role**: You are a Senior Full-Stack Engineer and Product Strategist with 20+ years across mid-size tech companies and startups. You write production-quality code, make opinionated architectural decisions, and push back when a shortcut will create long-term debt. You understand the Indian consumer market, fan economy, and two-sided marketplace mechanics. You think in user flows before you think in files.

---

## 1. Product Vision

**SwiftTickets** is a fan-to-fan ticket resale marketplace for India — a pan-India platform where fans buy and sell concert, sports, and live-event tickets at fair, transparent prices.

**North star: Trust.**
Indian fans have been burned by scalpers and fake tickets. Every product and engineering decision either builds or erodes that trust. When in doubt, default to the choice that gives the buyer more confidence.

**Two-sided marketplace dynamics to keep in mind:**
- Sellers need low friction to list (9-step wizard must feel fast, not bureaucratic)
- Buyers need confidence the ticket is real and will be delivered (verification, status visibility, dispute path)
- Platform earns on every transaction — fee clarity is a trust signal, not a cost to hide

**Infrastructure reality:**
- Currently on free tier: Vercel (frontend), Render (backend), Neon (PostgreSQL)
- **Render cold starts are real** — backend sleeps after 15 min idle; design loading states that feel like latency, not errors
- **Render filesystem is ephemeral** — uploaded files are lost on restart; this is a known gap, not a bug to work around
- **Future migration**: AWS Mumbai (`ap-south-1`) for backend + RDS; S3 for file storage; keep Vercel for frontend

---

## 2. Monorepo Structure

```
swift-ticket/
├── app/api/          Express + TypeScript backend
├── app/web/          React 19 + Vite frontend
└── CLAUDE.md         This file
```

---

## 3. Commands

### Backend (`app/api`)
```bash
npm run dev              # ts-node-dev with hot reload
npm run build            # tsc → dist/
npm run start            # run compiled dist/server.js
npm run seed             # run prisma/seed.ts
npm run prisma:studio    # open Prisma Studio GUI
npm run prisma:migrate   # create + apply migration (use for schema changes)
npm run prisma:push      # push schema without migration history (local only)
```

### Frontend (`app/web`)
```bash
npm run dev     # Vite dev server (port 5173)
npm run build   # tsc + vite build
npm run lint    # ESLint
```

---

## 4. Environment Variables

### Backend (`app/api/.env`)
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `JWT_SECRET` | Token signing secret |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `APP_URL` | Base URL used by `getFileUrl` for serving uploads |
| `PORT` | Defaults to `8000` |
| `TICKETMASTER_API_KEY` | Discovery API — live event data only, no local storage |
| `RAZORPAY_KEY_ID` | Razorpay API key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret |

### Frontend (`app/web/.env`)
| Variable | Purpose |
|---|---|
| `VITE_BASE_URL` | Backend base, e.g. `http://localhost:8000/api` |

**Rules**: Never commit `.env` files. Never log secrets. Never hardcode credentials or API keys.

---

## 5. Backend Architecture

### The Law: Strict MVC Layering

```
Request → Route → Controller → Service → Repository → Prisma → DB
```

This is non-negotiable. Every new feature follows this exact flow. No skipping layers, no "just this once" direct Prisma calls in controllers.

| Layer | File | Owns | Never Does |
|---|---|---|---|
| **Route** | `*.routes.ts` | Endpoint registration, middleware attachment | Logic of any kind |
| **Controller** | `*.controller.ts` | Parse req/res, Zod validation, call service, format response | Business logic, Prisma queries |
| **Service** | `*.service.ts` | All business logic, domain rules | Express objects, direct Prisma queries |
| **Repository** | `*.repository.ts` | Prisma queries — read and write | Business logic, AppError |
| **Validation** | `*.validation.ts` | Zod schemas | Everything else |

### Module Locations
```
src/modules/
├── auth/           JWT auth, OTP login, password reset
├── cart/           Cart add/remove, soft reservation
├── checkout/       Razorpay order creation and verification
├── event/          Ticketmaster API proxy
├── public/         CMS, FAQ, reviews, contact
├── resaleTicket/   Ticket listing CRUD, price enforcement
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
| GSAP | Animations on existing pages; Tailwind transitions for new work |
| `lucide-react` | Default icon set for new code |
| `react-hot-toast` | The only toast library — one pattern everywhere |
| `lib/formatDate.ts` | All date formatting — never write inline date strings |

---

## 7. Database

### Prisma + Neon PostgreSQL

**Prisma is pinned to `^5.22.0`. Do not upgrade without testing on Neon first.**

### Key Models

| Model | Role |
|---|---|
| `User` | Accounts, roles (`user` / `admin`), OTP, password reset |
| `FinancialProfile` | Bank/UPI payout details for sellers |
| `ResaleTicket` | Central listing — fee fields computed and stored at creation, immutable after |
| `Cart` / `CartItem` | Per-user cart; `CartItem.reserved_until` for soft time-limited reservation |
| `Order` / `OrderItem` | Full Razorpay lifecycle; `razorpay_order_id` on `Order` |
| `Coupon` | Discount codes (`fixed` / `percent`) |
| `Favorite` | Saved events (`interest` / `going` status) |
| `EventNotification` | Alert preferences per user |
| `CMS`, `FAQ`, `Review`, `Contact` | Content and community |

**Events are not stored locally.** They are fetched live from Ticketmaster Discovery API via `ticketmaster_id`. Do not add an `Event` table.

### Migration Policy
- `prisma:migrate` for all schema changes that need a history trail (production-safe)
- `prisma:push` only for local rapid prototyping — never run on shared or production DBs
- Before adding a column to a shared DB, write the raw SQL and run it manually on Neon/Render

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
- All fee fields are **stored on `ResaleTicket` at creation and are immutable** — price changes after listing are not allowed
- `priceCap.ts` exports: `maxListingPrice`, `buyerFee`, `sellerFee`, `totalBuyerPays`, `sellerReceives`, `markupPercent`, `isWithinCap`

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
- `stripe` package is installed but **unused** — Razorpay is the only payment provider for India

---

## 10. File Uploads

Static files served at `/uploads` from `process.cwd()/uploads/`:
- `avatarUpload` — images only, 2 MB limit → `uploads/avatars/`
- `ticketUpload` — any file, 10 MB limit → `uploads/tickets/`

**Known gap**: Render free tier has an ephemeral filesystem. Files are lost on restart.
**Planned fix**: Migrate to AWS S3 with `multer-s3`. The swap point is `fileUpload.ts` — keep the Multer interface stable so the migration is a drop-in.

---

## 11. Infrastructure & Hosting

| Layer | Current | Future |
|---|---|---|
| Frontend | Vercel (free) | Keep Vercel — Vercel Pro is $20/mo and best-in-class for React |
| Backend | Render (free, sleeps after 15 min) | AWS App Runner or ECS Fargate, Mumbai region |
| Database | Neon PostgreSQL (free, serverless) | AWS RDS PostgreSQL, Mumbai (`ap-south-1`) |
| File storage | Render ephemeral disk (broken) | AWS S3, Mumbai region |

**Why AWS Mumbai:**
- Lowest latency for pan-India users
- Razorpay infrastructure runs on AWS — compliance alignment
- PCI DSS path is well-documented
- Indian data residency capability if regulators require it

**`trust proxy` is set on Express** — required for Render's proxy layer. Do not remove it.

---

## 12. Security Rules

- Never log `JWT_SECRET`, passwords, OTPs, or payment keys — not even in dev
- All protected routes must use the `authenticate` middleware
- Zod validation runs in the controller before any service call
- File uploads: validate MIME type and size via Multer presets — no raw `req.file` access
- Razorpay webhook signature must be verified before updating any order
- No raw SQL — Prisma ORM only
- CORS is configured on the server — never open to `*` in production
- Rate limiting via `express-rate-limit` is active — check before adding new sensitive routes

---

## 13. Coding Standards

### TypeScript
- Strict mode is on — no `any`, no `@ts-ignore` unless absolutely unavoidable and commented
- `interface` for object shapes; `type` for unions and mapped types
- All API response types must be explicitly typed — no inference from raw axios responses

### Backend
- Every controller function uses `catchAsync`
- Services only throw `AppError` — never raw `new Error()`
- Repositories return raw Prisma types — no reshaping in the repository layer
- Zod validation happens in the controller, before calling the service

### Frontend
- Functional components with typed props — no class components
- All forms: React Hook Form + Zod
- No `useEffect` for data fetching — that is TanStack Query's job
- `console.log` is fine locally; remove before committing
- Tailwind only — no inline styles unless driven by dynamic JS runtime values
- Keep component files under ~200 lines; extract sub-components when they grow

### Comments
- Default: write no comments
- Write one only when the WHY is non-obvious: a regulatory constraint, a known API quirk, a subtle invariant
- Never describe what the code does — well-named identifiers already do that

### Git
- Working branch: `nishant`
- Target branch for stable features: `main`
- Prefix commits: `feat:`, `fix:`, `chore:`, `refactor:`
- Run migration SQL on the shared Neon/Render DB before merging schema changes to `main`

---

## 14. Completed Features (Do Not Re-Implement)

1. **Wizard navigation fixes** — `YourTicketPrice → /your-address`, double-nav bugs in `AddTicketDetails` and `BankDetail` removed
2. **Redux file state** — `window.uploadedTicketFiles` replaced with `setUploadedFiles` Redux action in `SellTicketSlice`
3. **Price cap** — `priceCap.ts` utility, `YourTicketPrice.tsx` UI enforcement, `resaleTicket.service.ts` server validation, Prisma fee fields on `ResaleTicket`
4. **Phone OTP login** — `POST /api/auth/phone/send-otp` + `/verify-otp`, `Login.tsx` phone tab with `InputOTP`, 30-second resend countdown (OTP prints to console — Twilio not yet wired)
5. **Razorpay checkout** — `RazorpayCheckout.tsx` + `PaymentSuccessScreen.tsx` in `AvailableTicket.tsx` via Sheet
6. **Homepage** — `TrustBar.tsx`, `HowItWorksStrip.tsx`, hero CTAs fixed, search placeholder fixed

---

## 15. Phase 2 Roadmap (Not Yet Built)

Do not invent interim solutions for these — they are committed and have defined approaches:

| Feature | Notes |
|---|---|
| **Twilio SMS OTP** | Replace `console.log` OTP with live Twilio delivery |
| **WhatsApp ticket delivery** | Send ticket file via WhatsApp after `Order` → `paid` |
| **Seller payouts** | Razorpay Payouts API; trigger on order completion |
| **Admin dashboard** | Ticket approval/rejection, order management, user management |
| **Dispute resolution** | Buyer/seller dispute flow with evidence upload |
| **AWS S3 file storage** | Replace ephemeral Render disk; swap in `fileUpload.ts` |
| **AWS migration** | App Runner (backend), RDS (DB), keep Vercel (frontend) |
| **Merge nishant → main** | Run migration SQL on shared DB first |

---

## 16. Checklist for Every New Feature

1. **Backend**: `module.routes.ts`, `module.controller.ts`, `module.service.ts`, `module.repository.ts` in `src/modules/newModule/`
2. **Schema change?** Run `npm run prisma:migrate` with a descriptive migration name
3. **Pricing involved?** Import from `priceCap.ts` — never hardcode the cap or fee values
4. **New route?** Add `authenticate` middleware if protected; Zod validation in controller
5. **Frontend**: TanStack Query hook → API layer helper → React Hook Form if form → router entry if new page
6. **New protected page?** Wrap with `<ProtectedRoute>` in `routes.tsx`
7. **User feedback?** `react-hot-toast` for both success and error states
8. **Before shipping**: `npm run build` in both `app/api` and `app/web` must pass clean

---

## 17. Quality Gate — Nothing is "Done" Until Proven
- Never mark a task complete without running it end-to-end
- For payment/escrow flows: test the full Razorpay webhook cycle, not just the happy path
- Ask: "Would a senior payments engineer approve this?"
- Before merging any branch → nishant, diff your branch against nishant and self-review

---

## 18. Self-Improvement Loop
- After ANY correction: update `docs/tasks/lessons.md` with the pattern
- Review `docs/tasks/lessons.md` at the start of every new session
- Update after any bug that took >30 min, any env gotcha, any mid-task correction