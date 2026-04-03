import db from "../../../../database/db.js";
import { getFromStore } from "../../../../plugins/localStorage.js";
import type { AssetType } from "../../../../schemas/common-schemas.js";
import type { UserDetails } from "../../../../utils/decodeToken.js";
import { fetchCurrentPrice } from "../../fetchCurrentPrice.js";
import { formatAssetHoldingDetails } from "./formatAssetHoldingDetails.js";

const assetInvestmentsQuery = (assetId: number, userId: string) =>
    db
        .selectFrom("stratify.trades as trades")
        .innerJoin(
            "stratify.portfolios as portfolios",
            "trades.portfolioId",
            "portfolios.id",
        )
        .innerJoin("stratify.assets as assets", "trades.assetId", "assets.id")
        .where("trades.assetId", "=", assetId)
        .where("portfolios.userId", "=", userId)
        .select([
            "trades.id as tradeId",
            "trades.tradeDate as tradeDate",
            "trades.quantity as quantity",
            "trades.pricePerShare as pricePerShare",
            "trades.tradeAction as tradeAction",
            "trades.totalAmount as totalAmount",
            "trades.assetCurrencyTotalAmount as assetCurrencyTotalAmount",
            "portfolios.id as portfolioId",
            "assets.symbol as assetSymbol",
            "assets.type as assetType",
            "assets.currency as assetCurrency",
            "assets.countryId as assetCountryId",
        ])
        .orderBy("portfolios.id", "asc");

export interface GroupedAssetInvestment {
    portfolioId: number;
    assetCurrency: string | null;
    symbol: string;
    type: AssetType;
    countryId: number;
    shares: number;
    averageCost: number;
    averageCostAssetCurrency: number;
    totalBuyAmount: number;
    totalBuyAmountAssetCurrency: number | null;
    realisedReturn: number;
}

export const retrieveAssetHoldings = async (assetId: number) => {
    const { userId, userCurrency } = getFromStore("user") as UserDetails;

    const trades = await assetInvestmentsQuery(assetId, userId).execute();

    if (trades.length === 0) {
        return [];
    }

    const groupedHoldingsMap = trades.reduce((acc, trade) => {
        const key = trade.portfolioId;

        if (acc.has(key)) {
            return acc;
        }

        const tradesForPortfolio = trades.filter(
            (t) => t.portfolioId === trade.portfolioId,
        );

        const {
            currentHoldingQuantity,
            totalBuyQuantity,
            totalBuyAmount,
            totalBuyAmountAssetCurrency,
            totalSellQuantity,
            totalSellAmount,
        } = tradesForPortfolio.reduce(
            (sum, t) => {
                const quantity = parseFloat(t.quantity);
                const totalAmount = parseFloat(t.totalAmount);
                const totalAmountAssetCurrency = parseFloat(
                    t.assetCurrencyTotalAmount ?? "0",
                );

                return {
                    currentHoldingQuantity:
                        sum.currentHoldingQuantity +
                        (t.tradeAction === "BUY" ? quantity : -quantity),
                    totalBuyQuantity:
                        sum.totalBuyQuantity +
                        (t.tradeAction === "BUY" ? quantity : 0),
                    totalBuyAmount:
                        sum.totalBuyAmount +
                        (t.tradeAction === "BUY" ? totalAmount : 0),
                    totalBuyAmountAssetCurrency:
                        sum.totalBuyAmountAssetCurrency +
                        (t.tradeAction === "BUY"
                            ? totalAmountAssetCurrency
                            : 0),
                    totalSellQuantity:
                        sum.totalSellQuantity +
                        (t.tradeAction === "SELL" ? quantity : 0),
                    totalSellAmount:
                        sum.totalSellAmount +
                        (t.tradeAction === "SELL" ? totalAmount : 0),
                };
            },
            {
                currentHoldingQuantity: 0,
                totalBuyQuantity: 0,
                totalBuyAmount: 0,
                totalBuyAmountAssetCurrency: 0,
                totalSellQuantity: 0,
                totalSellAmount: 0,
            },
        );

        const averageCost =
            totalBuyQuantity > 0 ? totalBuyAmount / totalBuyQuantity : 0;

        const averageCostAssetCurrency =
            totalBuyQuantity > 0
                ? totalBuyAmountAssetCurrency / totalBuyQuantity
                : 0;

        const realisedReturn =
            totalSellAmount - averageCost * totalSellQuantity;

        if (currentHoldingQuantity > 0 || realisedReturn !== 0) {
            acc.set(key, {
                portfolioId: trade.portfolioId,
                shares: currentHoldingQuantity,
                symbol: trade.assetSymbol,
                type: trade.assetType as AssetType,
                assetCurrency: trade.assetCurrency,
                countryId: trade.assetCountryId,
                averageCost,
                averageCostAssetCurrency,
                totalBuyAmount,
                totalBuyAmountAssetCurrency,
                realisedReturn,
            });
        }

        return acc;
    }, new Map<number, GroupedAssetInvestment>());

    const groupedHoldings = Array.from(groupedHoldingsMap.values());

    const formattedHoldings = await Promise.all(
        groupedHoldings.map(async (holding) => {
            const { symbol, countryId, type } = holding;

            const currentPrice = await fetchCurrentPrice(
                symbol,
                countryId,
                type === "CRYPTOCURRENCY",
            ).then((priceDetails) => priceDetails?.currentPrice ?? 0);

            const currentInvestmentValue = currentPrice * holding.shares;

            return await formatAssetHoldingDetails(
                holding,
                currentInvestmentValue,
                userCurrency,
            );
        }),
    );

    return formattedHoldings;
};
