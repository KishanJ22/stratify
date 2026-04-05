---
"@stratify/stratify-ui": minor
---

Retrieve client-side environment variables at runtime using next-public-env and use it in all layouts
- Allows for dynamically configuring the app without needing to rebuild the Docker image
- Significantly speeds up the CI/CD pipeline by eliminating the need to build and push a new image for each environment as client-side env variables are injected at runtime instead of build time