import { FastifyInstance } from "fastify";
import {
    PortfolioIdParam,
    portfolioIdParamSchema,
} from "../investments/investments.schema.js";
import logger from "../../../../logger.js";
import { Static, Type } from "@sinclair/typebox";
import { createNotFound } from "../../../../utils/createNotFoundSchema.js";
import { calculatePortfolioValueHistory } from "./calculateValueHistory.js";

const valueHistorySchema = Type.Object({
    portfolioValue: Type.Number(),
    date: Type.String(),
});
export type ValueHistory = Static<typeof valueHistorySchema>;

const portfolioValueHistorySuccessSchema = Type.Object({
    data: Type.Array(valueHistorySchema),
});
type PortfolioValueHistorySuccessResponse = Static<
    typeof portfolioValueHistorySuccessSchema
>;

const notFoundSchema = createNotFound("portfolioNotFound");
type NotFoundResponse = Static<typeof notFoundSchema>;

export default async function portfolioValueHistoryGet(
    fastify: FastifyInstance,
) {
    fastify.route<{
        Params: PortfolioIdParam;
        Reply: PortfolioValueHistorySuccessResponse | NotFoundResponse;
    }>({
        method: "GET",
        url: "/portfolios/:portfolioId/value-history",
        schema: {
            params: portfolioIdParamSchema,
            response: {
                200: portfolioValueHistorySuccessSchema,
                404: notFoundSchema,
            },
        },
        handler: async (request, reply) => {
            try {
                const { portfolioId } = request.params;

                const valueHistory =
                    await calculatePortfolioValueHistory(portfolioId);

                if (valueHistory.length === 0) {
                    return reply.status(404).send({
                        message: "portfolioNotFound",
                    });
                }

                return reply.status(200).send({ data: valueHistory });
            } catch (error) {
                logger.error(
                    { error },
                    "Error fetching value history for portfolio",
                );

                throw error;
            }
        },
    });
}
