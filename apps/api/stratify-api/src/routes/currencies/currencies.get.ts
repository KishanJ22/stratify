import { Static, Type } from "@sinclair/typebox";
import db from "../../database/db.js";
import { FastifyInstance } from "fastify";
import logger from "../../logger.js";

const successResponseSchema = Type.Object({
    data: Type.Array(
        Type.Object({
            code: Type.String(),
            name: Type.String(),
        }),
    ),
});

type SuccessResponse = Static<typeof successResponseSchema>;

const fetchCurrencies = () =>
    db
        .selectFrom("stratify.currencies")
        .select([
            "stratify.currencies.code as code",
            "stratify.currencies.name as name",
        ]);

export default async function currenciesGet(fastify: FastifyInstance) {
    fastify.route<{
        Reply: SuccessResponse;
    }>({
        method: "GET",
        url: "/currencies",
        schema: {
            response: {
                200: successResponseSchema,
            },
        },
        handler: async (_request, reply) => {
            try {
                const currencies = await fetchCurrencies().execute();

                return reply.status(200).send({ data: currencies });
            } catch (error) {
                logger.error({ error }, "Error fetching currencies");
                throw error;
            }
        },
    });
}
