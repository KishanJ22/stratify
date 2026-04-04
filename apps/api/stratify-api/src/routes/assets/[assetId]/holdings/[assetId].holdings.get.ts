import { FastifyInstance } from "fastify";
import {
    AssetIdParam,
    assetIdParamSchema,
} from "../details/assetDetailsSchema.js";
import {
    AssetHoldingsNotFound,
    assetHoldingsNotFoundSchema,
    AssetHoldingsResponse,
    assetHoldingsResponseSchema,
} from "./assetHoldingsSchema.js";
import { retrieveAssetHoldings } from "./retrieveAssetHoldings.js";
import logger from "../../../../logger.js";

export default async function assetHoldingsGet(fastify: FastifyInstance) {
    fastify.route<{
        Params: AssetIdParam;
        Reply: AssetHoldingsResponse | AssetHoldingsNotFound;
    }>({
        method: "GET",
        url: "/assets/:assetId/holdings",
        schema: {
            params: assetIdParamSchema,
            response: {
                200: assetHoldingsResponseSchema,
                404: assetHoldingsNotFoundSchema,
            },
        },
        handler: async (request, reply) => {
            const { assetId } = request.params;

            try {
                const holdings = await retrieveAssetHoldings(assetId);

                if (holdings.length === 0) {
                    return reply
                        .status(404)
                        .send({ message: "assetHoldingsNotFound" });
                }

                return reply.status(200).send({ data: holdings });
            } catch (error) {
                logger.error(
                    { error, assetId },
                    "Error retrieving asset holdings",
                );

                throw error;
            }
        },
    });
}
