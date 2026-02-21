import db from "../database/db.js";

export const currencyConversionRateQuery = (
    fromCurrency: string,
    toCurrency: string,
    date: Date,
) =>
    db
        .selectFrom("stratify.assetPrices as assetPrices")
        .innerJoin(
            "stratify.assets as assets",
            "assets.id",
            "assetPrices.assetId",
        )
        .where("assets.symbol", "=", `${fromCurrency}${toCurrency}`)
        .where("assetPrices.priceDate", "=", date)
        .select("assetPrices.closePrice as price");
