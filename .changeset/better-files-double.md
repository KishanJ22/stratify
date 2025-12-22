---
"@stratify/stratify-ui": patch
---

- Add "App" route group for containing pages that are displayed when a user is logged in
- Build session provider for loading a session, providing user details to the portal and handling logout
- Add "Public" route group for containing pages that are displayed when a user isn't logged in
- Build avatar component for displaying the logged in user's initials
- Redirect to login page if user is not authenticated when accessing logged in routes
- Display toast notification when the session expires or user logs out