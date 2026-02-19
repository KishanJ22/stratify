import { Static, Type } from "@sinclair/typebox";
import { assetTypeSchema } from "../../schemas/common-schemas.js";
import { createNotFound } from "../../utils/createNotFoundSchema.js";

export const searchAssetsRequestBody = Type.Object({
    query: Type.String(),
});

export type SearchAssetsRequestBody = Static<typeof searchAssetsRequestBody>;

export const searchAssetSchema = Type.Object({
    id: Type.Number(),
    name: Type.String(),
    symbol: Type.String(),
    currency: Type.Union([Type.String(), Type.Null()]),
    assetType: assetTypeSchema,
    currentPrice: Type.Union([Type.Number(), Type.Null()]),
    priceChange: Type.Union([Type.Number(), Type.Null()]),
    priceChangePercent: Type.Union([Type.Number(), Type.Null()]),
});

export const searchAssetsResponseSchema = Type.Object({
    data: Type.Array(searchAssetSchema),
});

export type SearchAsset = Static<typeof searchAssetSchema>;
export type SearchAssetsSuccessResponse = Static<
    typeof searchAssetsResponseSchema
>;

export const notFoundSchema = createNotFound("noAssetsFound");
export type NotFoundResponse = Static<typeof notFoundSchema>;

export const badRequestSchema = Type.Object({
    message: Type.Literal("invalidSearchQuery"),
});

export type BadRequestResponse = Static<typeof badRequestSchema>;
