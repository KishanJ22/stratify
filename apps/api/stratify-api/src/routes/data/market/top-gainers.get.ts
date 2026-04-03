import { FastifyInstance } from "fastify";
import logger from "../../../logger.js";
import { getFromStore } from "../../../plugins/localStorage.js";

import { assetDetailsBySymbolQuery } from "./assetDetailsBySymbolQuery.js";
import {
    topAssetsResponseSchema,
    TopAssetsSuccessResponse,
} from "./topAssetSchema.js";
import { formatTopAssetDetails } from "./formatTopAsset.js";
import { dataApiClient } from "../../../lib/api/data-api-client.js";
import { createNotFound } from "../../../utils/createNotFoundSchema.js";
import type { Static } from "@sinclair/typebox";

const topGainersNotFound = createNotFound("noTopGainersData");

type TopGainersNotFound = Static<typeof topGainersNotFound>;

export default function topGainersGet(fastify: FastifyInstance) {
    fastify.route<{
        Reply: TopAssetsSuccessResponse | TopGainersNotFound;
    }>({
        method: "GET",
        url: "/data/market/top-gainers",
        schema: {
            response: {
                200: topAssetsResponseSchema,
                404: topGainersNotFound,
            },
        },
        handler: async (_request, reply) => {
            const requestId = getFromStore("requestId") as string;

            try {
                logger.info(
                    { requestId },
                    "Fetching top gainers from data API",
                );
                const topGainersData = await dataApiClient()
                    .GET("/market/top-gainers", {
                        params: {
                            query: {
                                limit: 10,
                                minimumVolume: 2000000, // 2 million volume
                            },
                        },
                    })
                    .then((res) => res.data?.data);

                const assetDetails = topGainersData?.map(async (asset) => {
                    const assetDetails = await assetDetailsBySymbolQuery(
                        asset.symbol,
                        asset.assetType,
                    ).executeTakeFirst();

                    //? If asset details are not found, then return null so that it can be filtered out
                    return assetDetails
                        ? formatTopAssetDetails(asset, assetDetails)
                        : null;
                });

                const topGainerAssets = (
                    await Promise.all(assetDetails || [])
                ).filter((asset) => asset !== null);

                if (topGainerAssets.length === 0) {
                    return reply
                        .status(404)
                        .send({ message: "noTopGainersData" });
                }

                return reply.status(200).send({
                    data: topGainerAssets,
                });
            } catch (error) {
                logger.error({ error }, "Error fetching top gainers");
                throw error;
            }
        },
    });
}
