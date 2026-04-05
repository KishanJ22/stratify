---
"@stratify/stratify-api": patch
"@stratify/stratify-data-api": patch
"@stratify/stratify-ui": patch
---

Patch to bump all package versions for deployment
- Remove Docker workflow as the GHCR push workflow will notify if image builds fail
- Execute changeset workflow after Build workflow