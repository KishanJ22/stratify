# @stratify/stratify-ui

## 0.12.1

### Patch Changes

- b508315: Fix goal not being visible when there is no total value (user has no portfolio or investments)

## 0.12.0

### Minor Changes

- 73f3edb: Build features page and add translations for landing page

## 0.11.1

### Patch Changes

- 143d634: - Fix number inputs in compounding and cost-averaging simulator forms so they are empty strings by default
    - Change fee field in add trade and add investment modals to default to empty string instead of 0 and pass validation as an empty string (blank is treated as 0)
    - Format subtotal, asset currency subtotal, fee and total values in add trade and add investment modals to display numeric values correctly

## 0.11.0

### Minor Changes

- 3571a3b: - Build goal progression card and modal to set a goal
    - If the user has not set a goal, then the user is informed that no goal has been set and is allowed to set a goal by clicking the "Set" button, which opens a modal to set a goal
    - If the user has already set a goal, then the user is shown the current goal and can edit the goal by clicking the "Edit" button, which opens a modal to edit the goal, identical to what is done above
    - If the total value of all of the user's portfolios is greater than the target goal amount, then the user is shown a green progress bar and text telling them that they have reached their goal and the target amount
    - Add unit tests for goal progression card, set goal modal and api hooks

### Patch Changes

- Updated dependencies [3571a3b]
    - @stratify/stratify-api@0.9.0

## 0.10.7

### Patch Changes

- f8e7997: Fix asset name field being set to undefined (undefined) when selecting an asset in the add investment modal

## 0.10.6

### Patch Changes

- e5ea872: - Add translations with next-intl
    - Use translated country and sector names in asset allocation chart and asset details card
    - Use translated values on dashboard page
    - Fix asset count in asset allocation chart

## 0.10.5

### Patch Changes

- d5745d3: - Only show the top 5 performing investments in the top performers table
    - Modify return schema to return either a number or null for absolute and percentage values
    - Display placeholder value change label if the percentage change is null
    - Add unit test to ensure that the placeholder value change label is displayed when the percentage change is null
- Updated dependencies [d5745d3]
    - @stratify/stratify-api@0.8.4

## 0.10.4

### Patch Changes

- 76c7df8: - Change the label displayed in the placeholder rows for the top performers table when the user has no portfolios, no investments in any portfolio or no investments with positive returns

## 0.10.3

### Patch Changes

- 347ed78: - Add content to tooltips on the portfolios page, including a table breaking down how the risk label is determined
    - Fix formatting of numeric values in tables
- Updated dependencies [347ed78]
    - @stratify/stratify-api@0.8.3

## 0.10.2

### Patch Changes

- d630257: Patch to bump all package versions for deployment
    - Remove Docker workflow as the GHCR push workflow will notify if image builds fail
    - Execute changeset workflow after Build workflow
- Updated dependencies [d630257]
    - @stratify/stratify-api@0.8.2

## 0.10.1

### Patch Changes

- 0ac2ee9: Update dependencies
- Updated dependencies [0ac2ee9]
    - @stratify/stratify-api@0.8.1

## 0.10.0

### Minor Changes

- 5fd2aa1: Retrieve client-side environment variables at runtime using next-public-env and use it in all layouts
    - Allows for dynamically configuring the app without needing to rebuild the Docker image
    - Significantly speeds up the CI/CD pipeline by eliminating the need to build and push a new image for each environment as client-side env variables are injected at runtime instead of build time

## 0.9.0

### Minor Changes

- c8fffe8: - Add functionality to click on the avatar icon in the navbar to open a menu showing the user's username and a logout button
    - Fix unnecessary ability to scroll on pages that don't need scrolling

## 0.8.0

### Minor Changes

- 4dd1f4d: - Build asset details page
    - Build chart to show the price history for an asset, with the current price and a dropdown to select the date range for the price history, similar to the one on the portfolio page
    - Build card to show the details for an asset, including the asset type, market state, country, industry and sector(s)
    - Build modal to display the sectors and their weightings for a fund asset
    - Build card to show the current holdings for an asset across all of the portfolios a user has
    - Build card to add an asset to a portfolio (reusing the portfolio selector component), which shows either the current holdings for the asset in the selected portfolio or a message that the asset isn't currently in the portfolio. It also has a button to add an investment for the asset to the portfolio (which opens the add investment modal) if the asset isn't currently in the portfolio, or add a trade for the asset to the portfolio (which opens the add trade modal) if the asset is in the portfolio
    - Add functionality to name labels for assets in market data tables, investment tables and asset search results to direct to the asset details page by assetId when clicked
    - Update add investment modal to take an optional preselected asset, which is only used when adding an asset from the asset details page
    - Add unit tests for all new components and functionality on the asset details page

### Patch Changes

- Updated dependencies [4dd1f4d]
    - @stratify/stratify-api@0.8.0

## 0.7.1

### Patch Changes

- efc59e2: - Build page for learning about cost averaging
    - Add simulator to compare cost averaging and lump sum investing strategies
    - Display the portfolio values for both strategies over the investment duration
    - Add unit tests for compounding simulator and cost averaging page
    - Display card beneath the chart, similar to how it is done on the compounding page, to show the return for the entire period for both strategies
- Updated dependencies [efc59e2]
    - @stratify/stratify-api@0.7.1

## 0.7.0

### Minor Changes

- 4c71566: - Build page to learn compounding
    - Add compounding simulator to see the compounding effect on an investment over time
    - Display the compounding effect in an area chart that compares no compounding, compounding and compounding with dividends
    - Add unit tests for compounding simulator and page to learn compounding
    - Display a card beneath the chart to show the return for the entire time period for no compounding, compounding and compounding with dividends

### Patch Changes

- Updated dependencies [4c71566]
    - @stratify/stratify-api@0.7.0

## 0.6.2

### Patch Changes

- e1e53b9: - Fix bug where selected portfolio id is overridden when navigating to the portfolios page from the top performers table for the first time
    - Change functionality on successfully creating a portfolio to set the selected portfolio id to the newly created portfolio
- Updated dependencies [e1e53b9]
    - @stratify/stratify-api@0.6.1

## 0.6.1

### Patch Changes

- 5f48a08: - Build Learn page
    - Build Learn Card to display a title and short description of a learning guide and a clickable button to navigate to the guide
    - Display Learn cards on the Learn page
    - Add unit tests for Learn Card and learn page
    - Add unit tests for asset name card component displayed when searching for an asset to add to a portfolio

## 0.6.0

### Minor Changes

- beda630: - Build component and table to display the top five performing assets in all portfolios a user has (AB#309)
    - Displays the asset name, the name of the portfolio it is in, the current value of the investment, the return as a percentage and in the user's currency, and a link to view the portfolio the investment is in
    - Build component to display the asset diversification across all portfolios a user has (AB#311)
        - Displayed in a pie chart similar to the one on the portfolio page but uses current investments across all portfolios instead of just one portfolio
    - Add unit tests for the new components
    - Change button design for toggling between pie chart and legend for the asset allocation chart to look more minimal

### Patch Changes

- Updated dependencies [beda630]
    - @stratify/stratify-api@0.6.0

## 0.5.0

### Minor Changes

- eb6ce36: - Build key performance cards to display on the Dashboard page showing:
    - The total value of all portfolios
    - The change in value over the last 30 days, last 6 months and all time
    - Add unit tests for the components
    - Handle case where a user does not have a portfolio, where a link is shown to redirect them to the portfolios page to create their first portfolio
    - Handle case where a user has a portfolio but no investments, where a link is shown to redirect them to the portfolios page
    - Add loading states for the cards when data is being fetched
    - Add placeholder component for goal progression, which will be implemented in the future
    - Add unit tests for the Dashboard page and its components
    - Organise components for Dashboard and Portfolios pages into a components folder for each page to improve readability and maintainability

### Patch Changes

- Updated dependencies [eb6ce36]
    - @stratify/stratify-api@0.5.0

## 0.4.0

### Minor Changes

- b358225: - Build component for displaying the asset allocation for a portfolio within a pie chart
    - Allow for grouping assets by asset class, sector or country in the pie chart
    - Display a tooltip when hovering over a sector in the pie chart to display information relevant to that sector based on the grouping
    - Display a legend in place of the pie chart through a toggle to show which colours correspond to which sectors in the pie chart
    - Add unit tests for the asset allocation component
    - Change the layout of the portfolio page to display the asset allocation component in line with the overall return and overall risk cards

### Patch Changes

- Updated dependencies [b358225]
    - @stratify/stratify-api@0.4.2

## 0.3.2

### Patch Changes

- a7b236a: Docker image build fixes
- Updated dependencies [a7b236a]
    - @stratify/stratify-api@0.4.1

## 0.3.1

### Patch Changes

- a4a8990: Fix failing docker image build

## 0.3.0

### Minor Changes

- 4f62965: - Build components to display the overall return and risk for a portfolio
    - Add unit tests for the portfolio metrics components
    - Fix bug where fields in the modals for adding an investment and trade are not cleared after submitting or exiting the modal
    - Fix bug where the modals for adding an investment and trade do not handle assets in GBX currency correctly
    - Ensure that the return for each investment is displayed even if the investment has no current holdings as the return includes realised and unrealised returns

### Patch Changes

- Updated dependencies [4f62965]
    - @stratify/stratify-api@0.4.0

## 0.2.1

### Patch Changes

- 6987199: - Build a dynamic and modern chart for displaying the value of a portfolio from the oldest trade up to now
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
- Updated dependencies [6987199]
    - @stratify/stratify-api@0.3.1

## 0.2.0

### Minor Changes

- eaaee1a: - Build form for adding an investment to a portfolio within a modal
    - Build a similar form for adding a trade to an existing investment for the portfolio within a modal
    - Add unit tests for the new components
    - Add mock session provider to be used when testing components that use session details (like the user's currency)
    - Build reusable hooks for fetching the current price of an asset or currency exchange rate
    - Update investments table to add functionality to the "Add Trade" button for each investment so that it opens the modal for adding a trade specifically for that investment

### Patch Changes

- Updated dependencies [eaaee1a]
    - @stratify/stratify-api@0.3.0

## 0.1.24

### Patch Changes

- 744ea0d: - Build data table to display the investments in a portfolio
    - Add unit tests for the investments table
    - Improve data table with pagination
    - Set selected portfolio to the first portfolio in the list when the user navigates to the portfolios page
- Updated dependencies [744ea0d]
    - @stratify/stratify-api@0.2.23

## 0.1.23

### Patch Changes

- 8517d3e: Fix workflow syntax and perform changeset update after build is completed
- Updated dependencies [8517d3e]
    - @stratify/stratify-api@0.2.22

## 0.1.22

### Patch Changes

- f548b43: Reorganise execution of workflows when merging with main and run deployments on self-hosted runner
- Updated dependencies [f548b43]
    - @stratify/stratify-api@0.2.21

## 0.1.21

### Patch Changes

- 22e2233: Version bump
- Updated dependencies [22e2233]
    - @stratify/stratify-api@0.2.20

## 0.1.20

### Patch Changes

- 5de6212: Version bump (again)
- Updated dependencies [5de6212]
    - @stratify/stratify-api@0.2.19

## 0.1.19

### Patch Changes

- aa0bef8: Version bump
- Updated dependencies [aa0bef8]
    - @stratify/stratify-api@0.2.18

## 0.1.18

### Patch Changes

- bf82194: Version bump
- Updated dependencies [bf82194]
    - @stratify/stratify-api@0.2.17

## 0.1.17

### Patch Changes

- aee4058: Version bump for all packages to create the first release
    - Change in stratify-data-api to only generate an openapi spec when running locally
- Updated dependencies [aee4058]
    - @stratify/stratify-api@0.2.16

## 0.1.16

### Patch Changes

- 364dabd: Fix login box not being displayed correctly on Google Chrome and change secondary colour scheme

## 0.1.15

### Patch Changes

- 2b1bc92: Fix CORS headers not being set as response headers in middleware

## 0.1.14

### Patch Changes

- bce7cdd: Update allowed/trusted origins list and only send access control headers on preflight (OPTIONS) requests to fix CORS issues on deployed environments
- Updated dependencies [bce7cdd]
    - @stratify/stratify-api@0.2.15

## 0.1.13

### Patch Changes

- 678e1b4: Write Dockerfile to prepare app for deployment and add minor fixes to colours used on landing page and auth pages
- Updated dependencies [678e1b4]
    - @stratify/stratify-api@0.2.14

## 0.1.12

### Patch Changes

- 234d9d1: - Build AssetSearch component which displays a button that opens a popover with a search input and a list of assets as the user types
    - Add useAssetSearch hook to call the API with the search query (delayed by 500ms to avoid making too many requests) and return the list of assets
    - Write unit tests for AssetSearch component and useAssetSearch hook
    - Add Popover, Command and Combobox shadcn components to the components library
    - Move AssetBadge to components folder as it is used in multiple places and move style and label mappings for asset types and market states to the same file as the badge component
- Updated dependencies [234d9d1]
    - @stratify/stratify-api@0.2.13

## 0.1.11

### Patch Changes

- 6918c44: - Add MarketDataTabs component to display tabs to view assets by top gainers, top losers and most active in a table
    - Add MarketDataTable component to display a table of assets with details and change in price based on the selected tab
    - Add hooks to fetch market data for top gainers, top losers and most active assets from the Fastify API
    - Add Badge, Table and Tabs Shadcn components and adjust them to fit the design of the application
    - Add Tanstack Data Table and customise it to support the required design and functionality for the market data table
    - Add unit tests for MarketDataTabs, MarketDataTable and the hooks for fetching market data
    - Change secondary and accent colour schemes to use different colours because the previous ones were too similar (shades of teal/turquoise) and it was hard to distinguish between them
- Updated dependencies [6918c44]
    - @stratify/stratify-api@0.2.12

## 0.1.10

### Patch Changes

- Updated dependencies [83cb818]
    - @stratify/stratify-api@0.2.11

## 0.1.9

### Patch Changes

- 4a876f8: - Build PortfolioSelector select dropdown that allows for viewing and selecting a portfolio
    - Add usePortfolioList hook to fetch list of portfolios for the user
    - Add tests for PortfolioSelector component and usePortfolioList hook
- Updated dependencies [4a876f8]
    - @stratify/stratify-api@0.2.10

## 0.1.8

### Patch Changes

- 4fa5a1a: - Add Portfolios screen and functionality for a user to create a portfolio
    - Add modal "dialog" component with a form to create a portfolio with a name
    - Add mutation hook to create a portfolio via the API with error handling (if portfolio name already exists for a portfolio the user has)
    - Add unit tests for the create portfolio modal, create portfolio hook and button triggering the modal
    - Add fetch client with type safety using an OpenAPI spec generated by the backend
    - Fix cross-origin issue where the UI wouldn't pass through the JWT access token to a request made to the API
    - Change auth handling in the UI to store the JWT access token in cookies so that it can be added to a request by the proxy middleware as it runs on the server side
    - Change text input form component to allow for passing in a classname for the input component to allow for more styling flexibility
- Updated dependencies [4fa5a1a]
    - @stratify/stratify-api@0.2.9

## 0.1.7

### Patch Changes

- e9437aa: Update dependencies and eslint config

## 0.1.6

### Patch Changes

- 1a285f2: - Add "App" route group for containing pages that are displayed when a user is logged in
    - Build session provider for loading a session, providing user details to the portal and handling logout
    - Add "Public" route group for containing pages that are displayed when a user isn't logged in
    - Build avatar component for displaying the logged in user's initials
    - Redirect to login page if user is not authenticated when accessing logged in routes
    - Display toast notification when the session expires or user logs out

## 0.1.5

### Patch Changes

- cc6b2af: - Build login page
    - Move submit handler for the sign up form to a separate file to allow for unit tests to be written for it
    - Add unit tests for login page, login form and submit handler
    - Add unit tests for the submit handler used in the sign up form
    - Rename unauthenticated route group (for public-facing pages) to "public"

## 0.1.4

### Patch Changes

- 8cb02cf: - Add route group for authentication pages (auth)
    - Move landing page to a route group for pages that don't require a user to be signed in (unauthenticated)
    - Build form for sign up page
    - Use better auth client to make it fully functional
    - Add unit tests for the sign up page
    - Build reusable components that can be used in forms

## 0.1.3

### Patch Changes

- acea05b: ## Additions
    - Build landing page
    - Build navigation bar
        - Includes Brand text and logo
        - Includes Sign up and login buttons
    - Add unit tests for landing page and navigation bar
    - Update configuration for Tailwind CSS to allow for accessing colours properly from globals.css

    ## Fixes
    - Fix "/api" not being removed from URL after being processed by the middleware

## 0.1.2

### Patch Changes

- 8ca64c4: - Add hook for creating an instance for handling authentication with Better Auth
    - Add middleware layer for proxying requests to the correct APIs based on the path name in the request URL
    - Add environment provider so that the proxy URLs for accessing APIs are accessible by a client

## 0.1.1

### Patch Changes

- 85c2478: Setup nextjs and add tailwind css config
