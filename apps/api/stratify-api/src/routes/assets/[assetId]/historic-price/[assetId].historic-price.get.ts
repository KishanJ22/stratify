import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { createNotFound } from "../../../../utils/createNotFoundSchema.js";
import logger from "../../../../logger.js";
import db from "../../../../database/db.js";
import {
    AssetIdParam,
    assetIdParamSchema,
} from "../details/assetDetailsSchema.js";
import { toTwoDecimalPoints } from "../../../../utils/toTwoDecimalPoints.js";

export const historicPriceQuery = Type.Object({
    tradeDate: Type.String(),
});
export type HistoricPriceQuery = Static<typeof historicPriceQuery>;

export const priceResponse = Type.Object({
    data: Type.Object({
        price: Type.Number(),
    }),
});
export type PriceResponse = Static<typeof priceResponse>;

export const invalidTradeDateSchema = Type.Object({
    message: Type.Literal("invalidTradeDate"),
});
export type InvalidTradeDateResponse = Static<typeof invalidTradeDateSchema>;

export const priceNotFoundSchema = createNotFound("priceNotFound");
export type PriceNotFoundResponse = Static<typeof priceNotFoundSchema>;

const historicPriceDbQuery = (assetId: number, tradeDate: Date) =>
    db
        .selectFrom("stratify.assetPrices as assetPrices")
        .where("assetPrices.assetId", "=", assetId)
        .where("assetPrices.priceDate", "=", tradeDate)
        .select("assetPrices.closePrice as price");

export default async function historicAssetPriceGet(fastify: FastifyInstance) {
    fastify.route<{
        Params: AssetIdParam;
        Reply: PriceResponse | PriceNotFoundResponse | InvalidTradeDateResponse;
        Querystring: HistoricPriceQuery;
    }>({
        method: "GET",
        url: "assets/:assetId/historic-price",
        schema: {
            params: assetIdParamSchema,
            querystring: historicPriceQuery,
            response: {
                200: priceResponse,
                400: invalidTradeDateSchema,
                404: priceNotFoundSchema,
            },
        },
        handler: async (request, reply) => {
            const { assetId } = request.params;
            const { tradeDate } = request.query;
            const now = new Date();

            try {
                if (isNaN(Date.parse(tradeDate)) || new Date(tradeDate) > now) {
                    return reply.status(400).send({
                        message: "invalidTradeDate",
                    });
                }

                const historicPrice = await historicPriceDbQuery(
                    assetId,
                    new Date(tradeDate),
                ).executeTakeFirst();

                if (!historicPrice) {
                    return reply.status(404).send({
                        message: "priceNotFound",
                    });
                }

                return reply.status(200).send({
                    data: {
                        price: toTwoDecimalPoints(
                            parseFloat(historicPrice.price),
                        ),
                    },
                });
            } catch (error) {
                logger.error({ error }, "Error fetching historic price");
                throw error;
            }
        },
    });
}
