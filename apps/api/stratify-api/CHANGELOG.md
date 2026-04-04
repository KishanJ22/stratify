# @stratify/stratify-api

## 0.8.0

### Minor Changes

- 4dd1f4d: - Build endpoint for getting the details for an asset
    - Build endpoint to get the current price for an asset
    - Build endpoint to get the price history for an asset
    - Build endpoint to get all of the investments or holdings for an asset across all of the portfolios a user has
    - Write unit tests for all asset endpoints

## 0.7.1

### Patch Changes

- efc59e2: - Build endpoint for simulating cost averaging and lump sum investing
    - Calculate the effect of cost averaging and lump sum investing over the same time period and with the same total investment amount
    - Return a list of the simulated portfolio values for both strategies over the investment duration
    - Return monetary and percentage returns for lump sum and cost averaging strategies at the end of the simulation period
    - Add unit tests for the cost averaging simulation endpoint

## 0.7.0

### Minor Changes

- 4c71566: - Build endpoint for simulating the compounding effect on an investment over time
    - Calculate the compounding effect for no compounding, compounding and compounding with dividends month by month over the duration of time period specified by the user
    - Return a list of the compounding effect for each month and the return for the entire time period for no compounding, compounding and compounding with dividends
    - Add unit tests for compounding simulator endpoint

## 0.6.1

### Patch Changes

- e1e53b9: Return ID of newly created portfolio instead of a success boolean flag

## 0.6.0

### Minor Changes

- beda630: Add portfolio name to the details returned for each investment to display it in the top performers table

## 0.5.0

### Minor Changes

- eb6ce36: - Build an endpoint to retrieve an overview of all portfolios, including:
    - Combined value of all portfolios
    - Combined change in value over multiple time periods (7 days, 30 days, 6 months, all time)
    - List of investments in each portfolio
    - Add unit tests for the endpoint

## 0.4.2

### Patch Changes

- b358225: - Change function for retrieving investments to retrieve the sector for each asset (or sectors and the weights for those sectors if it is a fund)
    - Organise functions and endpoint files related to individual portfolios into separate folders

## 0.4.1

### Patch Changes

- a7b236a: Docker image build fixes

## 0.4.0

### Minor Changes

- 4f62965: Build endpoint for retrieving the overall return and risk metrics, such as volatility and sortino ratio, for a portfolio
    - Add GBX currency to the currency seed script and handle currency conversion for assets in GBX
    - Replace function for getting the latest conversion rate for a currency pair with a function that retrieves the conversion rate from the database
    - Move reusable functions related to investments and portfolios to separate files for better organisation
    - Add function to calculate the variance for each asset in a portfolio and use it to calculate the portfolio variance (volatility) and downside variance for calculating the sortino ratio
    - Change the way that return is calculated for each investment in a portfolio to include realised and unrealised returns, which is used to calculate the overall return for a portfolio
    - Add unit tests for the portfolio metrics endpoint

## 0.3.1

### Patch Changes

- 6987199: - Build endpoint to retrieve the value history of a portfolio from the oldest trade up to now
    - Implement a function to get the current conversion rate of a currency pair (between the asset currency and the user's currency)

## 0.3.0

### Minor Changes

- eaaee1a: - Add endpoint for adding a trade to a portfolio (or a new investment)
    - Add endpoint for getting the price of an asset on a specific date
    - Add endpoint for getting the exchange rate on a specific date
    - Add publicly accessible endpoint for retrieving a list of currencies so that the user can select a preferred currency upon signup
    - Add unit tests for the new endpoints built
    - Add testing utility function to create a JWT token for a user to be used in testing instead of hardcoding tokens in test files
    - Add database migration to replace composite primary key for assets table with an auto-incrementing id to ensure that a unique record is created for each asset based on the asset symbol, type and country ID
    - Replace currency exchange rate query with one where only the latest exchange rate is returned (instead of the exchange rate at the point in time specified)
    - Fix bug in fetching the current price of an asset if the asset is based in the UK

## 0.2.23

### Patch Changes

- 744ea0d: - Build endpoint to retrieve the investments in a portfolio
    - Add unit tests for the endpoint
    - Add migration to change the primary key for the trades table to an auto-incrementing number instead of a composite key made up of the asset symbol, trade date and portfolio id
    - Add column to store the total amount of a trade in the currency of the asset in the trades table

## 0.2.22

### Patch Changes

- 8517d3e: Fix workflow syntax and perform changeset update after build is completed

## 0.2.21

### Patch Changes

- f548b43: Reorganise execution of workflows when merging with main and run deployments on self-hosted runner

## 0.2.20

### Patch Changes

- 22e2233: Version bump

## 0.2.19

### Patch Changes

- 5de6212: Version bump (again)

## 0.2.18

### Patch Changes

- aa0bef8: Version bump

## 0.2.17

### Patch Changes

- bf82194: Version bump

## 0.2.16

### Patch Changes

- aee4058: Version bump for all packages to create the first release
    - Change in stratify-data-api to only generate an openapi spec when running locally

## 0.2.15

### Patch Changes

- bce7cdd: Update allowed/trusted origins list and only send access control headers on preflight (OPTIONS) requests to fix CORS issues on deployed environments

## 0.2.14

### Patch Changes

- 678e1b4: Write Dockerfile to prepare apps for deployment

## 0.2.13

### Patch Changes

- 234d9d1: - Build endpoint to allow users to search for assets by asset name or asset symbol
    - Fix issue where an unreadable name would be used as the asset name for assets that start with "ORD", use issuer name instead

## 0.2.12

### Patch Changes

- 6918c44: - Add type-safe fetch client to make calls to the Python data api
    - Add market data endpoints under /data/market to get lists of top gainers, top losers and most active assets from the Python data api
    - Add unit tests for the market data endpoints with mocked responses from the data api
        - Retrieve asset details for each asset from the database to return in the response
    - Optimise insert-assets script by querying the database for a list of countries once instead of querying it for every asset
    - Add database migration to add a currency column to the assets table
    - Change update-asset-details script to update the currency column for each asset based on the data parsed from files

## 0.2.11

### Patch Changes

- 83cb818: Add script to process asset details from CSV text files and an Excel spreadsheet to update Asset records in the database with the correct name and asset type (Stock, ETF, Cryptocurrency).

## 0.2.10

### Patch Changes

- 4a876f8: - Add endpoint to get a list of portfolios that a user has
    - Add tests for this new endpoint
    - Fix vitest testing configuration to not run tests parallel as they interfere with each other

## 0.2.9

### Patch Changes

- 4fa5a1a: - Add endpoint to create a portfolio (POST /portfolios)
    - Check if the user already has a portfolio with the same name (after normalising to lowercase) and return a 400 status with an error code if it is
    - Update migration schemas for portfolios table to ensure that the portfolio id is auto-generated
    - Add tests for the create portfolio endpoint to cover all scenarios:
        - Returns 200 status code if portfolio created successfully
        - Returns 400 status code if portfolio name already exists for the user
        - Allows the same user to create multiple portfolios with different names
        - Allows different users to create portfolios with the same name
    - Update jwt decoder to get the correct user id from the token payload
    - Update jwt decoder to allow for using Dev JWT tokens as long as they are not in the production environment
    - Replace usage of sleep when spinning up the test database with a programmatic health check to ensure the database is ready before running tests (thanks to Windows not having sleep)
    - Add test setup file to clear the database before each test to ensure equality between tests

## 0.2.8

### Patch Changes

- f024937: AB#162 - Implement containerized database for testing to allow for doing tests with a database that is "real"
    - Created Docker compose file to run a local Postgres database for testing
    - Added scripts to package.json to start, initialise and stop the database
    - Updated test scripts to use the Docker db when running tests
    - Added test setup to remove data from tables between tests to ensure a clean state

## 0.2.7

### Patch Changes

- 9bc9a27: Add migrations to create tables for storing portfolios and trades

## 0.2.6

### Patch Changes

- e9437aa: Update dependencies and eslint config

## 0.2.5

### Patch Changes

- 1a285f2: - Add plugin to do an auth check when a request is made to a protected route (any route other than the auth routes, /health and root)
    - Store user details in context for each request that requires authentication
    - Log user details if available in context
    - Build placeholder route for getting stock ticker data to test auth

## 0.2.4

### Patch Changes

- 8cb02cf: Better auth configuration changes
    - Temporarily remove email verification on sign-up (to be re-enabled when Resend is setup for sending emails)
    - Enable cookie cache and add a time until a session can be considered stale

## 0.2.3

### Patch Changes

- 6951567: - Add seed scripts for writing country and currency data to the database
    - Update column names in the countries table
    - Update primary key constraint in the assets and asset prices tables to include the country id for an asset
    - Add script to insert asset data concurrently from the asset files outputted by the Python pricing ingestor

## 0.2.2

### Patch Changes

- d68a71e: Create migrations for asset_prices and currencies tables

## 0.2.1

### Patch Changes

- 8f979ac: Fix date formatting in db migration file generator

## 0.2.0

### Minor Changes

- 9d4ddbe: - Add authentication with BetterAuth
    - Add utility to send emails
    - Update request context to include user details if an auth token is present

## 0.1.0

### Minor Changes

- b9af29d: Initial setup for Fastify API
  Includes:
    - Logging
    - Database setup
    - Initial database migrations
