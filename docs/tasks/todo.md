# TickSwitch — Active Tasks

## In Progress
_(nothing active right now)_

## From /impeccable critique — redesign branch (feat/redesign), 2026-07-25/26
Site-wide critique found the site was 53% (17/32) — mostly a reskinned template
(Lorem Ipsum, "TicketSwap"/Webflow-demo content, CORS blocking all data) with a broken
buyer-trust surface. Fixed CORS + copy + error states + the two worst code bugs, score
moved to 69% (25/36). Remaining from that pass:
- [ ] Raw SVG props unconverted to camelCase (`stroke-width`, `fill-rule`, etc.) —
      throws React DOM warnings sitewide, plus one invalid `<div>`-in-`<p>` nesting
      in the ticket-listing empty state (via `TickertAlertIcons`)
- [ ] Contrast failures on /howitworks — `#fec100 on #eff6ff` (1.5:1) and
      `#57bae3 on #eff6ff` (2.0:1), both fail WCAG AA (need 4.5:1)
- [ ] Login has no phone-OTP tab — only email OTP / email+password, contradicts
      CLAUDE.md §17 India-first primary-auth mandate
- [ ] FansOfSwifTickets.tsx (/howtosell) still claims "14 million fans across 46
      countries" and "earnings transferred...within 5 business days" — inherited
      template stats, don't fit an India-only pre-launch product with payouts not
      yet built (RazorpayX payout flow is still Parked below)
- [ ] Home hero footer "Join 15.1 million fans" + identical "4.7 — 9000+ reviews"
      badge on both app stores — same class of uncalibrated placeholder stat
- [ ] `ErrorText`'s retry state uses `role="status"`; `role="alert"` would be more
      semantically correct for an actual error (minor, current choice is defensible)
- [ ] Seed real resale ticket listings so the buyer flow (`/availabletickets/:id/:name`)
      can actually be tested end to end — **blocked**: nishant branch's Neon DB is
      test/dev per Nishant, but no DB writes without explicit confirmation each time
      (see CLAUDE.md §7 unresolved hard-stop). Do not do this without asking first.

## Frontend — Ready to Build
- [ ] Social share button — listing card + seller detail page. 
      Web Share API + copy link fallback. Branch: feature/social-share
- [ ] Homepage light theme — unify all content sections to 
      light background (Find Events, Trending, Festivals, 
      Sports, Concerts, How It Works, Feedback sections)
- [ ] Dependency audit — 118 GitHub vulnerabilities 
      (2 critical, 56 high). Run npm audit fix in app/api 
      and pnpm audit fix in app/web

## Backend — Ready to Build
_(nothing blocked — all frontend first)_

## India-Launch Content + SEO Plan (Phase 0 done, P0 2/8)

**Phase 0 — done**
- [x] Brand name confirmed: SwiftTickets (not TickSwitch)
- [x] Typography system: "Full Liquid" — Instrument Sans (via legacy proximaRegular/Bold/
      SemiBold utility names) + Fraunces italic accent + JetBrains Mono. See CLAUDE.md §17.

**P0 — launch blockers**
- [ ] SEO meta tag system (react-helmet-async or equivalent) — nothing exists yet,
      prerequisite for title/meta work on every page below
- [ ] Homepage copy rewrite — national India-launch positioning, not Bengaluru-only
- [ ] Event detail page copy + Event/Offer/BreadcrumbList schema (reseller disclosure)
- [ ] Buy/sell flow microcopy + error/empty/cold-start states
- [x] Trust & Safety page (/trust-and-safety) — SecureSwap escrow, refund scenarios, FAQ+schema
- [x] Fees page (/fees) — live-computed from priceCap.ts
- [ ] /how-it-works content refresh — worked fee example, escrow timeline, FAQ
- [ ] Legal stubs — /terms /privacy /refund-policy /grievance — NEEDS LEGAL REVIEW, draft
      plain-English summary only, do not ship full text as final
- [ ] Transactional email copy — OTP, listing approved/rejected, sold, payout, reminder
- [ ] T1 city hubs (Mumbai, Delhi NCR, Bengaluru, Hyderabad) + 4 category pages each
- [ ] Help center top 10 articles

**P1**
- [ ] T2 city hubs (Pune, Chennai, Kolkata, Goa) + categories
- [ ] T1 venue pages (~50) — check if content needs schema (§7 hard stop) or can be static/CMS
- [ ] Guide content — "is it safe to buy resale tickets in India", "how to sell your ticket",
      national last-minute-tickets guide, T1 monthly calendars
- [ ] Artist pages (city-agnostic, national demand aggregator)
- [ ] About/Contact refresh + formalize "SecureSwap" guarantee branding everywhere

**P2**
- [ ] T2 venues, competitor comparison pages, press page
- [ ] Review/rating schema — only once real reviews exist, never seed fake
- [ ] Hindi content exploration (separate initiative, don't half-ship)
- [ ] T3 cities — only once live inventory exists

Full plan detail (keyword strategy, URL structure, per-page briefs, voice/tone) was worked
out in chat — not yet written to a project doc. Ask to have it written to
`docs/tasks/content-seo-plan.md` if it needs to survive outside conversation history.

## Parked — Waiting on RazorpayX confirmation
- [ ] Schema migration — rewrite FinancialProfile 
      (add UPI fields, PayoutMethod enum, make 
      financial_profile_id optional on ResaleTicket)
- [ ] RazorpayX payout flow — seller UPI onboarding 
      (contact + fund account), payout trigger after QR verify
- [ ] Sell wizard — UPI gate before listing goes live 
      (check upi_id set, show amber warning if missing)
- [ ] Sell wizard Review screen — masked payout row, 
      amber warning if UPI missing

## Phase 2 Roadmap
- [ ] Twilio SMS OTP — replace console.log OTP
- [ ] Resend custom domain — noreply@swifttickets.in
- [ ] WhatsApp ticket delivery after order paid
- [ ] Admin dashboard — ticket approvals, order management
- [ ] Dispute resolution — buyer/seller flow
- [ ] AWS S3 file storage — replace ephemeral disk
- [ ] MVC refactor — add repository.ts to resaleTicket/, 
      checkout/, event/ modules
- [ ] Stripe removal — remove unused package
- [ ] Confirm DB target on EC2 — resolve §7
- [ ] Nginx on EC2 — SSL termination
- [ ] Organiser resale — B2B, event organisers list 
      unsold/returned tickets via TickSwitch
- [ ] Shared resale — organiser gets cut of seller markup

## Completed
- [x] CORS fix — CORS_ORIGIN missing from app/api/.env entirely; localhost:5173
      was never allowed, blocking all frontend→backend calls in dev
- [x] Brand-name collision cleanup — "TicketSwap" (a real EU competitor's name)
      replaced with SwiftTickets across 10 files; Lorem Ipsum paragraphs (About,
      /howitworks, Add-to-Cart) rewritten with real copy; /howtosell FAQ (3 of 6
      items were literally about Webflow, all 6 answers were Latin placeholder)
      rewritten with real seller Q&A; fake "10000+ Loyal Partner" logo strip
      (Dropbox/Webflow/Coinbase/Spotify) removed from footer
- [x] Home error/retry state — ErrorText now has role="status"/aria-live +
      "Try again" button wired to refetch(), across all 6 Home event-fetching
      sections (previously: infinite grey skeleton, no error UI at all)
- [x] Home hero — fixed invalid nested <a>-in-<a> (outer Link pointed at "/",
      itself, dead click target + React hydration warning + broken screen-reader
      semantics)
- [x] TicketBadge zero-state relabeled "0 tickets left" → "No resale listings
      yet" — old label read as broken/sold-out for the normal case of an event
      with no seller listings yet; also removed the redundant duplicate
      "0 available · 0 sold · 0 wanted" stat line on event-details page
- [x] EventFiltersBar.tsx contrast fix (gray-800/cyan-400 hover) — turned out to
      be a detector false positive on re-check (classes never render
      simultaneously) but the added hover:text-cyan-900 is harmless
- [x] Profile page — light theme redesign
- [x] Payout page — built + light theme (feature/payout-profile)
- [x] UpiInput — light theme fix
- [x] Sell wizard — removed YourAddress + BankDetail (9→7 steps)
- [x] priceCap.ts — updated to 6%+6% with ₹25 minimum
- [x] TicketListingCard — fixed stale priceCap references
- [x] YourTicketPrice — fixed fee display text
- [x] RazorpayCheckout — fixed platform fee label 5%→6%
- [x] Homepage trending — replaced Amsterdam with Indian events
- [x] Checkout race condition — cart deletion moved to verify()
- [x] lessons.md — properly formatted with real lessons
- [x] pnpm enforced in CLAUDE.md
- [x] Phone OTP login
- [x] Razorpay checkout flow
- [x] Price cap (120%) enforcement
- [x] Homepage TrustBar + HowItWorksStrip
