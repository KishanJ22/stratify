---
"@stratify/stratify-ui": patch
---

- Add hook for creating an instance for handling authentication with Better Auth
- Add middleware layer for proxying requests to the correct APIs based on the path name in the request URL
- Add environment provider so that the proxy URLs for accessing APIs are accessible by a client
