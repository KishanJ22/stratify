import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import dataApiClient from "../../../lib/api/data-api-client.js";
import logger from "../../../logger.js";
import {
    assetTypeSchema,
    marketStateSchema,
} from "../../../schemas/common-schemas.js";
import { getFromStore } from "../../../plugins/localStorage.js";

const topGainerSchema = Type.Object({
    symbol: Type.String(),
    name: Type.String(),
    longName: Type.String(),
    assetType: assetTypeSchema,
    marketState: marketStateSchema,
    priceDetails: Type.Object({
        currentPrice: Type.Number(),
        volume: Type.Number(),
        priceChange: Type.Number(),
        priceChangePercent: Type.Number(),
    }),
});

const topGainersResponseSchema = Type.Object({
    data: Type.Array(topGainerSchema),
});

type TopGainersSuccessResponse = Static<typeof topGainersResponseSchema>;

export default function topGainersGet(fastify: FastifyInstance) {
    fastify.route<{
        Reply: TopGainersSuccessResponse;
    }>({
        method: "GET",
        url: "/data/market/top-gainers",
        schema: {
            response: {
                200: topGainersResponseSchema,
            },
        },
        handler: async (_request, reply) => {
            const requestId = getFromStore("requestId") as string;

            try {
                const response = await dataApiClient
                    .GET("/market/top-gainers")
                    .then((res) => res.data?.data);
            } catch (error) {
                logger.error({ error }, "Error fetching top gainers");
                throw error;
            }
        },
    });
}
