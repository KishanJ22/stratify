---
"@stratify/stratify-ui": minor
---

- Build component and table to display the top five performing assets in all portfolios a user has (AB#309)
  - Displays the asset name, the name of the portfolio it is in, the current value of the investment, the return as a percentage and in the user's currency, and a link to view the portfolio the investment is in
- Build component to display the asset diversification across all portfolios a user has (AB#311)
  - Displayed in a pie chart similar to the one on the portfolio page but uses current investments across all portfolios instead of just one portfolio
- Add unit tests for the new components
- Change button design for toggling between pie chart and legend for the asset allocation chart to look more minimal