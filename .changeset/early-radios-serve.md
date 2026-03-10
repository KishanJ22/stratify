---
"@stratify/stratify-api": minor
---

Build endpoint for retrieving the overall return and risk metrics, such as volatility and sortino ratio, for a portfolio
- Add GBX currency to the currency seed script and handle currency conversion for assets in GBX
- Replace function for getting the latest conversion rate for a currency pair with a function that retrieves the conversion rate from the database
- Move reusable functions related to investments and portfolios to separate files for better organisation
- Add function to calculate the variance for each asset in a portfolio and use it to calculate the portfolio variance (volatility) and downside variance for calculating the sortino ratio
- Change the way that return is calculated for each investment in a portfolio to include realised and unrealised returns, which is used to calculate the overall return for a portfolio
- Add unit tests for the portfolio metrics endpoint