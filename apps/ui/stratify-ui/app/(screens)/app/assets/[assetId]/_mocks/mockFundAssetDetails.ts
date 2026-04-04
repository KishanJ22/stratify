export const mockFundAssetDetails = {
    id: 2,
    name: "A fund",
    symbol: "FUND",
    countryId: 1,
    assetCurrency: "USD",
    assetType: "ETF",
    marketState: "REGULAR",
    industry: null,
    sector: [
        {
            sector: "technology",
            weight: 0.95,
        },
        {
            sector: "communications",
            weight: 0.02,
        },
        {
            sector: "energy",
            weight: 0.02,
        },
        {
            sector: "financial",
            weight: 0.01,
        },
    ],
    dayTradingActivity: {
        open: 448.0,
        close: 449.0,
        high: 452.0,
        low: 447.5,
        priceChange: 1.25,
        priceChangePercent: 0.28,
        tradingVolume: 1200000,
    },
};
