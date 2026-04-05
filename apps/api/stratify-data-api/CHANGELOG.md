# stratify-data-api

## 0.5.1

### Patch Changes

- 0ac2ee9: Update dependencies

## 0.5.0

### Minor Changes

- f9fa32d: - Use yahoo query package to get top ETFs and cryptocurrencies for the top gainers, top losers and most active market data endpoints
    - Update market data unit tests to mock the data returned from query functions that use yahoo query

## 0.4.0

### Minor Changes

- b358225: Change fund endpoints to retrieve the sector weights for the assets held in each fund and add mappings to ensure that the sector names are consistent between funds and stocks

## 0.3.12

### Patch Changes

- eaaee1a: Modify asset price ingestor to set the type of each asset based on the filepath

## 0.3.11

### Patch Changes

- 744ea0d: Update openapi spec

## 0.3.10

### Patch Changes

- 8517d3e: Fix workflow syntax and perform changeset update after build is completed

## 0.3.9

### Patch Changes

- f548b43: Reorganise execution of workflows when merging with main and run deployments on self-hosted runner

## 0.3.8

### Patch Changes

- 22e2233: Version bump

## 0.3.7

### Patch Changes

- 5de6212: Version bump (again)

## 0.3.6

### Patch Changes

- aa0bef8: Version bump

## 0.3.5

### Patch Changes

- bf82194: Version bump

## 0.3.4

### Patch Changes

- aee4058: Version bump for all packages to create the first release
    - Change in stratify-data-api to only generate an openapi spec when running locally

## 0.3.3

### Patch Changes

- 678e1b4: Write Dockerfile to prepare apps for deployment

## 0.3.2

### Patch Changes

- 234d9d1: Add endpoint to retrieve the current price for an asset

## 0.3.1

### Patch Changes

- 6918c44: - Change format of data returned in market endpoints to avoid returning unnecessary data
    - Add minimumVolume parameter to percentage change query to filter out assets that have low trading volume

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
