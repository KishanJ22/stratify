import type { Investment } from "../InvestmentsTable";

export const mockInvestmentsData = [
    {
        assetId: 1,
        portfolioId: 1,
        portfolioName: "Test Portfolio",
        symbol: "LEON",
        assetCountryId: 224,
        assetCurrency: "USD",
        name: "Leonida Inc.",
        shares: 20,
        type: "STOCK",
        currentValue: 2219.2,
        currentAssetCurrencyValue: 3040,
        currentReturn: 1489.2,
        currentReturnPercentage: 204,
        totalBuyAmount: 730,
        sectorDetails: [
            {
                sector: "technology",
                weight: 1,
            },
        ],
    },
    {
        assetId: 2,
        portfolioId: 1,
        portfolioName: "Test Portfolio",
        symbol: "AAPL",
        assetCountryId: 224,
        assetCurrency: "USD",
        name: "Apple Inc.",
        shares: 10,
        type: "STOCK",
        currentValue: 1500,
        currentAssetCurrencyValue: 1500,
        currentReturn: -500,
        currentReturnPercentage: -25,
        totalBuyAmount: 2000,
        sectorDetails: [
            {
                sector: "technology",
                weight: 1,
            },
        ],
    },
] satisfies Investment[];
