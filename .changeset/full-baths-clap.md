---
"@stratify/stratify-api": patch
---

Add type-safe fetch client to allow for calling the Python data api, add market data endpoints under /data/market to get top gainers, top losers and most active assets from the Python data api and retrieve asset details from the database for each asset, optimise insert-assets script by getting a list of countries once instead of querying it for every asset, add database migration to add a currency column to the assets table
