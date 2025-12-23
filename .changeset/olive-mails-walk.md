---
"@stratify/stratify-api": patch
---

- Add plugin to do an auth check when a request is made to a protected route (any route other than the auth routes, /health and root)
- Store user details in context for each request that requires authentication
- Log user details if available in context
- Build placeholder route for getting stock ticker data to test auth