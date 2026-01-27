import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import logger from "../../logger.js";
import { getFromStore } from "../../plugins/localStorage.js";
import { UserDetails } from "../../utils/decodeToken.js";
import db from "../../database/db.js";

const portfolioSchema = Type.Object({
    id: Type.Number(),
    name: Type.String(),
});

const successResponseSchema = Type.Object({
    data: Type.Array(portfolioSchema),
});

type SuccessResponse = Static<typeof successResponseSchema>;

const notFoundSchema = Type.Object({
    message: Type.Literal("noPortfoliosFound"),
});

type NotFoundResponse = Static<typeof notFoundSchema>;

const fetchPortfolios = (userId: string) => {
    return db
        .selectFrom("stratify.portfolios")
        .where("userId", "=", userId)
        .select(["id", "name"]);
};

export default function portfolioListGet(fastify: FastifyInstance) {
    fastify.route<{
        Reply: SuccessResponse | NotFoundResponse;
    }>({
        method: "GET",
        url: "/portfolios",
        schema: {
            response: {
                200: successResponseSchema,
                404: notFoundSchema,
            },
        },
        handler: async (_request, reply) => {
            try {
                const { userId } = getFromStore("user") as UserDetails;

                const portfolios = await fetchPortfolios(userId).execute();

                if (portfolios.length === 0) {
                    return reply
                        .status(404)
                        .send({ message: "noPortfoliosFound" });
                }

                return reply.status(200).send({ data: portfolios });
            } catch (error) {
                logger.error({ error }, "Error fetching portfolios");
                throw error;
            }
        },
    });
}
