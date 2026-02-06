import { InferResult } from "kysely";
import db from "../../../database/db.js";

export const fetchAssetDetailsQuery = (symbol: string) => {
    const symbolParts = symbol.split(".");
    const symbolName = symbolParts[0];
    const suffix = symbolParts[1] || "";

    // Country ID for London Stock Exchange is 223, for United States is 224
    const countryId = suffix === "L" ? 223 : 224;

    return db
        .selectFrom("stratify.assets as assets")
        .where("assets.symbol", "=", symbolName)
        .where("assets.countryId", "=", countryId)
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
