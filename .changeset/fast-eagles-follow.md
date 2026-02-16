---
"@stratify/stratify-api": patch
---

- Build endpoint to retrieve the investments in a portfolio
- Add unit tests for the endpoint
- Add migration to change the primary key for the trades table to an auto-incrementing number instead of a composite key made up of the asset symbol, trade date and portfolio id
- Add column to store the total amount of a trade in the currency of the asset in the trades table