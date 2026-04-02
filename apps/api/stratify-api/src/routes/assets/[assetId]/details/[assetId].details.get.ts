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
import { AssetType, MarketState } from "../../../../schemas/common-schemas.js";
import { InferResult } from "kysely";
import { fetchCryptocurrencyDetails } from "./yahoo-asset-details/fetchCryptocurrencyDetails.js";
import { fetchStockDetails } from "./yahoo-asset-details/fetchStockDetails.js";
import { fetchFundDetails } from "./yahoo-asset-details/fetchFundDetails.js";

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

    if (assetDetailsDb.assetType === "CRYPTOCURRENCY") {
        const cryptocurrencyDetailsYahoo = await fetchCryptocurrencyDetails(
            assetDetailsDb.symbol,
            "USD",
        );

        return {
            assetId: assetDetailsDb.assetId,
            name: assetDetailsDb.name,
            symbol: assetDetailsDb.symbol,
            countryId: assetDetailsDb.countryId,
            currency: assetDetailsDb.currency,
            assetType: assetDetailsDb.assetType as AssetType,
            marketState: cryptocurrencyDetailsYahoo?.marketState as MarketState,
            industry: null,
            sector: null,
            dayTradingActivity: {
                open:
                    cryptocurrencyDetailsYahoo?.priceDetails.dayTradingActivity
                        .open ?? null,
                close:
                    cryptocurrencyDetailsYahoo?.priceDetails.dayTradingActivity
                        .close ?? null,
                high:
                    cryptocurrencyDetailsYahoo?.priceDetails.dayTradingActivity
                        .high ?? null,
                low:
                    cryptocurrencyDetailsYahoo?.priceDetails.dayTradingActivity
                        .low ?? null,
                priceChange:
                    cryptocurrencyDetailsYahoo?.priceDetails.dayTradingActivity
                        .change ?? null,
                priceChangePercent:
                    cryptocurrencyDetailsYahoo?.priceDetails.dayTradingActivity
                        .changePercent ?? null,
            },
        } satisfies AssetDetails;
    }

    if (assetDetailsDb.assetType === "STOCK") {
        const stockDetailsYahoo = await fetchStockDetails(
            assetDetailsDb.symbol,
            assetDetailsDb.countryId,
        );

        return {
            assetId: assetDetailsDb.assetId,
            name: assetDetailsDb.name,
            symbol: assetDetailsDb.symbol,
            countryId: assetDetailsDb.countryId,
            currency: assetDetailsDb.currency,
            assetType: assetDetailsDb.assetType as AssetType,
            marketState: stockDetailsYahoo?.marketState as MarketState,
            industry: stockDetailsYahoo?.industryDetails.industry ?? null,
            sector: stockDetailsYahoo?.industryDetails.sector
                ? [
                      {
                          sector:
                              stockDetailsYahoo?.industryDetails.sector ?? null,
                          weight: 1,
                      },
                  ]
                : null,
            dayTradingActivity: {
                open:
                    stockDetailsYahoo?.priceDetails.dayTradingActivity.open ??
                    null,
                close:
                    stockDetailsYahoo?.priceDetails.dayTradingActivity.close ??
                    null,
                high:
                    stockDetailsYahoo?.priceDetails.dayTradingActivity.high ??
                    null,
                low:
                    stockDetailsYahoo?.priceDetails.dayTradingActivity.low ??
                    null,
                priceChange:
                    stockDetailsYahoo?.priceDetails.dayTradingActivity.change ??
                    null,
                priceChangePercent:
                    stockDetailsYahoo?.priceDetails.dayTradingActivity
                        .changePercent ?? null,
            },
        } satisfies AssetDetails;
    }

    if (assetDetailsDb.assetType === "ETF") {
        const fundDetailsYahoo = await fetchFundDetails(
            assetDetailsDb.symbol,
            assetDetailsDb.countryId,
        );

        return {
            assetId: assetDetailsDb.assetId,
            name: assetDetailsDb.name,
            symbol: assetDetailsDb.symbol,
            countryId: assetDetailsDb.countryId,
            currency: assetDetailsDb.currency,
            assetType: assetDetailsDb.assetType as AssetType,
            marketState: fundDetailsYahoo?.marketState as MarketState,
            industry: null,
            sector: fundDetailsYahoo?.sectorWeights
                ? fundDetailsYahoo.sectorWeights.map((sector) => ({
                      sector: sector.sector,
                      weight: sector.weight,
                  }))
                : null,
            dayTradingActivity: {
                open:
                    fundDetailsYahoo?.priceDetails.dayTradingActivity.open ??
                    null,
                close:
                    fundDetailsYahoo?.priceDetails.dayTradingActivity.close ??
                    null,
                high:
                    fundDetailsYahoo?.priceDetails.dayTradingActivity.high ??
                    null,
                low:
                    fundDetailsYahoo?.priceDetails.dayTradingActivity.low ??
                    null,
                priceChange:
                    fundDetailsYahoo?.priceDetails.dayTradingActivity.change ??
                    null,
                priceChangePercent:
                    fundDetailsYahoo?.priceDetails.dayTradingActivity
                        .changePercent ?? null,
            },
        } satisfies AssetDetails;
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

                const assetDetails = await retrieveAssetDetails(assetId);

                if (!assetDetails) {
                    return reply.status(404).send({ message: "assetNotFound" });
                }

                return reply.status(200).send({ data: assetDetails });
            } catch (error) {
                logger.error({ error }, "Error fetching asset details");
                throw error;
            }
        },
    });
}
