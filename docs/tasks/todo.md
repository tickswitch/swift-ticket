# TickSwitch — Active Tasks

## In Progress
_(nothing active right now)_

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
