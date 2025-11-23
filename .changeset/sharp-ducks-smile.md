---
"@stratify/stratify-ui": patch
---

- Build login page
- Move submit handler for the sign up form to a separate file to allow for unit tests to be written for it
- Add unit tests for login page, login form and submit handler
- Add unit tests for the submit handler used in the sign up form
- Rename unauthenticated route group (for public-facing pages) to "public"