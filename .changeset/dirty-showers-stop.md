---
"@stratify/stratify-api": patch
---

- Add seed scripts for writing country and currency data to the database
- Update column names in the countries table
- Update primary key constraint in the assets and asset prices tables to include the country id for an asset
- Add script to insert asset data concurrently from the asset files outputted by the Python pricing ingestor