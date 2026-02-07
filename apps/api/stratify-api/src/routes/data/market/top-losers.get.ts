import { FastifyInstance } from "fastify";
import logger from "../../../logger.js";
import { getFromStore } from "../../../plugins/localStorage.js";

import { fetchAssetDetailsQuery } from "./fetch-asset-details.js";
import {
    topAssetsResponseSchema,
    TopAssetsSuccessResponse,
} from "./top-assets-schema.js";
import { formatTopAssetDetails } from "./format-top-assets.js";
import { dataApiClient } from "../../../lib/api/data-api-client.js";
import { createNotFound } from "../../../utils/createNotFoundSchema.js";
import type { Static } from "@sinclair/typebox";

const topLosersNotFound = createNotFound("noTopLosersData");

type TopLosersNotFound = Static<typeof topLosersNotFound>;

export default function topLosersGet(fastify: FastifyInstance) {
    fastify.route<{
        Reply: TopAssetsSuccessResponse | TopLosersNotFound;
    }>({
        method: "GET",
        url: "/data/market/top-losers",
        schema: {
            response: {
                200: topAssetsResponseSchema,
                404: topLosersNotFound,
            },
        },
        handler: async (_request, reply) => {
            const requestId = getFromStore("requestId") as string;

            try {
                logger.info({ requestId }, "Fetching top losers from data API");
                const topLosersData = await dataApiClient()
                    .GET("/market/top-losers")
                    .then((res) => res.data?.data);

                const assetDetails = topLosersData?.map(async (asset) => {
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

                if (topLoserAssets.length === 0) {
                    return reply
                        .status(404)
                        .send({ message: "noTopLosersData" });
                }

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
