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