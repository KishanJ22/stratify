import { FastifyInstance } from "fastify";
import logger from "../../logger.js";
import db from "../../database/db.js";
import { InferResult, sql } from "kysely";
import { dataApiClient } from "../../lib/api/data-api-client.js";
import {
    NotFoundResponse,
    notFoundSchema,
    SearchAsset,
    searchAssetsRequestBody,
    SearchAssetsRequestBody,
    searchAssetsResponseSchema,
    SearchAssetsSuccessResponse,
} from "./search-schemas.js";
import type { AssetType } from "../../schemas/common-schemas.js";

const assetsSearchQuery = (query: string) => {
    return db
        .selectFrom("stratify.assets as assets")
        .where((eb) =>
            eb.or([
                eb(sql<string>`LOWER(assets.name)`, "like", query + "%"),
                eb(sql<string>`LOWER(assets.symbol)`, "like", query + "%"),
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

type DbAsset = InferResult<ReturnType<typeof assetsSearchQuery>>[number];

const retrieveStockDetails = async (asset: DbAsset) => {
    // Append .L for London Stock Exchange assets (UK assets)
    const symbol = asset.countryId === 223 ? `${asset.symbol}.L` : asset.symbol;

    try {
        const assetDetails = await dataApiClient()
            .GET("/stocks/{symbol}", {
                params: {
                    path: {
                        symbol,
                    },
                },
            })
            .then((response) => response.data?.data);

        return assetDetails;
    } catch (error) {
        logger.error({ error, symbol }, "Error retrieving stock details");
    }
};

const retrieveCryptoDetails = async (asset: DbAsset) => {
    try {
        const assetDetails = await dataApiClient()
            .GET("/cryptocurrencies/{symbol}", {
                params: {
                    path: {
                        symbol: asset.symbol,
                    },
                },
            })
            .then((response) => response.data?.data);

        return assetDetails;
    } catch (error) {
        logger.error({ error }, "Error retrieving crypto details");
    }
};

const retrieveFundDetails = async (asset: DbAsset) => {
    const symbol = asset.countryId === 223 ? `${asset.symbol}.L` : asset.symbol;

    try {
        const assetDetails = await dataApiClient()
            .GET("/funds/{symbol}", {
                params: {
                    path: {
                        symbol,
                    },
                },
            })
            .then((response) => response.data?.data);

        return assetDetails;
    } catch (error) {
        logger.error({ error }, "Error retrieving fund details");
    }
};

const searchAssets = async (query: string) => {
    try {
        const assetsFromDb = await assetsSearchQuery(query).execute();

        const assetsWithPriceDetails = await Promise.all(
            assetsFromDb.map(async (asset) => {
                const assetType = asset.assetType as AssetType;

                if (assetType === "STOCK") {
                    const assetDetails = await retrieveStockDetails(asset);

                    return {
                        ...asset,
                        assetType,
                        currentPrice:
                            assetDetails?.priceDetails.currentPrice ?? null,
                        priceChange:
                            assetDetails?.priceDetails.dayTradingActivity
                                .change ?? null,
                        priceChangePercent:
                            assetDetails?.priceDetails.dayTradingActivity
                                .changePercent ?? null,
                    } satisfies SearchAsset;
                }

                if (assetType === "CRYPTOCURRENCY") {
                    const assetDetails = await retrieveCryptoDetails(asset);

                    return {
                        ...asset,
                        assetType,
                        currentPrice:
                            assetDetails?.priceDetails.currentPrice ?? null,
                        priceChange:
                            assetDetails?.priceDetails.dayTradingActivity
                                .change ?? null,
                        priceChangePercent:
                            assetDetails?.priceDetails.dayTradingActivity
                                .changePercent ?? null,
                    } satisfies SearchAsset;
                }

                if (assetType === "ETF") {
                    const assetDetails = await retrieveFundDetails(asset);

                    return {
                        ...asset,
                        assetType,
                        currentPrice:
                            assetDetails?.priceDetails.currentPrice ?? null,
                        priceChange:
                            assetDetails?.priceDetails.dayTradingActivity
                                .change ?? null,
                        priceChangePercent:
                            assetDetails?.priceDetails.dayTradingActivity
                                .changePercent ?? null,
                    } satisfies SearchAsset;
                }

                return null;
            }),
        );

        const filteredAssets = assetsWithPriceDetails.filter(
            (asset) => asset !== null,
        );

        return filteredAssets satisfies SearchAsset[];
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
