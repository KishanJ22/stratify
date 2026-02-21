import db from "../database/db.js";

export const latestCurrencyConversionRateQuery = (
    fromCurrency: string,
    toCurrency: string,
) =>
    db
        .selectFrom("stratify.assetPrices as assetPrices")
        .innerJoin(
            "stratify.assets as assets",
            "assets.id",
            "assetPrices.assetId",
        )
        .where("assets.symbol", "=", `${fromCurrency}${toCurrency}`)
        .select("assetPrices.closePrice as price")
        .orderBy("assetPrices.priceDate", "desc")
        .limit(1);
