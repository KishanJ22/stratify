import { FastifyInstance } from "fastify";
import dataApiClient from "../../../lib/api/data-api-client.js";
import logger from "../../../logger.js";
import { getFromStore } from "../../../plugins/localStorage.js";

import { fetchAssetDetailsQuery } from "./fetch-asset-details.js";
import {
    topAssetsResponseSchema,
    TopAssetsSuccessResponse,
} from "./top-assets-schema.js";
import { formatTopAssetDetails } from "./format-top-assets.js";

export default function mostActiveGet(fastify: FastifyInstance) {
    fastify.route<{
        Reply: TopAssetsSuccessResponse;
    }>({
        method: "GET",
        url: "/data/market/most-active",
        schema: {
            response: {
                200: topAssetsResponseSchema,
            },
        },
        handler: async (_request, reply) => {
            const requestId = getFromStore("requestId") as string;

            try {
                logger.info(
                    { requestId },
                    "Fetching most active from data API",
                );
                const mostActiveData = await dataApiClient
                    .GET("/market/most-active")
                    .then((res) => res.data?.data);

                const assetDetails = mostActiveData?.map(async (asset) => {
                    const assetDetails = await fetchAssetDetailsQuery(
                        asset.symbol,
                    ).executeTakeFirst();

                    //? If asset details are not found, then return null so that it can be filtered out
                    return assetDetails
                        ? formatTopAssetDetails(asset, assetDetails)
                        : null;
                });

                const topLoserAssets = (
                    await Promise.all(assetDetails || [])
                ).filter((asset) => asset !== null);

                return reply.status(200).send({
                    data: topLoserAssets,
                });
            } catch (error) {
                logger.error({ error }, "Error fetching top losers");
                throw error;
            }
        },
    });
}
