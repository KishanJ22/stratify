---
"@stratify/stratify-ui": patch
---

- Build a dynamic and modern chart for displaying the value of a portfolio from the oldest trade up to now
- Add a dropdown selector for selecting the date range to display the chart for, with the following options:
  - 7 days
  - 30 days
  - 6 months
  - 1 year
  - All time
- Display a placeholder chart when there are no trades in the portfolio
- Display a loading state for the chart when data is being fetched
- Display the increase/decrease in portfolio value over the selected date range
- Display a tooltip with the portfolio value on a specific date when hovering over a point on the chart