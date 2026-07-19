import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import {
    AssetType,
    Return,
    returnSchema,
} from "../../../schemas/common-schemas.js";
import {
    portfolioListQuery,
    NotFoundResponse,
    notFoundSchema,
} from "../portfolios.get.js";
import logger from "../../../logger.js";
import { getFromStore } from "../../../plugins/localStorage.js";
import { UserDetails } from "../../../utils/decodeToken.js";
import {
    bulkHistoricAssetPriceQuery,
    bulkHistoricCurrencyConversionQuery,
    UniqueAsset,
} from "../[portfolioId]/value-history/calculateValueHistory.js";
import {
    investmentSchema,
    SectorDetails,
} from "../[portfolioId]/investments/investmentSchema.js";
import db from "../../../database/db.js";
import { createNotFound } from "../../../utils/createNotFoundSchema.js";
import { allTradesQuery } from "./allTradesQuery.js";
import { fetchStocksList } from "./fetchStocksList.js";
import { fetchFundsList } from "./fetchFundsList.js";
import { fetchCryptosList } from "./fetchCryptosList.js";
import { portfolioValueOnDate } from "./portfolioValueOnDate.js";
import { adjustForWeekend } from "../../../utils/adjustForWeekend.js";
import { toTwoDecimalPoints } from "../../../utils/toTwoDecimalPoints.js";

interface GroupedInvestment {
    key: string;
    assetId: number;
    symbol: string;
    name: string;
    assetCurrency: string | null;
    assetCountryId: number;
    type: AssetType;
    shares: number;
    currentAverageCost: number;
    totalBuyAmount: number;
    realisedReturn: number;
    currentValue: number;
    currentAssetCurrencyValue: number | null;
    currentReturn: number;
    currentReturnPercentage: number;
    portfolioId: number;
    portfolioName: string;
    sectorDetails: SectorDetails[];
}

const overviewSchema = Type.Object({
    totalValue: Type.Number(),
    overallChange: Type.Object({
        lastThirtyDays: returnSchema,
        lastSixMonths: returnSchema,
        allTime: returnSchema,
    }),
    investments: Type.Array(investmentSchema),
});

type Overview = Static<typeof overviewSchema>;

const successResponseSchema = Type.Object({
    data: overviewSchema,
});

type SuccessResponse = Static<typeof successResponseSchema>;

const noInvestmentsFoundSchema = createNotFound("noInvestmentsFound");
type NoInvestmentsFound = Static<typeof noInvestmentsFoundSchema>;

const hasInvestmentsQuery = (portfolioIds: number[], userId: string) =>
    db
        .selectFrom("stratify.trades as trades")
        .innerJoin(
            "stratify.portfolios as portfolios",
            "trades.portfolioId",
            "portfolios.id",
        )
        .where("trades.portfolioId", "in", portfolioIds)
        .where("portfolios.userId", "=", userId)
        .selectAll()
        .limit(1);

const calculateChangeSincePastValue = (
    latestValue: number,
    pastValue: number,
) => {
    if (pastValue === 0) {
        return {
            absolute: null,
            percentage: null,
        } satisfies Return;
    }

    const valueDifference = latestValue - pastValue;

    return {
        absolute: toTwoDecimalPoints(valueDifference),
        percentage: toTwoDecimalPoints((valueDifference / pastValue) * 100),
    } satisfies Return;
};

const overviewDetails = async (portfolioIds: number[]) => {
    const { userId, userCurrency } = getFromStore("user") as UserDetails;
    const today = new Date();

    const trades = await allTradesQuery(portfolioIds, userId).execute();

    const uniqueAssets = new Map<number, UniqueAsset>();

    trades.map((trade) => {
        if (!uniqueAssets.has(trade.assetId)) {
            uniqueAssets.set(trade.assetId, {
                assetId: trade.assetId,
                assetSymbol: trade.assetSymbol,
                assetCountryId: trade.assetCountryId,
                assetType: trade.assetType as AssetType,
                assetCurrency: trade.assetCurrency,
            });
        }
    });

    const currencyConversionsRequired = new Set<string>();

    uniqueAssets.forEach(({ assetCurrency }) => {
        if (assetCurrency === "GBX" && userCurrency === "GBP") {
            return;
        }

        const key = `${assetCurrency === "GBX" ? "GBP" : assetCurrency}${userCurrency}`;

        if (assetCurrency) {
            if (
                assetCurrency !== userCurrency &&
                !currencyConversionsRequired.has(key)
            ) {
                currencyConversionsRequired.add(key);
            }
        }
    });

    const oldestTradeDate = trades.reduce((oldest, trade) => {
        return trade.tradeDate.getTime() < oldest.getTime()
            ? trade.tradeDate
            : oldest;
    }, new Date());

    const adjustedOldestTradeDate = adjustForWeekend(oldestTradeDate);

    const currencyPairs = Array.from(currencyConversionsRequired);

    const historicCurrencyRates =
        currencyPairs.length > 0
            ? await bulkHistoricCurrencyConversionQuery(
                  currencyPairs,
                  adjustedOldestTradeDate,
                  today,
              ).execute()
            : [];

    const historicCurrencyRatesMap = new Map<
        { currencyPair: string; priceDate: string },
        number
    >();

    historicCurrencyRates.forEach((rate) => {
        const key = {
            currencyPair: rate.currencyPair,
            priceDate: rate.priceDate.toISOString().split("T")[0],
        };

        historicCurrencyRatesMap.set(key, parseFloat(rate.price));
    });

    const currencyRates = Array.from(historicCurrencyRatesMap);

    const symbols = trades.reduce(
        (acc, investment) => {
            const { assetSymbol, assetCountryId, assetType } = investment;

            const combinedSymbol =
                assetType === "CRYPTOCURRENCY"
                    ? `${assetSymbol}-USD`
                    : assetCountryId === 223
                      ? `${assetSymbol}.L`
                      : assetSymbol;

            if (assetType === "STOCK" && !acc.stocks.has(combinedSymbol)) {
                acc.stocks.add(combinedSymbol);
            } else if (
                assetType === "CRYPTOCURRENCY" &&
                !acc.cryptos.has(combinedSymbol)
            ) {
                acc.cryptos.add(combinedSymbol);
            } else if (assetType === "ETF" && !acc.funds.has(combinedSymbol)) {
                acc.funds.add(combinedSymbol);
            }

            return acc;
        },
        {
            stocks: new Set(),
            cryptos: new Set(),
            funds: new Set(),
        },
    );

    const [stocksList, fundsList, cryptosList] = await Promise.all([
        fetchStocksList(Array.from(symbols.stocks).toString()),
        fetchFundsList(Array.from(symbols.funds).toString()),
        fetchCryptosList(Array.from(symbols.cryptos).toString()),
    ]);

    const currentAssetPricesMap = new Map<number, number>();
    const historicAssetPricesMap = new Map<string, number>();

    const historicAssetPrices = await bulkHistoricAssetPriceQuery(
        Array.from(uniqueAssets.keys()),
        adjustedOldestTradeDate,
        today,
    ).execute();

    historicAssetPrices.forEach(({ assetId, price, priceDate }) => {
        const key = `${assetId}-${priceDate.toISOString().split("T")[0]}`;
        historicAssetPricesMap.set(key, parseFloat(price));
    });

    const groupedInvestments = trades.reduce((acc, trade) => {
        const {
            assetId,
            assetCurrency,
            assetSymbol,
            assetType,
            assetName,
            assetCountryId,
            portfolioId,
            portfolioName,
        } = trade;

        const key = `${portfolioId}-${assetId}`;

        if (acc.some((investment) => investment.key === key)) return acc;

        const isCurrencyConversionRequired =
            assetCurrency === userCurrency ? false : true;

        let conversionRate = 1;

        if (isCurrencyConversionRequired) {
            if (assetCurrency === "GBX" && userCurrency === "GBP") {
                conversionRate = 0.01;
            } else {
                const currencyPair = `${assetCurrency === "GBX" ? "GBP" : assetCurrency}${userCurrency}`;
                const latestConversionRate = currencyRates
                    .filter((rate) => rate[0].currencyPair === currencyPair)
                    .sort(
                        (a, b) =>
                            new Date(b[0].priceDate).getTime() -
                            new Date(a[0].priceDate).getTime(),
                    )[0][1];

                conversionRate =
                    assetCurrency === "GBX"
                        ? latestConversionRate / 100
                        : latestConversionRate;
            }
        }

        const tradesForAsset = trades.filter(
            (t) => t.assetId === assetId && t.portfolioId === portfolioId,
        );

        const {
            currentHoldingQuantity,
            totalBuyQuantity,
            totalBuyAmount,
            totalSellQuantity,
            totalSellAmount,
        } = tradesForAsset.reduce(
            (sum, t) => {
                const quantity = parseFloat(t.quantity);
                const totalAmount = parseFloat(t.totalAmount);

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
                totalSellQuantity: 0,
                totalSellAmount: 0,
            },
        );

        const averageCost =
            totalBuyQuantity > 0 ? totalBuyAmount / totalBuyQuantity : 0;

        const currentAverageCost = averageCost * currentHoldingQuantity;

        const realisedReturn =
            totalSellAmount - averageCost * totalSellQuantity;

        const assetDetails =
            trade.assetType === "STOCK"
                ? stocksList?.find((stock) => stock.symbol === assetSymbol)
                : trade.assetType === "ETF"
                  ? fundsList?.find((fund) => fund.symbol === assetSymbol)
                  : cryptosList?.find(
                        (crypto) => crypto.symbol === assetSymbol,
                    );

        const currentPrice = assetDetails?.priceDetails.currentPrice ?? 0;

        currentAssetPricesMap.set(assetId, currentPrice);

        const currentValue =
            currentPrice * currentHoldingQuantity * conversionRate;

        const currentAssetCurrencyValue = isCurrencyConversionRequired
            ? (assetDetails?.priceDetails.currentPrice ?? 0) *
              currentHoldingQuantity
            : null;

        const currentReturn =
            currentValue - currentAverageCost + realisedReturn;

        const currentReturnPercentage =
            totalBuyAmount > 0
                ? toTwoDecimalPoints((currentReturn / totalBuyAmount) * 100)
                : 0;

        let sectorDetails = [{ sector: "", weight: 1 }];

        if (assetType === "STOCK") {
            const stockDetails = stocksList?.find(
                (stock) => stock.symbol === assetSymbol,
            );

            if (stockDetails?.industryDetails?.sector) {
                logger.info(
                    { sector: stockDetails.industryDetails.sector },
                    "Sector found",
                );

                sectorDetails = [
                    {
                        sector: stockDetails.industryDetails.sector,
                        weight: 1,
                    },
                ];
            }
        }

        if (assetType === "ETF") {
            const fundDetails = fundsList?.find(
                (fund) => fund.symbol === assetSymbol,
            );

            if (fundDetails?.sectorWeights) {
                sectorDetails = fundDetails.sectorWeights;
            }
        }

        if (assetType === "CRYPTOCURRENCY") {
            sectorDetails = [
                {
                    sector: "cryptocurrency",
                    weight: 1,
                },
            ];
        }

        acc.push({
            key,
            assetId,
            symbol: assetSymbol,
            name: assetName,
            assetCurrency,
            assetCountryId,
            type: assetType as AssetType,
            shares: currentHoldingQuantity,
            currentAverageCost,
            totalBuyAmount,
            realisedReturn,
            currentValue,
            currentAssetCurrencyValue,
            currentReturn,
            currentReturnPercentage,
            sectorDetails,
            portfolioName,
            portfolioId,
        } satisfies GroupedInvestment);

        return acc;
    }, [] as GroupedInvestment[]);

    const { totalValue, overallReturn, totalBuyAmount } =
        groupedInvestments.reduce(
            (acc, { currentValue, currentReturn, totalBuyAmount }) => {
                return {
                    totalValue: (acc.totalValue += currentValue),
                    overallReturn: (acc.overallReturn += currentReturn),
                    totalBuyAmount: (acc.totalBuyAmount += totalBuyAmount),
                };
            },
            {
                totalValue: 0,
                overallReturn: 0,
                totalBuyAmount: 0,
            },
        );

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const portfolioValueThirtyDaysAgo = portfolioValueOnDate(
        thirtyDaysAgo,
        trades,
        historicAssetPricesMap,
        currentAssetPricesMap,
        currencyRates,
        uniqueAssets,
    );

    const portfolioValueSixMonthsAgo = portfolioValueOnDate(
        sixMonthsAgo,
        trades,
        historicAssetPricesMap,
        currentAssetPricesMap,
        currencyRates,
        uniqueAssets,
    );

    const changeInThirtyDays = calculateChangeSincePastValue(
        totalValue,
        portfolioValueThirtyDaysAgo,
    );

    const changeInSixMonths = calculateChangeSincePastValue(
        totalValue,
        portfolioValueSixMonthsAgo,
    );

    const allTimeReturn = {
        absolute: overallReturn,
        percentage:
            totalBuyAmount > 0
                ? toTwoDecimalPoints((overallReturn / totalBuyAmount) * 100)
                : null,
    } satisfies Return;

    return {
        totalValue,
        overallChange: {
            lastThirtyDays: changeInThirtyDays,
            lastSixMonths: changeInSixMonths,
            allTime: allTimeReturn,
        },
        investments: groupedInvestments
            .filter(({ currentValue }) => currentValue > 0)
            .sort(
                (a, b) => b.currentReturnPercentage - a.currentReturnPercentage,
            ),
    } satisfies Overview;
};

export default async function overviewGet(fastify: FastifyInstance) {
    fastify.route<{
        Reply: SuccessResponse | NotFoundResponse | NoInvestmentsFound;
    }>({
        method: "GET",
        url: "/portfolios/overview",
        schema: {
            response: {
                200: successResponseSchema,
                404: Type.Union([notFoundSchema, noInvestmentsFoundSchema]),
            },
        },
        handler: async (_request, reply) => {
            try {
                const { userId } = getFromStore("user") as UserDetails;

                const portfolios = await portfolioListQuery(userId).execute();

                if (portfolios.length === 0) {
                    return reply
                        .status(404)
                        .send({ message: "noPortfoliosFound" });
                }

                const portfolioIds = portfolios.map((p) => p.id);

                const hasInvestments = await hasInvestmentsQuery(
                    portfolioIds,
                    userId,
                ).execute();

                if (hasInvestments.length === 0) {
                    return reply
                        .status(404)
                        .send({ message: "noInvestmentsFound" });
                }

                const overview = await overviewDetails(portfolioIds);

                return reply.status(200).send({ data: overview });
            } catch (error) {
                logger.error({ error }, "Error fetching overview");
                throw error;
            }
        },
    });
}
