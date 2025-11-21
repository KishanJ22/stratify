# @stratify/stratify-api

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
