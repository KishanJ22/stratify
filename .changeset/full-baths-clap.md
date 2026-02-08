---
"@stratify/stratify-api": patch
---

- Add type-safe fetch client to make calls to the Python data api
- Add market data endpoints under /data/market to get lists of top gainers, top losers and most active assets from the Python data api
- Add unit tests for the market data endpoints with mocked responses from the data api
  - Retrieve asset details for each asset from the database to return in the response
- Optimise insert-assets script by querying the database for a list of countries once instead of querying it for every asset
- Add database migration to add a currency column to the assets table
- Change update-asset-details script to update the currency column for each asset based on the data parsed from files