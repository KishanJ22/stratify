import type { AssetHolding } from "../hooks/useAssetHoldings";

export const mockAssetHoldings = [
    {
        shares: 15,
        currentValue: 1664.4,
        currentValueAssetCurrency: 2280,
        averagePricePerShare: 100,
        averagePricePerShareAssetCurrency: 110,
        currentReturn: 164.4,
        currentReturnPercentage: 10.96,
        totalBuyAmount: 1500,
        totalBuyAmountAssetCurrency: 1650,
        portfolioId: 1,
    },
    {
        shares: 10,
        currentValue: 600,
        currentValueAssetCurrency: null,
        averagePricePerShare: 50,
        averagePricePerShareAssetCurrency: null,
        currentReturn: 100,
        currentReturnPercentage: 20,
        totalBuyAmount: 500,
        totalBuyAmountAssetCurrency: 500,
        portfolioId: 2,
    },
] satisfies AssetHolding[];
