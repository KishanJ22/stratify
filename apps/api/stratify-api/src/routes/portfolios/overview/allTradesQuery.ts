import { InferResult } from "kysely";
import db from "../../../database/db.js";

export const allTradesQuery = (portfolioIds: number[], userId: string) =>
    db
        .selectFrom("stratify.trades as trades")
        .innerJoin(
            "stratify.portfolios as portfolios",
            "trades.portfolioId",
            "portfolios.id",
        )
        .innerJoin("stratify.assets as assets", "trades.assetId", "assets.id")
        .where("portfolios.id", "in", portfolioIds)
        .where("portfolios.userId", "=", userId)
        .select([
            "trades.id as tradeId",
            "trades.tradeDate as tradeDate",
            "trades.quantity as quantity",
            "trades.pricePerShare as pricePerShare",
            "trades.tradeAction as tradeAction",
            "trades.totalAmount as totalAmount",
            "trades.assetCurrencyTotalAmount as assetCurrencyTotalAmount",
            "assets.id as assetId",
            "assets.symbol as assetSymbol",
            "assets.name as assetName",
            "assets.type as assetType",
            "assets.countryId as assetCountryId",
            "assets.currency as assetCurrency",
            "portfolios.id as portfolioId",
            "portfolios.name as portfolioName",
        ])
        .orderBy("trades.tradeDate", "asc");

export type Trade = InferResult<ReturnType<typeof allTradesQuery>>[number];
