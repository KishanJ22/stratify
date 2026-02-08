---
"@stratify/stratify-ui": patch
---
- Add MarketDataTabs component to display tabs to view assets by top gainers, top losers and most active in a table
- Add MarketDataTable component to display a table of assets with details and change in price based on the selected tab
- Add hooks to fetch market data for top gainers, top losers and most active assets from the Fastify API
- Add Badge, Table and Tabs Shadcn components and adjust them to fit the design of the application
- Add Tanstack Data Table and customise it to support the required design and functionality for the market data table
- Add unit tests for MarketDataTabs, MarketDataTable and the hooks for fetching market data
- Change secondary and accent colour schemes to use different colours because the previous ones were too similar (shades of teal/turquoise) and it was hard to distinguish between them
