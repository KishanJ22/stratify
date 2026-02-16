import db from "../database/db.js";

export const currencyConversionRateQuery = (
    fromCurrency: string,
    toCurrency: string,
    date: Date,
) =>
    db
        .selectFrom("stratify.assetPrices as assetPrices")
        .where("assetPrices.assetId", "=", `${fromCurrency}${toCurrency}`)
        .where("assetPrices.priceDate", "=", date)
        .select("assetPrices.closePrice as price");
