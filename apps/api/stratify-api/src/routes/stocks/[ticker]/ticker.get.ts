import type { FastifyInstance } from "fastify";
import logger from "../../../logger.js";
import { Static, Type } from "@sinclair/typebox";
import { getFromStore } from "../../../plugins/localStorage.js";

const paramsSchema = Type.Object({
    ticker: Type.String({ description: "The stock ticker symbol" }),
});

type Params = Static<typeof paramsSchema>;

const ticker = Type.Object({
    ticker: Type.String(),
    name: Type.String(),
    price: Type.Number(),
});

type Ticker = Static<typeof ticker>;

const responseSchema = Type.Object({
    data: Type.Union([ticker, Type.Null()]),
});

type Response = Static<typeof responseSchema>;

async function getTicker(ticker: string) {
    return {
        ticker: ticker,
        name: "A company",
        price: 123.45,
    } satisfies Ticker;
}

export default async function stockTickerGet(fastify: FastifyInstance) {
    fastify.route<{ Params: Params; Reply: Response }>({
        method: "GET",
        url: "/stocks/:ticker",
        schema: {
            params: paramsSchema,
            response: {
                200: responseSchema,
            },
        },
        handler: async (request, reply) => {
            try {
                const { ticker } = request.params;
                const user = getFromStore("user");

                logger.info({ user }, "User details");

                const tickerData = await getTicker(ticker);

                return reply.status(200).send({ data: tickerData });
            } catch (error) {
                logger.error("Error fetching ticker data");
                throw error;
            }
        },
    });
}
