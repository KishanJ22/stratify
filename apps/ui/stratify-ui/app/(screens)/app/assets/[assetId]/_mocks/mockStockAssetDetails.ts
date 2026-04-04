import type { AssetDetails } from "../hooks/useAssetDetails";

export const mockStockAssetDetails = {
    id: 1,
    name: "Apple Inc.",
    symbol: "AAPL",
    countryId: 1,
    assetCurrency: "USD",
    assetType: "STOCK",
    marketState: "REGULAR",
    industry: "Consumer Electronics",
    sector: [
        {
            sector: "technology",
            weight: 1,
        },
    ],
    dayTradingActivity: {
        open: 149.0,
        close: 150.0,
        high: 151.0,
        low: 148.75,
        priceChange: 1.75,
        priceChangePercent: 1.18,
        tradingVolume: 75000000,
    },
} satisfies AssetDetails;
