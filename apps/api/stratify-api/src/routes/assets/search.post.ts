import { FastifyInstance } from "fastify";
import logger from "../../logger.js";
import db from "../../database/db.js";
import { InferResult, sql } from "kysely";
import { dataApiClient } from "../../lib/api/data-api-client.js";
import {
    NotFoundResponse,
    notFoundSchema,
    searchAssetsRequestBody,
    SearchAssetsRequestBody,
    searchAssetsResponseSchema,
    SearchAssetsSuccessResponse,
} from "./search-schemas.js";
import { formatSearchAsset } from "./formatSearchAsset.js";

const assetsSearchQuery = (query: string) => {
    return db
        .selectFrom("stratify.assets as assets")
        .where((eb) =>
            eb.and([
                eb.or([
                    eb(sql<string>`LOWER(assets.name)`, "like", query + "%"),
                    eb(sql<string>`LOWER(assets.symbol)`, "like", query + "%"),
                ]),
                eb("assets.type", "!=", "CURRENCY"),
            ]),
        )
        .select([
            "assets.name as name",
            "assets.symbol as symbol",
            "assets.currency as currency",
            "assets.type as assetType",
            "assets.countryId as countryId",
        ]);
};

export type DbSearchAsset = InferResult<
    ReturnType<typeof assetsSearchQuery>
>[number];

const fetchAssetPrice = async (asset: DbSearchAsset) => {
    // Append .L for London Stock Exchange assets (UK assets)
    const symbol = asset.countryId === 223 ? `${asset.symbol}-L` : asset.symbol;

    try {
        const response = await dataApiClient()
            .GET("/assets/{symbol}/current-price", {
                params: {
                    path: {
                        symbol,
                    },
                },
            })
            .then((res) => res.data?.data);

        return response;
    } catch (error) {
        logger.error(
            {
                error,
                symbol,
            },
            "Error fetching asset price for symbol",
        );
        throw error;
    }
};

const searchAssets = async (query: string) => {
    try {
        const assetsFromDb = await assetsSearchQuery(query).execute();

        const formattedAssets = await Promise.all(
            assetsFromDb.map(async (asset) => {
                const currentPriceData = await fetchAssetPrice(asset);

                return formatSearchAsset(asset, currentPriceData);
            }),
        );

        return formattedAssets;
    } catch (error) {
        logger.error({ error }, "Error searching for assets");
    }
};

export default async function searchAssetsPost(fastify: FastifyInstance) {
    fastify.route<{
        Body: SearchAssetsRequestBody;
        Reply: SearchAssetsSuccessResponse | NotFoundResponse;
    }>({
        method: "POST",
        url: "/assets/search",
        schema: {
            body: searchAssetsRequestBody,
            response: {
                200: searchAssetsResponseSchema,
                404: notFoundSchema,
            },
        },
        handler: async (request, reply) => {
            try {
                const { query } = request.body;

                const assets = await searchAssets(query.toLowerCase());

                if (assets?.length === 0 || assets === undefined) {
                    return reply.status(404).send({ message: "noAssetsFound" });
                }

                return reply.status(200).send({ data: assets });
            } catch (error) {
                logger.error({ error }, "Error searching for assets");
                throw error;
            }
        },
    });
}
