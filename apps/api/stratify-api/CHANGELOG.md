# @stratify/stratify-api

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
