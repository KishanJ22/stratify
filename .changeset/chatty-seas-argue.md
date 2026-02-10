---
"@stratify/stratify-ui": patch
---

- Build AssetSearch component which displays a button that opens a popover with a search input and a list of assets as the user types
- Add useAssetSearch hook to call the API with the search query (delayed by 500ms to avoid making too many requests) and return the list of assets
- Write unit tests for AssetSearch component and useAssetSearch hook
- Add Popover, Command and Combobox shadcn components to the components library
- Move AssetBadge to components folder as it is used in multiple places and move style and label mappings for asset types and market states to the same file as the badge component
