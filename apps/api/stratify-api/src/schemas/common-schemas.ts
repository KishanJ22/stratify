import { Static, Type } from "@sinclair/typebox";

const marketStates = [
    "PRE",
    "PREPRE",
    "REGULAR",
    "POST",
    "POSTPOST",
    "CLOSED",
] as const;

export const marketStateSchema = Type.Union(
    marketStates.map((state) => Type.Literal(state)),
);

const assetTypes = ["STOCK", "ETF", "CRYPTOCURRENCY"] as const;

export const assetTypeSchema = Type.Union(
    assetTypes.map((type) => Type.Literal(type)),
);

export type MarketState = Static<typeof marketStateSchema>;
export type AssetType = Static<typeof assetTypeSchema>;

export const returnSchema = Type.Object({
    percentage: Type.Union([Type.Number(), Type.Null()]),
    absolute: Type.Union([Type.Number(), Type.Null()]),
});

export type Return = Static<typeof returnSchema>;
