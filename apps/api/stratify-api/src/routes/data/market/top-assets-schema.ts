import { Static, Type } from "@sinclair/typebox";
import {
    assetTypeSchema,
    marketStateSchema,
} from "../../../schemas/common-schemas.js";

export const topAssetSchema = Type.Object({
    symbol: Type.String(),
    name: Type.String(),
    currency: Type.Union([Type.String(), Type.Null()]),
    assetType: assetTypeSchema,
    marketState: marketStateSchema,
    priceDetails: Type.Object({
        currentPrice: Type.Union([Type.Number(), Type.Null()]),
        volume: Type.Union([Type.Number(), Type.Null()]),
        priceChange: Type.Union([Type.Number(), Type.Null()]),
        priceChangePercent: Type.Union([Type.Number(), Type.Null()]),
    }),
});

export type TopAsset = Static<typeof topAssetSchema>;

export const topAssetsResponseSchema = Type.Object({
    data: Type.Array(topAssetSchema),
});

export type TopAssetsSuccessResponse = Static<typeof topAssetsResponseSchema>;
