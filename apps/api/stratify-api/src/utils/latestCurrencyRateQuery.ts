import db from "../database/db.js";

export const latestCurrencyConversionRateQuery = (currencyPair: string) =>
    db
        .selectFrom("stratify.assetPrices as assetPrices")
        .innerJoin(
            "stratify.assets as assets",
            "assets.id",
            "assetPrices.assetId",
        )
        .where("assets.symbol", "=", currencyPair)
        .select("assetPrices.closePrice as price")
        .orderBy("assetPrices.priceDate", "desc")
        .limit(1);
