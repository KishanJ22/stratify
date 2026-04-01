import { InferResult } from "kysely";
import db from "../../../database/db.js";

export const fetchAssetDetailsQuery = (symbol: string, assetType: string) => {
    const symbolParts =
        assetType === "CRYPTOCURRENCY" ? symbol.split("-") : symbol.split(".");
    const symbolName = symbolParts[0];
    const suffix = symbolParts[1] || "";

    // Country ID for United Kingdom is 223, for United States is 224
    const countryId = suffix === "L" ? 223 : 224;

    return db
        .selectFrom("stratify.assets as assets")
        .where("assets.symbol", "=", symbolName)
        .where("assets.countryId", "=", countryId)
        .where("assets.type", "=", assetType)
        .select([
            "assets.name as name",
            "assets.type as assetType",
            "assets.symbol as symbol",
            "assets.currency as currency",
        ]);
};

export type AssetDetails = InferResult<
    ReturnType<typeof fetchAssetDetailsQuery>
>[number];
