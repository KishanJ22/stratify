---
"@stratify/stratify-ui": minor
---

- Build asset details page
- Build chart to show the price history for an asset, with the current price and a dropdown to select the date range for the price history, similar to the one on the portfolio page
- Build card to show the details for an asset, including the asset type, market state, country, industry and sector(s)
- Build modal to display the sectors and their weightings for a fund asset
- Build card to show the current holdings for an asset across all of the portfolios a user has
- Build card to add an asset to a portfolio (reusing the portfolio selector component), which shows either the current holdings for the asset in the selected portfolio or a message that the asset isn't currently in the portfolio. It also has a button to add an investment for the asset to the portfolio (which opens the add investment modal) if the asset isn't currently in the portfolio, or add a trade for the asset to the portfolio (which opens the add trade modal) if the asset is in the portfolio
- Add functionality to name labels for assets in market data tables, investment tables and asset search results to direct to the asset details page by assetId when clicked
- Update add investment modal to take an optional preselected asset, which is only used when adding an asset from the asset details page
- Add unit tests for all new components and functionality on the asset details page
