import { FastifyInstance } from "fastify";
import {
    PortfolioIdParam,
    portfolioIdParamSchema,
} from "./investments.schema.js";
import { portfolioInvestmentsQuery } from "./[portfolioId].investments.get.js";
import logger from "../../../logger.js";
import { getFromStore } from "../../../plugins/localStorage.js";
import { UserDetails } from "../../../utils/decodeToken.js";
import { Static, Type } from "@sinclair/typebox";
import { createNotFound } from "../../../utils/createNotFoundSchema.js";
import { fetchCurrentPrice } from "../../assets/fetch-current-price.js";
import db from "../../../database/db.js";
import { AssetType } from "../../../schemas/common-schemas.js";

const valueHistorySchema = Type.Object({
    portfolioValue: Type.Number(),
    date: Type.String(),
});
type ValueHistory = Static<typeof valueHistorySchema>;

const portfolioValueHistorySuccessSchema = Type.Object({
    data: Type.Array(valueHistorySchema),
});
type PortfolioValueHistorySuccessResponse = Static<
    typeof portfolioValueHistorySuccessSchema
>;

const notFoundSchema = createNotFound("portfolioNotFound");
type NotFoundResponse = Static<typeof notFoundSchema>;

const bulkHistoricAssetPriceQuery = (
    assetIds: number[],
    startDate: Date,
    endDate: Date,
) =>
    db
        .selectFrom("stratify.assetPrices as assetPrices")
        .where("assetPrices.assetId", "in", assetIds)
        .where("assetPrices.priceDate", ">=", startDate)
        .where("assetPrices.priceDate", "<=", endDate)
        .select([
            "assetPrices.assetId as assetId",
            "assetPrices.priceDate as priceDate",
            "assetPrices.closePrice as price",
        ]);

const bulkHistoricCurrencyConversionQuery = (
    currencyPairs: string[],
    startDate: Date,
    endDate: Date,
) =>
    db
        .selectFrom("stratify.assetPrices as assetPrices")
        .innerJoin(
            "stratify.assets as assets",
            "assets.id",
            "assetPrices.assetId",
        )
        .where("assets.symbol", "in", currencyPairs)
        .where("assetPrices.priceDate", ">=", startDate)
        .where("assetPrices.priceDate", "<=", endDate)
        .select([
            "assetPrices.assetId as assetId",
            "assets.symbol as currencyPair",
            "assetPrices.priceDate as priceDate",
            "assetPrices.closePrice as price",
        ]);

interface UniqueAsset {
    assetId: number;
    assetSymbol: string;
    assetCountryId: number;
    assetType: AssetType;
    assetCurrency: string | null;
}

const calculatePortfolioValueHistory = async (portfolioId: number) => {
    const { userId, userCurrency } = getFromStore("user") as UserDetails;

    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];

    const trades = await portfolioInvestmentsQuery(
        portfolioId,
        userId,
    ).execute();

    const uniqueAssetsMap = new Map<number, UniqueAsset>();

    trades.map((trade) => {
        if (!uniqueAssetsMap.has(trade.assetId)) {
            uniqueAssetsMap.set(trade.assetId, {
                assetId: trade.assetId,
                assetSymbol: trade.assetSymbol,
                assetCountryId: trade.assetCountryId,
                assetType: trade.assetType as AssetType,
                assetCurrency: trade.assetCurrency,
            });
        }
    });

    const uniqueAssets = Array.from(uniqueAssetsMap.values());

    const uniqueAssetIds = uniqueAssets.map((asset) => asset.assetId);

    const currencyConversionsRequired = new Set<string>();

    uniqueAssets.forEach((asset) => {
        const key = `${asset.assetCurrency}${userCurrency}`;

        if (asset?.assetCurrency && asset.assetCurrency !== userCurrency) {
            if (!currencyConversionsRequired.has(key)) {
                currencyConversionsRequired.add(key);
            }
        }
    });

    const currencyPairs = Array.from(currencyConversionsRequired);

    const oldestTradeDate = trades.reduce((oldest, trade) => {
        return trade.tradeDate < oldest ? trade.tradeDate : oldest;
    }, new Date());

    //? Get historic prices for all assets in the portfolio and currency conversion rates
    const historicAssetPrices = await bulkHistoricAssetPriceQuery(
        uniqueAssetIds,
        oldestTradeDate,
        today,
    ).execute();

    const historicCurrencyConversions =
        currencyPairs.length > 0
            ? await bulkHistoricCurrencyConversionQuery(
                  currencyPairs,
                  oldestTradeDate,
                  today,
              ).execute()
            : [];

    //? Add the historic asset prices and currency conversion rates to a map so that the prices can be accessed by asset ID and price date
    //? This allows for a much quicker lookup as it avoids having to query the database for each day and each trade in the portfolio
    const assetPriceMap = new Map<string, number>();

    historicAssetPrices.forEach((price) => {
        const key = `${price.assetId}-${price.priceDate.toISOString().split("T")[0]}`;
        assetPriceMap.set(key, parseFloat(price.price));
    });

    const currencyConversionMap = new Map<string, number>();

    historicCurrencyConversions.forEach((conversion) => {
        const key = `${conversion.currencyPair}-${
            conversion.priceDate.toISOString().split("T")[0]
        }`;
        currencyConversionMap.set(key, parseFloat(conversion.price));
    });

    //? Fetch the current prices for all assets in the portfolio and add them to a map similar to the historic prices above
    const currentPricesMap = new Map<number, number>();

    await Promise.all(
        uniqueAssets.map(async (asset) => {
            const currentPrice = await fetchCurrentPrice(
                asset.assetSymbol,
                asset.assetCountryId,
                asset.assetType === "CRYPTOCURRENCY",
            ).then((price) => price?.currentPrice || 0);

            currentPricesMap.set(asset.assetId, currentPrice ?? 0);
        }),
    );

    const valueHistory: ValueHistory[] = [];

    for (
        let date = new Date(oldestTradeDate);
        date <= today;
        date.setDate(date.getDate() + 1)
    ) {
        const formattedDate = date.toISOString().split("T")[0];

        //? If the current date is a weekend, then the conversion rate and/or asset price from Friday should be used as markets are closed on weekends (except for cryptocurrencies)
        const isWeekend =
            new Date(date).getDay() === 0 || new Date(date).getDay() === 6;

        const fridayDate = new Date(
            new Date(date).setDate(
                date.getDate() - (date.getDay() === 0 ? 2 : 1),
            ),
        );

        const formattedFridayDate = fridayDate.toISOString().split("T")[0];

        let totalValue = 0;

        //? Map storing a running quantity for each asset by asset ID up to the current date
        const netAssetQuantity = new Map<number, number>();

        for (const trade of trades) {
            const formattedTradeDate = trade.tradeDate
                .toISOString()
                .split("T")[0];

            //? Skip trades that were made after the current date to avoid making redundant calculations
            if (formattedTradeDate > formattedDate) {
                break;
            }

            const currentQuantity = netAssetQuantity.get(trade.assetId) || 0;
            const tradeQuantity = parseFloat(trade.quantity);

            //? Update the running quantity for the asset based on whether the trade was a buy or sell
            netAssetQuantity.set(
                trade.assetId,
                trade.tradeAction === "BUY"
                    ? currentQuantity + tradeQuantity
                    : currentQuantity - tradeQuantity,
            );
        }

        //? Iterate through map of running quantities for each asset in the portfolio and split the mapping into asset ID and quantity
        for (const [assetId, quantity] of netAssetQuantity) {
            if (quantity === 0) continue;

            //? If the current date is today, then use the current price for the asset otherwise use the historic price on the current date
            const pricePerShare =
                (formattedDate === formattedToday
                    ? currentPricesMap.get(assetId)
                    : assetPriceMap.get(`${assetId}-${formattedDate}`)) || 0;

            const fridayPricePerShare =
                assetPriceMap.get(`${assetId}-${formattedFridayDate}`) || 0;

            const trade = trades.find((trade) => trade.assetId === assetId);
            const currencyPair = `${trade?.assetCurrency}${userCurrency}`;

            //? If the asset currency is different from the user's currency, then convert the price per share to the user's currency
            if (currencyConversionsRequired.has(currencyPair)) {
                const conversionDate = isWeekend
                    ? formattedFridayDate
                    : formattedDate;

                const key = `${currencyPair}-${conversionDate}`;
                const conversionRate = currencyConversionMap.get(key) || 1;

                if (isWeekend && trade?.assetType !== "CRYPTOCURRENCY") {
                    totalValue +=
                        quantity * fridayPricePerShare * conversionRate;
                } else {
                    totalValue += quantity * pricePerShare * conversionRate;
                }
            } else {
                isWeekend
                    ? (totalValue += quantity * fridayPricePerShare)
                    : (totalValue += quantity * pricePerShare);
            }
        }

        valueHistory.push({
            portfolioValue: parseFloat(totalValue.toFixed(2)),
            date: formattedDate,
        });
    }

    return valueHistory;
};

export default async function portfolioValueHistoryGet(
    fastify: FastifyInstance,
) {
    fastify.route<{
        Params: PortfolioIdParam;
        Reply: PortfolioValueHistorySuccessResponse | NotFoundResponse;
    }>({
        method: "GET",
        url: "/portfolios/:portfolioId/value-history",
        schema: {
            params: portfolioIdParamSchema,
            response: {
                200: portfolioValueHistorySuccessSchema,
                404: notFoundSchema,
            },
        },
        handler: async (request, reply) => {
            try {
                const { portfolioId } = request.params;

                const valueHistory =
                    await calculatePortfolioValueHistory(portfolioId);

                return reply.status(200).send({ data: valueHistory });
            } catch (error) {
                logger.error(
                    { error },
                    "Error fetching value history for portfolio",
                );

                throw error;
            }
        },
    });
}
