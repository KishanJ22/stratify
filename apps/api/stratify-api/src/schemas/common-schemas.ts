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
