import { Type } from "@sinclair/typebox";
import type { FastifyInstance } from "fastify";
import logger from "../../../../logger.js";
import { fetchCurrentPrice } from "../../fetchCurrentPrice.js";
import { assetDetailsByIdQuery } from "../details/[assetId].details.get.js";
import {
	type AssetIdParam,
	type AssetNotFoundResponse,
	assetIdParamSchema,
	assetNotFoundSchema,
} from "../details/assetDetailsSchema.js";
import {
	type PriceNotFoundResponse,
	type PriceResponse,
	priceNotFoundSchema,
	priceResponse,
} from "../historic-price/[assetId].historic-price.get.js";

export default async function currentAssetPriceGet(fastify: FastifyInstance) {
	fastify.route<{
		Params: AssetIdParam;
		Reply: PriceResponse | PriceNotFoundResponse | AssetNotFoundResponse;
	}>({
		method: "GET",
		url: "assets/:assetId/current-price",
		schema: {
			params: assetIdParamSchema,
			response: {
				200: priceResponse,
				404: Type.Union([priceNotFoundSchema, assetNotFoundSchema]),
			},
		},
		handler: async (request, reply) => {
			const { assetId } = request.params;

			try {
				const asset =
					await assetDetailsByIdQuery(assetId).executeTakeFirst();

				if (!asset) {
					return reply.status(404).send({
						message: "assetNotFound",
					});
				}

				const currentPrice = await fetchCurrentPrice(
					asset.symbol,
					asset.countryId,
					asset.assetType === "CRYPTOCURRENCY",
				);

				if (!currentPrice?.currentPrice) {
					return reply.status(404).send({
						message: "priceNotFound",
					});
				}

				return reply.status(200).send({
					data: {
						price: currentPrice.currentPrice,
					},
				});
			} catch (error) {
				logger.error(
					{ error },
					"Error fetching current price for asset",
				);
				throw error;
			}
		},
	});
}
