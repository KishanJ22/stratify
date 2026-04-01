import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { createNotFound } from "../../../../utils/createNotFoundSchema.js";
import logger from "../../../../logger.js";
import db from "../../../../database/db.js";
import {
    AssetIdParam,
    assetIdParamSchema,
} from "../details/assetDetailsSchema.js";

export const historicPriceQuery = Type.Object({
    tradeDate: Type.String(),
});

export type HistoricPriceQuery = Static<typeof historicPriceQuery>;

export const HistoricPriceResponse = Type.Object({
    data: Type.Object({
        price: Type.String(),
    }),
});

export type HistoricPriceResponse = Static<typeof HistoricPriceResponse>;

export const notFoundSchema = createNotFound("priceNotFound");

export type HistoricPriceErrorResponse = Static<typeof notFoundSchema>;

const historicPriceDbQuery = (assetId: number, tradeDate: Date) =>
    db
        .selectFrom("stratify.assetPrices as assetPrices")
        .where("assetPrices.assetId", "=", assetId)
        .where("assetPrices.priceDate", "=", tradeDate)
        .select("assetPrices.closePrice as price");

export default async function historicAssetPriceGet(fastify: FastifyInstance) {
    fastify.route<{
        Params: AssetIdParam;
        Reply: HistoricPriceResponse | HistoricPriceErrorResponse;
        Querystring: HistoricPriceQuery;
    }>({
        method: "GET",
        url: "assets/:assetId/historic-price",
        schema: {
            params: assetIdParamSchema,
            querystring: historicPriceQuery,
            response: {
                200: HistoricPriceResponse,
                404: notFoundSchema,
            },
        },
        handler: async (request, reply) => {
            const { assetId } = request.params;
            const { tradeDate } = request.query;

            try {
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
                        price: historicPrice.price,
                    },
                });
            } catch (error) {
                logger.error({ error }, "Error fetching historic price");
                throw error;
            }
        },
    });
}
