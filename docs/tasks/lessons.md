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