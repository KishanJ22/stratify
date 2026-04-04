import { FastifyInstance } from "fastify";
import logger from "../../../../logger.js";
import {
    AssetDetails,
    AssetDetailsSuccessResponse,
    AssetIdParam,
    assetIdParamSchema,
    AssetNotFoundResponse,
    assetNotFoundSchema,
    successResponseSchema,
} from "./assetDetailsSchema.js";
import db from "../../../../database/db.js";
import { MarketState } from "../../../../schemas/common-schemas.js";
import { InferResult } from "kysely";
import { fetchCryptocurrencyDetails } from "./yahoo-asset-details/fetchCryptocurrencyDetails.js";
import { fetchStockDetails } from "./yahoo-asset-details/fetchStockDetails.js";
import { fetchFundDetails } from "./yahoo-asset-details/fetchFundDetails.js";
import {
    formatBaseAssetDetails,
    formatPriceDetails,
} from "./formatAssetDetails.js";

const assetExistsQuery = (assetId: number) =>
    db.selectFrom("stratify.assets").where("id", "=", assetId).select("id");

export const assetDetailsByIdQuery = (assetId: number) =>
    db
        .selectFrom("stratify.assets")
        .where("id", "=", assetId)
        .select([
            "id as assetId",
            "name",
            "symbol",
            "countryId",
            "currency",
            "type as assetType",
        ]);

export type DbAssetDetails = InferResult<
    ReturnType<typeof assetDetailsByIdQuery>
>[number];

const retrieveAssetDetails = async (assetId: number) => {
    const assetDetailsDb =
        await assetDetailsByIdQuery(assetId).executeTakeFirstOrThrow();

    const formattedAssetDetails = formatBaseAssetDetails(assetDetailsDb);

    if (assetDetailsDb.assetType === "CRYPTOCURRENCY") {
        const cryptocurrencyDetailsYahoo = await fetchCryptocurrencyDetails(
            assetDetailsDb.symbol,
            "USD",
        );

        if (cryptocurrencyDetailsYahoo) {
            const formattedPriceDetails = formatPriceDetails(
                cryptocurrencyDetailsYahoo.priceDetails.dayTradingActivity,
            );

            return {
                ...formattedAssetDetails,
                marketState:
                    cryptocurrencyDetailsYahoo?.marketState as MarketState,
                industry: null,
                sector: null,
                ...formattedPriceDetails,
            } satisfies AssetDetails;
        }
    }

    if (assetDetailsDb.assetType === "STOCK") {
        const stockDetailsYahoo = await fetchStockDetails(
            assetDetailsDb.symbol,
            assetDetailsDb.countryId,
        );

        if (stockDetailsYahoo) {
            const formattedPriceDetails = formatPriceDetails(
                stockDetailsYahoo.priceDetails.dayTradingActivity,
            );

            return {
                ...formattedAssetDetails,
                marketState: stockDetailsYahoo?.marketState as MarketState,
                industry: stockDetailsYahoo?.industryDetails.industry ?? null,
                sector: stockDetailsYahoo?.industryDetails.sector
                    ? [
                          {
                              sector:
                                  stockDetailsYahoo?.industryDetails.sector ??
                                  null,
                              weight: 1,
                          },
                      ]
                    : null,
                ...formattedPriceDetails,
            } satisfies AssetDetails;
        }
    }

    if (assetDetailsDb.assetType === "ETF") {
        const fundDetailsYahoo = await fetchFundDetails(
            assetDetailsDb.symbol,
            assetDetailsDb.countryId,
        );

        if (fundDetailsYahoo) {
            const formattedPriceDetails = formatPriceDetails(
                fundDetailsYahoo.priceDetails.dayTradingActivity,
            );

            return {
                ...formattedAssetDetails,
                marketState: fundDetailsYahoo?.marketState as MarketState,
                industry: null,
                sector: fundDetailsYahoo?.sectorWeights
                    ? fundDetailsYahoo.sectorWeights.map((sector) => ({
                          sector: sector.sector,
                          weight: sector.weight,
                      }))
                    : null,
                ...formattedPriceDetails,
            } satisfies AssetDetails;
        }
    }
};

export default async function assetDetailsGet(fastify: FastifyInstance) {
    fastify.route<{
        Params: AssetIdParam;
        Reply: AssetDetailsSuccessResponse | AssetNotFoundResponse;
    }>({
        method: "GET",
        url: "/assets/:assetId/details",
        schema: {
            params: assetIdParamSchema,
            response: {
                200: successResponseSchema,
                404: assetNotFoundSchema,
            },
        },
        handler: async (request, reply) => {
            try {
                const { assetId } = request.params;

                const assetExists =
                    await assetExistsQuery(assetId).executeTakeFirst();

                if (!assetExists) {
                    return reply.status(404).send({ message: "assetNotFound" });
                }

                const assetDetails = await retrieveAssetDetails(assetId);

                if (assetDetails) {
                    return reply.status(200).send({ data: assetDetails });
                }
            } catch (error) {
                logger.error({ error }, "Error fetching asset details");
                throw error;
            }
        },
    });
}
