---
"@stratify/stratify-data-api": minor
---

- Build separate endpoints for getting asset details based on asset class:
  - /funds and /funds/{symbol} for getting details for index funds and ETFs
  - /cryptocurrencies and /cryptocurrencies/{symbol} for getting details for cryptocurrencies
- Build endpoints for getting top gainers, top losers and most active assets in the market
- Add endpoint for retrieving a list of industries
- Write unit tests for all new endpoints
- Update schema for stocks to remove unnecessary fields