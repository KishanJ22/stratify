import type { AssetDetails } from "../hooks/useAssetDetails";

export const mockCryptocurrencyAssetDetails = {
    id: 3,
    name: "Bitcoin",
    symbol: "BTC",
    countryId: 224,
    assetCurrency: "USD",
    assetType: "CRYPTOCURRENCY",
    marketState: "REGULAR",
    industry: null,
    sector: null,
    dayTradingActivity: {
        open: 44000,
        close: 44500,
        high: 46000,
        low: 43000,
        priceChange: 500,
        priceChangePercent: 1.12,
        tradingVolume: 35000,
    },
} satisfies AssetDetails;
