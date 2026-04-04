import { Static, Type } from "@sinclair/typebox";
import db from "../../../../database/db.js";
import { FastifyInstance } from "fastify";
import {
    AssetIdParam,
    assetIdParamSchema,
    AssetNotFoundResponse,
    assetNotFoundSchema,
} from "../details/assetDetailsSchema.js";
import logger from "../../../../logger.js";
import { toTwoDecimalPoints } from "../../../../utils/toTwoDecimalPoints.js";

const priceHistorySchema = Type.Object({
    date: Type.String(),
    priceDetails: Type.Object({
        open: Type.Number(),
        close: Type.Number(),
        high: Type.Number(),
        low: Type.Number(),
    }),
});

type AssetPriceHistory = Static<typeof priceHistorySchema>;

const assetPriceHistoryResponseSchema = Type.Object({
    data: Type.Array(priceHistorySchema),
});

type AssetPriceHistoryResponse = Static<typeof assetPriceHistoryResponseSchema>;

const assetPriceHistoryQuery = (assetId: number) =>
    db
        .selectFrom("stratify.assetPrices")
        .where("assetId", "=", assetId)
        .selectAll()
        .orderBy("priceDate", "asc");

export default async function assetPriceHistoryGet(fastify: FastifyInstance) {
    fastify.route<{
        Params: AssetIdParam;
        Reply: AssetPriceHistoryResponse | AssetNotFoundResponse;
    }>({
        method: "GET",
        url: "assets/:assetId/price-history",
        schema: {
            params: assetIdParamSchema,
            response: {
                200: assetPriceHistoryResponseSchema,
                404: assetNotFoundSchema,
            },
        },
        handler: async (request, reply) => {
            const { assetId } = request.params;
            try {
                const assetPriceHistory =
                    await assetPriceHistoryQuery(assetId).execute();

                if (assetPriceHistory.length === 0) {
                    return reply.status(404).send({ message: "assetNotFound" });
                }

                const formattedPriceHistory = assetPriceHistory.reduce(
                    (acc, price) => {
                        const {
                            priceDate,
                            openPrice,
                            closePrice,
                            highPrice,
                            lowPrice,
                        } = price;

                        acc.push({
                            date: priceDate.toISOString().split("T")[0],
                            priceDetails: {
                                open: toTwoDecimalPoints(parseFloat(openPrice)),
                                close: toTwoDecimalPoints(
                                    parseFloat(closePrice),
                                ),
                                high: toTwoDecimalPoints(parseFloat(highPrice)),
                                low: toTwoDecimalPoints(parseFloat(lowPrice)),
                            },
                        });

                        return acc;
                    },
                    [] as AssetPriceHistory[],
                );

                return reply.status(200).send({ data: formattedPriceHistory });
            } catch (error) {
                logger.error(
                    { error, assetId },
                    "Error fetching asset price history",
                );
                throw error;
            }
        },
    });
}
