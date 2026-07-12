# TickSwitch — Lessons Learned

## [22 May 2026] — pnpm lockfile
- **Rule**: Always use pnpm, never npm install or yarn add in app/web
- **Root cause**: Claude Code CLI used npm install, caused lockfile drift and Vercel build failures

## [22 May 2026] — TicketAlert page width alignment (Ticket Alerts vs Entrance Tickets)
- **Rule**: Any new section added to the `TicketAlert` page (`TicketAlert.tsx`) — e.g. a new ticket category, an upsell banner, a waitlist block — must be placed inside the shared `max-w-3xl mx-auto` flex column container at line 52. Do NOT add a `w-fit` parent or a self-sizing card with `lg:gap-[XXXpx]` hacks. Use `w-full` so all sections share the same single width source.
- **Root cause**: The original `Alert` card had no `w-full` and used `lg:gap-[300px]` to force its own content-based width. `EntranceTickets` used `w-full` (a percentage) which resolved against a different containing block (~1285px) instead of the Alert's ~650px. Two different width mechanisms can never align without a shared parent.
- **Fix applied**: Parent container changed to `w-full max-w-3xl mx-auto`. Alert card changed to `w-full` with `justify-between` handling the switch spacing. EntranceTickets `w-full` now correctly resolves to the same 768px parent.
- **Pattern to follow**: One `max-w-3xl mx-auto` parent → all children use `w-full` → single source of truth for width.

## [22 May 2026] — Checkout race condition
- **What happened**: Cart items were deleted at Razorpay order creation, not at payment verification. This released the ticket reservation mid-payment, allowing double sales.
- **Root cause**: Premature cart deletion in checkout() instead of verify(). Comment in code even flagged the decision.
- **Fix**: Moved cartItem.deleteMany to verify(), inside the payment_status !== 'paid' guard, after order marked paid.
- **Rule going forward**: Never release a reservation or delete cart items until payment signature is verified. Order creation ≠ payment success.

## [12 Jun 2026] — Leaked Gemini API key in .mcp.json
- **What happened**: `GEMINI_API_KEY` for the nano-banana-2 MCP server was hardcoded as a literal value in `.mcp.json`, committed across ~20 commits on `nishant` (first introduced at 965e34d), pushed to `origin/nishant`. Google's automated key-leak scanner detected and auto-revoked it (`403 PERMISSION_DENIED: "Your API key was reported as leaked"`).
- **Root cause**: `.mcp.json` was tracked in git with a literal API key instead of an env var reference. GitHub secret scanning is disabled on this repo (404 on `/secret-scanning/alerts`), so detection came from Google's own scanner, not GitHub — no alert to close on GitHub's side.
- **Fix applied**: New key generated, set as `NANO_BANANA_GEMINI_API_KEY` user-level env var (not committed). `.mcp.json` untracked from git (6ba74fa), `.mcp.json.example` added as the template with `${NANO_BANANA_GEMINI_API_KEY}` placeholder, `.gitignore` updated to exclude `.mcp.json`.
- **History scrub**: Skipped — key already revoked/inert, decided cosmetic-only. Would require `git filter-repo --replace-text` + force-push to `nishant` for ~20 commits (out of 165) if ever needed.
- **Rule going forward**: Any MCP server config requiring a secret must use `${ENV_VAR}` placeholders in `.mcp.json`, never literal values. Real values live only in user-level env vars (`setx` on Windows), never in any tracked file.

## [08 Jul 2026] — Security & bug-fix sweep (nishant)

Full codebase audit + fixes. Both `app/api` and `app/web` build clean after. No schema changes (§7 hard stop respected — reset-token expiry reuses the existing `otp_expiration` column). Details:

### CRITICAL
- **Password-reset OTP was returned in the HTTP response** (`auth.controller.ts` forgot/resend). Any email → OTP in JSON → full account takeover. Now only included when `NODE_ENV==='development'`; otherwise delivered by email only.
- **`ticket_file` leaked on public route** `ticketsByType` (`resaleTicket.service.ts`) used `include` with no `select`, exposing the uploaded ticket path publicly → free ticket download via `/uploads`. Replaced with an explicit `select` that omits `ticket_file`/`admin_notes`.
- **Buyer platform fee never charged.** `checkout.service.ts` built the Razorpay amount from listing price only, while the pay button showed listing + fee. Now adds `buyerFee` (shared `utils/pricing.ts`) to the order total.

### HIGH
- **Account deletion via GET** `/remove/account` → changed to `DELETE` (no frontend caller; button was unwired).
- **No rate limit on login / OTP-verify / reset** → added `authLimiter` (10 / 15 min) to login, verify-otp, reset-password, phone+email verify.
- **Cart reservations never released.** `reserved_until` was set but never enforced → phantom holds drove availability to 0. Added `releaseExpiredReservations()` sweep on every cart add (no scheduler on free tier — ponytail note left for cron).
- **Fee math disagreed 3 ways** (frontend 6%+₹25, backend 5%, docs 5%). Created backend `utils/pricing.ts` mirroring frontend `priceCap.ts`; `store()` + `checkout()` now use it. **DECISION NEEDING SIGN-OFF:** picked the frontend rule (6% + ₹25 min) because that's what buyers/sellers are actually shown. CLAUDE.md §8 still documents 5%+5% — reconcile the doc or the code.
- **Razorpay env var names**: `.env` uses `RAZORPAY_KEY`/`RAZORPAY_SECRET` (matches code; CLAUDE.md §4 doc is wrong). Added fallback `RAZORPAY_KEY_ID ?? RAZORPAY_KEY` so either naming works.

### MEDIUM
- Oversell race in cart add: added a post-increment re-check that rolls back if reserved+sold > quantity (ponytail: true fix needs SELECT…FOR UPDATE / Serializable).
- Ticketmaster fetch moved OUT of the `store()` Prisma transaction (was holding a DB connection across a 5s HTTP call).
- Account enumeration: forgot/resend now return a generic message instead of "email not found".
- Reset token had no expiry → now 15-min window via `otp_expiration`.
- Bank validation: `bank_account_number` regex was a phone pattern; now `^\d{9,18}$`. `account_holder_name` max raised 20→255.
- `AuthContext.register` now sends `password_confirmation` (was guaranteed 422).

### LOW
- Client password-strength now enforced (shared `utils/password.ts`) in Register + NewPassword; NewPassword checklist reflects the live value instead of always-green.
- `API.ts`: removed dead `(token||token)`, token now read live per request via interceptor; `setAuthToken` accepts `null`.
- Admin approve/reject: added idempotency guard (409 if already in target status).

### Known / left as-is (documented, not fixed)
- CORS fallback origin is a hardcoded `http://` IP (only used when `CORS_ORIGIN` unset).

## [08 Jul 2026] — Email OTP: verify-then-create (TicketSwap-style)

- **What changed**: `sendEmailOtp` no longer creates a `User` row for unknown emails. It now holds the OTP in an in-memory `Map` (`pendingEmailOtps`) keyed by email; the row is created inside `verifyEmailOtp` only **after** the code is confirmed. Existing accounts are unchanged (OTP still stored on their `users` row and verified there). All in `auth.service.ts`.
- **Why**: previous behavior polluted `users` with unverified placeholder-password rows for any email typed into the login form (spam/enumeration surface). Researched TicketSwap — their order is verify-ownership-first, create-on-success. Matched it while keeping identical UX ("type email → code → logged in, account auto-appears").
- **No schema change** (§7 respected), no controller/route change (response shape `{token, userData}` preserved), no frontend change (`Login.tsx` untouched).
- **Tradeoff (accepted)**: in-memory store is lost on server restart. Render free tier cold-starts after 15 min idle, so an in-flight new-email OTP can be dropped → user taps Resend. `ponytail:` comment in code names Redis/a table as the upgrade path if the API ever runs multiple instances.
- Phone OTP (`sendPhoneOtp`) still pre-creates a shell user — left as-is (Twilio is Phase 2).

## [08 Jul 2026] — CLAUDE.md fee-rate reconciled + checkout `ticket_id` fix (nishant)

Follow-up to the sweep above, per explicit user decision.

- **Fee rate confirmed as 6% + ₹25 min** (frontend `priceCap.ts` is the source of truth). CLAUDE.md §8 Rule 2 updated from "5% + 5%, no min" to match code — doc and code now agree.
- **Checkout `ticket_id` scoping fixed.** `checkout.controller.ts` accepts optional `ticket_id`; `checkout.service.ts` filters cart items to just that ticket when provided (used by `RazorpayCheckout.tsx` "buy now" flow), falls back to full-cart checkout when absent (used by `DiscountCart.tsx` cart-page flow — unchanged behavior, no `ticket_id` sent).
- **Follow-on bug caught during this fix**: `verify()` was clearing the buyer's **entire** cart on any paid order. With single-ticket checkout now possible, that would've silently deleted a buyer's other, still-unpaid cart items on payment success. Fixed to only delete cart items matching the paid order's `resale_ticket_id`s.
- Both `app/api` (tsc) and `app/web` (tsc+vite) build clean after.