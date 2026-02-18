import { Static, Type } from "@sinclair/typebox";
import db from "../database/db.js";
import { createNotFound } from "../utils/createNotFoundSchema.js";
import { FastifyInstance } from "fastify";
import logger from "../logger.js";

const currencySchema = Type.Object({
    code: Type.String(),
    name: Type.String(),
});

const successResponseSchema = Type.Object({
    data: Type.Array(currencySchema),
});

type SuccessResponse = Static<typeof successResponseSchema>;

const notFoundSchema = createNotFound("noCurrenciesFound");

type NotFoundResponse = Static<typeof notFoundSchema>;

const fetchCurrencies = () =>
    db
        .selectFrom("stratify.currencies")
        .select([
            "stratify.currencies.code as code",
            "stratify.currencies.name as name",
        ]);

export default async function currenciesGet(fastify: FastifyInstance) {
    fastify.route<{
        Reply: SuccessResponse | NotFoundResponse;
    }>({
        method: "GET",
        url: "/currencies",
        schema: {
            response: {
                200: successResponseSchema,
                404: notFoundSchema,
            },
        },
        handler: async (_request, reply) => {
            try {
                const currencies = await fetchCurrencies().execute();

                if (currencies.length === 0) {
                    return reply
                        .status(404)
                        .send({ message: "noCurrenciesFound" });
                }

                return reply.status(200).send({ data: currencies });
            } catch (error) {
                logger.error({ error }, "Error fetching currencies");
                throw error;
            }
        },
    });
}
