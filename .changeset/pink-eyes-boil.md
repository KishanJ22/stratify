---
"@stratify/stratify-api": patch
---

- Add endpoint to create a portfolio (POST /portfolios)
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

