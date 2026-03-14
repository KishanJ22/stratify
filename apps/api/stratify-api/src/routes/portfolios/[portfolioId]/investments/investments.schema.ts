import { Type, Static } from "@sinclair/typebox";
import { createNotFound } from "../../../../utils/createNotFoundSchema.js";
import { assetTypeSchema } from "../../../../schemas/common-schemas.js";

export const portfolioIdParamSchema = Type.Object({
    portfolioId: Type.Number(),
});
export type PortfolioIdParam = Static<typeof portfolioIdParamSchema>;

const sectorDetails = Type.Object({
    sector: Type.String(),
    weight: Type.Number(),
});

export type SectorDetails = Static<typeof sectorDetails>;

export const investmentSchema = Type.Object({
    assetId: Type.Number(),
    symbol: Type.String(),
    assetCountryId: Type.Number(),
    name: Type.String(),
    type: assetTypeSchema,
    assetCurrency: Type.Union([Type.String(), Type.Null()]),
    shares: Type.Number(),
    totalBuyAmount: Type.Number(),
    currentValue: Type.Number(),
    currentAssetCurrencyValue: Type.Union([Type.Number(), Type.Null()]),
    currentReturn: Type.Number(),
    currentReturnPercentage: Type.Number(),
    sectorDetails: Type.Array(sectorDetails),
    portfolioId: Type.Number(),
});
export type Investment = Static<typeof investmentSchema>;

export const investmentsResponseSchema = Type.Object({
    data: Type.Array(investmentSchema),
});
export type InvestmentsResponse = Static<typeof investmentsResponseSchema>;

export const investmentsNotFoundSchema = createNotFound("investmentsNotFound");
export type InvestmentsNotFound = Static<typeof investmentsNotFoundSchema>;
