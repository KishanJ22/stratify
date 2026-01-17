---
"@stratify/stratify-api": patch
---

AB#162 - Implement containerized database for testing to allow for doing tests with a database that is "real"
- Created Docker compose file to run a local Postgres database for testing
- Added scripts to package.json to start, initialise and stop the database
- Updated test scripts to use the Docker db when running tests
- Added test setup to remove data from tables between tests to ensure a clean state