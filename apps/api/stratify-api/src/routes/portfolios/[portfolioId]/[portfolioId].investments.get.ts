import { FastifyInstance } from "fastify";
import logger from "../../../logger.js";
import { getFromStore } from "../../../plugins/localStorage.js";
import { UserDetails } from "../../../utils/decodeToken.js";
import {
    Investment,
    InvestmentsNotFound,
    investmentsNotFoundSchema,
    InvestmentsResponse,
    investmentsResponseSchema,
    PortfolioIdParam,
    portfolioIdParamSchema,
} from "./investments.schema.js";
import db from "../../../database/db.js";
import { InferResult } from "kysely";
import { fetchCurrentPrice } from "../../assets/fetch-current-price.js";
import { formatInvestmentDetails } from "./format-investment-details.js";

const portfolioInvestmentsQuery = (portfolioId: number, userId: string) =>
    db
        .selectFrom("stratify.trades as trades")
        .innerJoin(
            "stratify.portfolios as portfolios",
            "trades.portfolioId",
            "portfolios.id",
        )
        .innerJoin("stratify.assets as assets", "trades.assetId", "assets.id")
        .where("portfolios.id", "=", portfolioId)
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
            "assets.symbol as symbol",
            "assets.countryId as assetCountryId",
        ])
        //? Order by trade date from oldest to newest
        .orderBy("trades.tradeDate", "asc");

const assetDetailsQuery = (assetId: number) =>
    db
        .selectFrom("stratify.assets as assets")
        .where("assets.id", "=", assetId)
        .select([
            "assets.id as assetId",
            "assets.name as name",
            "assets.type as type",
            "assets.currency as assetCurrency",
        ]);

export type AssetDetails = InferResult<
    ReturnType<typeof assetDetailsQuery>
>[number];

export interface GroupedInvestment {
    id: number;
    symbol: string;
    assetCountryId: number;
    shares: number;
    totalPurchaseValue: number;
}

const retrieveInvestments = async (
    portfolioId: number,
    userId: string,
    userCurrency: string,
) => {
    const trades = await portfolioInvestmentsQuery(
        portfolioId,
        userId,
    ).execute();

    if (trades.length === 0) {
        return [];
    }

    // TODO: Add calculation of realised gains/losses for sold shares, only unrealised returns for currently held shares are calculated
    const groupedInvestmentsMap = trades.reduce((acc, trade) => {
        const key = trade.assetId;

        if (acc.has(key)) {
            return acc;
        }

        const tradesForAsset = trades.filter(
            (t) => t.assetId === trade.assetId,
        );

        //? How many shares of this asset are currently held?
        const currentHoldingQuantity = tradesForAsset.reduce((sum, t) => {
            const quantity = parseFloat(t.quantity);
            return t.tradeAction === "BUY" ? sum + quantity : sum - quantity;
        }, 0);

        //? What is the total cost for the currently held shares of this asset (in the user's currency)?
        const totalPurchaseValue = tradesForAsset.reduce((sum, t) => {
            const tradeAmount = parseFloat(t.totalAmount);

            return t.tradeAction === "BUY"
                ? sum + tradeAmount
                : sum - tradeAmount;
        }, 0);

        //? Only return the asset if the user is holding shares of it. If the quantity currently held is 0, then the investment has been fully sold
        if (currentHoldingQuantity > 0) {
            acc.set(key, {
                id: key,
                shares: currentHoldingQuantity,
                symbol: trade.symbol,
                assetCountryId: trade.assetCountryId,
                totalPurchaseValue,
            });
        }

        return acc;
    }, new Map<number, GroupedInvestment>());

    const groupedInvestments = Array.from(groupedInvestmentsMap.values());

    const formattedInvestments = await Promise.all(
        groupedInvestments.map(async (investment) => {
            const { id, symbol, assetCountryId } = investment;

            const assetDetails =
                await assetDetailsQuery(id).executeTakeFirstOrThrow();

            //? Get the current value of the asset and multiply it by the number of shares held to get the overall investment value
            //? The current price of the asset is in the asset's currency so it needs to be converted to the user's currency if they are different
            const currentInvestmentValue = await fetchCurrentPrice(
                symbol,
                assetCountryId,
                assetDetails.type === "CRYPTOCURRENCY",
            ).then((priceDetails) => {
                const price = priceDetails?.currentPrice ?? 0;
                return price * investment.shares;
            });

            //? Format the details of the investment, convert the monetary amounts by currency if needed and return it
            return await formatInvestmentDetails(
                investment,
                assetDetails,
                currentInvestmentValue,
                userCurrency,
            );
        }),
    );

    //? Sort investments by highest current value first
    return formattedInvestments.sort((a, b) => b.currentValue - a.currentValue);
};

export default async function portfolioInvestmentsGet(
    fastify: FastifyInstance,
) {
    fastify.route<{
        Params: PortfolioIdParam;
        Reply: InvestmentsResponse | InvestmentsNotFound;
    }>({
        method: "GET",
        url: "/portfolios/:portfolioId/investments",
        schema: {
            params: portfolioIdParamSchema,
            response: {
                200: investmentsResponseSchema,
                404: investmentsNotFoundSchema,
            },
        },
        handler: async (request, reply) => {
            try {
                const { portfolioId } = request.params;

                const { userId, currency } = getFromStore(
                    "user",
                ) as UserDetails;

                const investments = await retrieveInvestments(
                    portfolioId,
                    userId,
                    currency,
                );

                if (investments.length === 0) {
                    return reply.status(404).send({
                        message: "investmentsNotFound",
                    });
                }

                return reply.status(200).send({
                    data: investments,
                });
            } catch (error) {
                logger.error(
                    { error },
                    "Error fetching investments for portfolio",
                );

                throw error;
            }
        },
    });
}
