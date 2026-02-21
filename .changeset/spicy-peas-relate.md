---
"@stratify/stratify-api": minor
---

- Add endpoint for adding a trade to a portfolio (or a new investment)
- Add endpoint for getting the price of an asset on a specific date
- Add endpoint for getting the exchange rate on a specific date
- Add publicly accessible endpoint for retrieving a list of currencies so that the user can select a preferred currency upon signup
- Add unit tests for the new endpoints built
- Add testing utility function to create a JWT token for a user to be used in testing instead of hardcoding tokens in test files
- Add database migration to replace composite primary key for assets table with an auto-incrementing id to ensure that a unique record is created for each asset based on the asset symbol, type and country ID
- Replace currency exchange rate query with one where only the latest exchange rate is returned (instead of the exchange rate at the point in time specified)
- Fix bug in fetching the current price of an asset if the asset is based in the UK
