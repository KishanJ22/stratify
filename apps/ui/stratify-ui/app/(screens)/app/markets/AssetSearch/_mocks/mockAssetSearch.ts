import { SearchAsset } from "../useAssetSearch";

export const mockSearchAsset = {
    id: 1,
    name: "Apple Inc.",
    symbol: "AAPL",
    assetType: "STOCK",
    currentPrice: 150.25,
    priceChangePercent: 1.5,
    priceChange: 2.25,
    currency: "USD",
} satisfies SearchAsset;
