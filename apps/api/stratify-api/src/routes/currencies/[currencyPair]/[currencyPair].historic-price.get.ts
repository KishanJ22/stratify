import { type Static, Type } from "@sinclair/typebox";
import type { FastifyInstance } from "fastify";
import db from "../../../database/db.js";
import logger from "../../../logger.js";
import { toTwoDecimalPoints } from "../../../utils/toTwoDecimalPoints.js";
import {
	type HistoricPriceQuery,
	historicPriceQuery,
	type InvalidTradeDateResponse,
	invalidTradeDateSchema,
	type PriceNotFoundResponse,
	type PriceResponse,
	priceNotFoundSchema,
	priceResponse,
} from "../../assets/[assetId]/historic-price/[assetId].historic-price.get.js";

const historicPriceParams = Type.Object({
	currencyPair: Type.String(),
});

type HistoricPriceParams = Static<typeof historicPriceParams>;

const historicPriceDbQuery = (currencyPair: string, tradeDate: Date) =>
	db
		.selectFrom("stratify.assetPrices as assetPrices")
		.innerJoin(
			"stratify.assets as assets",
			"assets.id",
			"assetPrices.assetId",
		)
		.where("assets.symbol", "=", currencyPair)
		.where("assetPrices.priceDate", "=", tradeDate)
		.select("assetPrices.closePrice as price");

export default async function historicCurrencyPairPriceGet(
	fastify: FastifyInstance,
) {
	fastify.route<{
		Params: HistoricPriceParams;
		Reply: PriceResponse | PriceNotFoundResponse | InvalidTradeDateResponse;
		Querystring: HistoricPriceQuery;
	}>({
		method: "GET",
		url: "currencies/:currencyPair/historic-price",
		schema: {
			params: historicPriceParams,
			querystring: historicPriceQuery,
			response: {
				200: priceResponse,
				400: invalidTradeDateSchema,
				404: priceNotFoundSchema,
			},
		},
		handler: async (request, reply) => {
			const { currencyPair } = request.params;
			const { tradeDate } = request.query;
			const now = new Date();

			try {
				if (
					Number.isNaN(Date.parse(tradeDate)) ||
					new Date(tradeDate) > now
				) {
					return reply.status(400).send({
						message: "invalidTradeDate",
					});
				}

				const historicPrice = await historicPriceDbQuery(
					currencyPair,
					new Date(tradeDate),
				).executeTakeFirst();

				if (!historicPrice) {
					return reply.status(404).send({
						message: "priceNotFound",
					});
				}

				return reply.status(200).send({
					data: {
						price: toTwoDecimalPoints(
							parseFloat(historicPrice.price),
						),
					},
				});
			} catch (error) {
				logger.error(
					{ error },
					"Error fetching historic price for currency pair",
				);
				throw error;
			}
		},
	});
}
