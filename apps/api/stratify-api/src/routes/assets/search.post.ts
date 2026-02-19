import { FastifyInstance } from "fastify";
import logger from "../../logger.js";
import db from "../../database/db.js";
import { InferResult, sql } from "kysely";
import {
    BadRequestResponse,
    badRequestSchema,
    NotFoundResponse,
    notFoundSchema,
    searchAssetsRequestBody,
    SearchAssetsRequestBody,
    searchAssetsResponseSchema,
    SearchAssetsSuccessResponse,
} from "./search-schemas.js";
import { formatSearchAsset } from "./formatSearchAsset.js";
import { fetchCurrentPrice } from "./fetch-current-price.js";

const assetsSearchQuery = (query: string) => {
    return db
        .selectFrom("stratify.assets as assets")
        .where((eb) =>
            eb.and([
                //? Use LOWER to turn the asset name and symbol to lowercase for case-insensitive searching
                //? And "like" keyword for partial string matching
                eb.or([
                    eb(sql<string>`LOWER(assets.name)`, "like", query + "%"),
                    eb(sql<string>`LOWER(assets.symbol)`, "like", query + "%"),
                ]),
                //! Filter out currencies otherwise there will be too many assets sent to the data API which will timeout
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

const searchAssets = async (query: string) => {
    try {
        const assetsFromDb = await assetsSearchQuery(query).execute();

        const formattedAssets = await Promise.all(
            assetsFromDb.map(async (asset) => {
                const currentPriceData = await fetchCurrentPrice(
                    asset.symbol,
                    asset.countryId,
                );

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
        Reply:
            | SearchAssetsSuccessResponse
            | BadRequestResponse
            | NotFoundResponse;
    }>({
        method: "POST",
        url: "/assets/search",
        schema: {
            body: searchAssetsRequestBody,
            response: {
                200: searchAssetsResponseSchema,
                400: badRequestSchema,
                404: notFoundSchema,
            },
        },
        handler: async (request, reply) => {
            try {
                const { query } = request.body;

                //? Return 400 bad request if the query is empty or only contains whitespace
                if (!query || query.trim() == "") {
                    return reply
                        .status(400)
                        .send({ message: "invalidSearchQuery" });
                }

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
