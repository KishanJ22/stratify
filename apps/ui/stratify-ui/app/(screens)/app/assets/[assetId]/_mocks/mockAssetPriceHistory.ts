import { AssetPriceHistory } from "../hooks/useAssetPriceHistory";

export const mockAssetPriceHistory = [
    {
        date: "2026-01-01",
        priceDetails: {
            open: 100,
            close: 110,
            high: 115,
            low: 95,
        },
    },
] satisfies AssetPriceHistory[];
