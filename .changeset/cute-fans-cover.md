---
"@stratify/stratify-api": patch
"@stratify/stratify-ui": patch
---

- Only show the top 5 performing investments in the top performers table
- Modify return schema to return either a number or null for absolute and percentage values
- Display placeholder value change label if the percentage change is null
- Add unit test to ensure that the placeholder value change label is displayed when the percentage change is null