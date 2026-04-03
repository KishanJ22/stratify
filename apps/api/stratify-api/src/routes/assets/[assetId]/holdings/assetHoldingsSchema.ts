import { Static, Type } from "@sinclair/typebox";
import { createNotFound } from "../../../../utils/createNotFoundSchema.js";

export const assetHoldingsSchema = Type.Object({
    portfolioId: Type.Number(),
    shares: Type.Number(),
    totalBuyAmount: Type.Number(),
    totalBuyAmountAssetCurrency: Type.Union([Type.Number(), Type.Null()]),
    averagePricePerShare: Type.Number(),
    averagePricePerShareAssetCurrency: Type.Union([Type.Number(), Type.Null()]),
    currentValue: Type.Number(),
    currentValueAssetCurrency: Type.Union([Type.Number(), Type.Null()]),
    currentReturn: Type.Number(),
    currentReturnPercentage: Type.Number(),
});
export type AssetHolding = Static<typeof assetHoldingsSchema>;

export const assetHoldingsResponseSchema = Type.Object({
    data: Type.Array(assetHoldingsSchema),
});
export type AssetHoldingsResponse = Static<typeof assetHoldingsResponseSchema>;

export const assetHoldingsNotFoundSchema = createNotFound(
    "assetHoldingsNotFound",
);
export type AssetHoldingsNotFound = Static<typeof assetHoldingsNotFoundSchema>;
