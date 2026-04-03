import { Type, Static } from "@sinclair/typebox";
import {
    assetTypeSchema,
    marketStateSchema,
} from "../../../../schemas/common-schemas.js";
import { createNotFound } from "../../../../utils/createNotFoundSchema.js";
import { sectorDetailsSchema } from "../../../portfolios/[portfolioId]/investments/investmentSchema.js";

export const assetDetailsSchema = Type.Object({
    assetId: Type.Number(),
    name: Type.String(),
    symbol: Type.String(),
    countryId: Type.Number(),
    currency: Type.Union([Type.String(), Type.Null()]),
    assetType: assetTypeSchema,
    marketState: marketStateSchema,
    industry: Type.Union([Type.String(), Type.Null()]),
    sector: Type.Union([Type.Array(sectorDetailsSchema), Type.Null()]),
    dayTradingActivity: Type.Object({
        open: Type.Union([Type.Number(), Type.Null()]),
        close: Type.Union([Type.Number(), Type.Null()]),
        high: Type.Union([Type.Number(), Type.Null()]),
        low: Type.Union([Type.Number(), Type.Null()]),
        priceChange: Type.Union([Type.Number(), Type.Null()]),
        priceChangePercent: Type.Union([Type.Number(), Type.Null()]),
        tradingVolume: Type.Union([Type.Number(), Type.Null()]),
    }),
});

export type AssetDetails = Static<typeof assetDetailsSchema>;

export const assetIdParamSchema = Type.Object({
    assetId: Type.Number(),
});
export type AssetIdParam = Static<typeof assetIdParamSchema>;

export const successResponseSchema = Type.Object({
    data: assetDetailsSchema,
});
export type AssetDetailsSuccessResponse = Static<typeof successResponseSchema>;

export const assetNotFoundSchema = createNotFound("assetNotFound");
export type AssetNotFoundResponse = Static<typeof assetNotFoundSchema>;
