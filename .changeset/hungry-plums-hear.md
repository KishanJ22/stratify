---
"@stratify/stratify-ui": minor
---

- Build key performance cards to display on the Dashboard page showing:
  - The total value of all portfolios
  - The change in value over the last 30 days, last 6 months and all time
- Add unit tests for the components
- Handle case where a user does not have a portfolio, where a link is shown to redirect them to the portfolios page to create their first portfolio
- Handle case where a user has a portfolio but no investments, where a link is shown to redirect them to the portfolios page
- Add loading states for the cards when data is being fetched
- Add placeholder component for goal progression, which will be implemented in the future
- Add unit tests for the Dashboard page and its components
- Organise components for Dashboard and Portfolios pages into a components folder for each page to improve readability and maintainability