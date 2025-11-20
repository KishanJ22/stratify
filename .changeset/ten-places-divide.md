---
"@stratify/stratify-api": patch
---

Better auth configuration changes
- Temporarily remove email verification on sign-up (to be re-enabled when Resend is setup for sending emails)
- Enable cookie cache and add a time until a session can be considered stale
