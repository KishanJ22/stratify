---
"@stratify/stratify-ui": patch
---

- Fix number inputs in compounding and cost-averaging simulator forms so they are empty strings by default
- Change fee field in add trade and add investment modals to default to empty string instead of 0 and pass validation as an empty string (blank is treated as 0)
- Format subtotal, asset currency subtotal, fee and total values in add trade and add investment modals to display numeric values correctly