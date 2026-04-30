# SwiftTickets — Fix/Email-OTP Branch

## Problem Statement
Email OTP login was working, then stopped.
Symptoms: OTP button gets stuck in loading state indefinitely; no OTP email arrives.

## Stack
- Backend: Express/TypeScript — `app/api`
- Frontend: React 19/Vite — `app/web`
- Database: Prisma/PostgreSQL (Neon)
- Deployed: Render (backend) + Vercel (frontend)

## Root Causes Found

### 1. nodemailer had NO connection timeout (CRITICAL — stuck button)
`nodemailer.createTransport()` was called with no `connectionTimeout`, `greetingTimeout`,
or `socketTimeout`. When the mail server is unreachable or credentials are wrong, it hangs
indefinitely. This keeps the HTTP request open → the frontend `finally` block never runs →
`setIsSendingOtp(false)` never called → button stuck in loading forever.

### 2. sendMail() in development mode fell through to actual send
After logging `=== MOCK EMAIL ===`, the code did NOT `return`. It continued to try
`transporter.sendMail(...)`, which silently swallowed errors in dev. Misleading behaviour.

### 3. Transporter created at module load time (dotenv timing bug)
In `server.ts`, `dotenv.config()` was called AFTER all `import` statements. Since TypeScript
compiles to CJS, all `require()` calls run in import order. `mail.ts` was loaded (and ran
`createTransport()`) BEFORE `dotenv.config()` — so `MAIL_HOST`, `MAIL_PORT`, etc. were
`undefined` when the transporter was created. (Affects local dev; Render injects env vars
directly into process.env so this was a local-only bug, but still wrong.)

### 4. AppError import was placed AFTER the transporter const in mail.ts
Import statements should be at the top of the file. A misplaced import is a code smell and
can confuse static analysis.

### 5. No axios timeout on frontend OTP calls
If the backend hangs for any reason, axios waits indefinitely — `setIsSendingOtp(false)` in
the `finally` block would never run. Button stays stuck.

### 6. Missing .env.example
The `app/api/.env.example` file was deleted in the `final init` commit. Re-created to
document all required env vars including the five MAIL_* vars.

## Fixes Applied

### Backend — `app/api/src/config/mail.ts`
- All imports moved to top of file
- Transporter is now created LAZILY inside `sendMail()` (not at module load time)
  so it always reads the current `process.env` values
- Added `connectionTimeout: 10_000`, `greetingTimeout: 10_000`, `socketTimeout: 15_000`
  so nodemailer fails fast instead of hanging indefinitely
- Added `secure: port === 465` (correct TLS handling for Mailtrap 587/2525 vs 465)
- Dev mode now returns EARLY after mock-logging (no more fallthrough to real send)
- Added env-var guard: if MAIL_HOST / MAIL_USERNAME / MAIL_PASSWORD are missing, throws
  a clear AppError with a helpful console.error pointing to Render settings
- Added `MAIL_FROM_NAME ?? 'SwiftTickets'` fallback
- Removed the `export default transporter` (nothing used it)

### Backend — `app/api/src/config/env.ts` (new file)
- Bootstrap module that calls `dotenv.config()`

### Backend — `app/api/src/server.ts`
- Import `./config/env` as the VERY FIRST import so dotenv runs before any other module
  (including mail.ts) is evaluated
- Removed now-redundant `import dotenv` and `dotenv.config()` call

### Frontend — `app/web/src/pages/auth/Login.tsx`
- Added `{ timeout: 30000 }` to both `axios.post` calls (`handleSendOtp` and
  `handleVerifyOtp`) so the button always resolves within 30 s even if the server hangs

### Docs — `app/api/.env.example` (re-created)
- Documents all five required MAIL_* vars plus other env vars

## IMPORTANT: Render Deployment Checklist
After pushing to Render, verify the following 5 env vars are set in the Render dashboard:
  MAIL_HOST=sandbox.smtp.mailtrap.io   (or your provider)
  MAIL_PORT=587
  MAIL_USERNAME=<your mailtrap username>
  MAIL_PASSWORD=<your mailtrap password>
  MAIL_FROM_ADDRESS=<from address>

If any of these are missing or wrong, `sendMail` will now surface a clear error to the
frontend (no more silent hang) and log `[sendMail] Mail env vars not set ...` to the Render
logs.

## Architecture
- Email OTP routes: POST `/api/auth/email/send-otp` and POST `/api/auth/email/verify-otp`
- Phone/SMS OTP (Twilio): separate, untouched
- Google/Facebook/Apple OAuth buttons: untouched

## What Was NOT Changed
- Phone/SMS OTP flow (Twilio)
- Google/Facebook/Apple OAuth buttons
- Any other auth routes
- Styling or layout
