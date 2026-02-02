# stratify-data-api

## 0.3.0

### Minor Changes

- dd58b9e: - Build separate endpoints for getting asset details based on asset class:
    - /funds and /funds/{symbol} for getting details for index funds and ETFs
    - /cryptocurrencies and /cryptocurrencies/{symbol} for getting details for cryptocurrencies
    - Build endpoints for getting top gainers, top losers and most active assets in the market
    - Add endpoint for retrieving a list of industries
    - Write unit tests for all new endpoints
    - Update schema for stocks to remove unnecessary fields

## 0.2.3

### Patch Changes

- 6951567: Refactor pricing ingestor to process and validate the data before writing it to a json file

## 0.2.2

### Patch Changes

- d68a71e: Enhance data validation process in pricing ingestor

## 0.2.1

### Patch Changes

- b9af29d: Change the ports the API runs on in dev and prod mode

## 0.2.0

### Minor Changes

- 079c353: Build REST API in Python for accessing stock market data through the yfinance library and historic stock pricing data.
