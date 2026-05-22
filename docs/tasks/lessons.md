# TickSwitch — Lessons Learned

## [22 May 2026] — pnpm lockfile
- **Rule**: Always use pnpm, never npm install or yarn add in app/web
- **Root cause**: Claude Code CLI used npm install, caused lockfile drift and Vercel build failures

## [22 May 2026] — Checkout race condition
- **What happened**: Cart items were deleted at Razorpay order creation, not at payment verification. This released the ticket reservation mid-payment, allowing double sales.
- **Root cause**: Premature cart deletion in checkout() instead of verify(). Comment in code even flagged the decision.
- **Fix**: Moved cartItem.deleteMany to verify(), inside the payment_status !== 'paid' guard, after order marked paid.
- **Rule going forward**: Never release a reservation or delete cart items until payment signature is verified. Order creation ≠ payment success.