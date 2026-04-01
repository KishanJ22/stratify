import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import {
    PortfolioIdParam,
    portfolioIdParamSchema,
} from "../investments/investmentSchema.js";
import { getFromStore } from "../../../../plugins/localStorage.js";
import { UserDetails } from "../../../../utils/decodeToken.js";
import logger from "../../../../logger.js";
import db from "../../../../database/db.js";
import { createNotFound } from "../../../../utils/createNotFoundSchema.js";
import { portfolioExistsForUserCheck } from "../portfolioExistsQuery.js";

const requestBodySchema = Type.Object({
    assetId: Type.Number(),
    tradeAction: Type.Union([Type.Literal("BUY"), Type.Literal("SELL")]),
    pricePerShare: Type.Number(),
    currencyConversionRate: Type.Union([Type.Number(), Type.Null()]),
    quantity: Type.Number(),
    tradeDate: Type.String(),
    fee: Type.Number(),
    totalAmount: Type.Number(),
    assetCurrencyTotalAmount: Type.Union([Type.Number(), Type.Null()]),
});
type RequestBody = Static<typeof requestBodySchema>;

const successResponseSchema = Type.Object({
    data: Type.Object({
        success: Type.Boolean(),
    }),
});
type SuccessResponse = Static<typeof successResponseSchema>;

const notFoundSchema = createNotFound("portfolioNotFound");
type NotFoundResponse = Static<typeof notFoundSchema>;

const cannotSellMoreThanHeldSchema = Type.Object({
    message: Type.Literal("cannotSellMoreThanHeld"),
});
type CannotSellMoreThanHeldResponse = Static<
    typeof cannotSellMoreThanHeldSchema
>;

const portfolioInvestmentQuery = (portfolioId: number, assetId: number) =>
    db
        .selectFrom("stratify.trades as trades")
        .where("portfolioId", "=", portfolioId)
        .where("assetId", "=", assetId)
        .selectAll();

//? Query to insert a new trade for a portfolio
const insertTradeQuery = ({
    portfolioId,
    trade,
}: {
    portfolioId: number;
    trade: RequestBody;
}) =>
    db.insertInto("stratify.trades").values({
        portfolioId,
        tradeAction: trade.tradeAction,
        assetId: trade.assetId,
        pricePerShare: trade.pricePerShare,
        currencyConversionRate: trade.currencyConversionRate
            ? trade.currencyConversionRate
            : undefined,
        quantity: trade.quantity,
        tradeDate: new Date(trade.tradeDate),
        fee: trade.fee ? trade.fee : 0,
        totalAmount: trade.totalAmount,
        assetCurrencyTotalAmount: trade.assetCurrencyTotalAmount
            ? trade.assetCurrencyTotalAmount
            : undefined,
    });

export default async function addTradePost(fastify: FastifyInstance) {
    fastify.route<{
        Params: PortfolioIdParam;
        Body: RequestBody;
        Reply:
            | SuccessResponse
            | NotFoundResponse
            | CannotSellMoreThanHeldResponse;
    }>({
        method: "POST",
        url: "/portfolios/:portfolioId/add-trade",
        schema: {
            params: portfolioIdParamSchema,
            body: requestBodySchema,
            response: {
                201: successResponseSchema,
                400: cannotSellMoreThanHeldSchema,
                404: notFoundSchema,
            },
        },
        handler: async (request, reply) => {
            const { portfolioId } = request.params;
            const { body: tradeDetails } = request;

            try {
                const { userId } = getFromStore("user") as UserDetails;

                //? Check if the portfolio belongs to the user
                const isPortfolioValid = await portfolioExistsForUserCheck(
                    portfolioId,
                    userId,
                ).executeTakeFirst();

                //? Return not found if the portfolio doesn't exist/belong to the user
                if (!isPortfolioValid) {
                    return reply.status(404).send({
                        message: "portfolioNotFound",
                    });
                }

                //? If the trade is to sell, then check if the user has enough shares to sell
                if (tradeDetails.tradeAction === "SELL") {
                    const existingInvestmentsForAsset =
                        await portfolioInvestmentQuery(
                            portfolioId,
                            tradeDetails.assetId,
                        ).execute();

                    const currentlyHeldQuantity =
                        existingInvestmentsForAsset.reduce(
                            (quantity, trade) => {
                                if (trade.tradeAction === "BUY") {
                                    return (
                                        quantity + parseFloat(trade.quantity)
                                    );
                                } else {
                                    return (
                                        quantity - parseFloat(trade.quantity)
                                    );
                                }
                            },
                            0,
                        );

                    //? If the quantity currently held is less than the quantity the user wants to sell, then return a bad request response
                    if (currentlyHeldQuantity < tradeDetails.quantity) {
                        return reply.status(400).send({
                            message: "cannotSellMoreThanHeld",
                        });
                    }
                }

                await insertTradeQuery({
                    portfolioId,
                    trade: tradeDetails,
                }).executeTakeFirstOrThrow();

                return reply.status(201).send({ data: { success: true } });
            } catch (error) {
                logger.error({ error }, "Error inserting trade into database");

                throw error;
            }
        },
    });
}
