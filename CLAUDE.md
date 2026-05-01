# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SwiftTickets is a fan-to-fan ticket resale marketplace for India (Bengaluru-first launch). The monorepo has two apps:
- `app/api` — Express/TypeScript backend
- `app/web` — React 19/Vite frontend

## Commands

### Backend (`app/api`)
```bash
npm run dev          # ts-node-dev with hot reload
npm run build        # tsc compile to dist/
npm run start        # run compiled dist/server.js
npm run seed         # run prisma/seed.ts
npm run prisma:studio
npm run prisma:migrate   # dev migrations
npm run prisma:push      # push schema without migration history
```

### Frontend (`app/web`)
```bash
npm run dev     # Vite dev server
npm run build   # tsc + vite build
npm run lint    # eslint
```

## Environment Variables

**Backend** (`app/api/.env`):
- `DATABASE_URL` — Neon PostgreSQL connection string
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `APP_URL` — base URL for file URLs (used by `getFileUrl`)
- `PORT` — defaults to 8000
- `TICKETMASTER_API_KEY` — for event lookups
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

**Frontend** (`app/web/.env`):
- `VITE_BASE_URL` — points to backend (e.g., `http://localhost:8000/api`)

## Architecture

### Backend: Strict MVC Layering

**Flow:** `Route → Controller → Service → Repository → Prisma → DB`

- **Controller** (`*.controller.ts`): handles req/res only; always uses `catchAsync`; validates with Zod inline; returns standardized responses via `successResponse` / `errorResponse` from `utils/response.ts`
- **Service** (`*.service.ts`): all business logic; throws `AppError` for domain errors; no Express objects
- **Repository** (`*.repository.ts`): Prisma queries only, no logic
- **Validation** (`*.validation.ts`): Zod schemas for request bodies

Modules live in `src/modules/{auth,user,event,cart,checkout,resaleTicket,public}/`.

Shared utilities:
- `utils/AppError.ts` — operational error class (statusCode + isOperational flag)
- `utils/catchAsync.ts` — wraps async controllers
- `utils/response.ts` — `successResponse`, `errorResponse`, `paginateResponse`
- `utils/fileUpload.ts` — Multer config: `avatarUpload` (2MB images), `ticketUpload` (10MB any)
- `config/prisma.ts` — singleton Prisma client
- `middleware/auth.ts` — JWT `authenticate` middleware; extends `Request` as `AuthRequest`

### Frontend Architecture

**State management:**
- **Redux Toolkit** (`store/store.tsx`): two slices only
  - `StepperSlice` — tracks current step (1–9) and progress % for the sell-ticket wizard
  - `SellTicketSlice` — accumulates sell-ticket form data across steps; persists `data` (not files) to `localStorage` under key `"sellTicket"`
- **React Context** (`context/AuthContext.tsx`): `currentUser`, `login`, `logout`, `register`; stores `token` and `user` in `localStorage`
- **TanStack Query** for server state (data fetching)

**API layer** (`src/API/API.ts`): Generic typed helpers — `GetData`, `GetSingleData`, `PostData`, `PostMultipartData`, `DeleteData`. Token is read at module load from `localStorage`; call `setAuthToken()` after login/logout.

**Path alias**: `@` maps to `src/` (configured in `vite.config.ts`).

**Routing** (`router/routes.tsx`): React Router v7.
- `/` with `MainLayout` — public pages + protected profile/cart/tickets routes
- `/` with `SellTickets` layout — 9-step sell wizard: `sell-tickets → upload-tickets → add-ticket-details → ticket-price → your-ticket-price → your-address → bank-details → review-finish`
- `/auth/` — login, register, forgot-password (public-only routes)

### Core Business Rules

1. **120% price cap**: Resale price ≤ `floor(faceValue × 1.2)`. Enforced in `resaleTicket.service.ts`.
2. **Platform fees**: `buyerFee = ceil(price × 0.05)`, `sellerFee = ceil(price × 0.05)`. These are stored on the `ResaleTicket` record at creation.
3. **Ticket status flow**: `pending → approved → rejected` (admin-controlled); only `approved` tickets are shown to buyers.

### Database

Prisma schema with PostgreSQL (Neon). Key models:
- `User` — auth; links to `FinancialProfile`, `ResaleTicket`, `Order`, `Cart`, `Favorite`, `EventNotification`
- `ResaleTicket` — the central listing; stores computed fee fields (`buyerFee`, `sellerFee`, `sellerReceives`, `totalBuyerPays`, `maxAllowedPrice`, `originalFaceValue`)
- `Order` / `OrderItem` — Razorpay order lifecycle; `razorpay_order_id` stored on `Order`
- `Cart` / `CartItem` — per-user cart; `CartItem.reserved_until` for soft reservation
- Events are not stored locally — they are fetched live from the Ticketmaster Discovery API using `ticketmaster_id`

Prisma is pinned to `^5.22.0` — do not upgrade without testing migrations on Neon.

### File Uploads

Static files served at `/uploads` from `process.cwd()/uploads/`. Two Multer presets:
- `avatarUpload` — images only, 2 MB limit, saved to `uploads/avatars/`
- `ticketUpload` — any file, 10 MB limit, saved to `uploads/tickets/`

Note: on Render (free tier) the filesystem is ephemeral; uploaded files are lost on restart.
