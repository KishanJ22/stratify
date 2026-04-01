import { FastifyInstance } from "fastify";
import logger from "../../../../logger.js";
import {
    InvestmentsNotFound,
    investmentsNotFoundSchema,
    InvestmentsResponse,
    investmentsResponseSchema,
    PortfolioIdParam,
    portfolioIdParamSchema,
} from "./investmentSchema.js";
import { retrieveInvestments } from "./retrievePortfolioInvestments.js";

export default async function portfolioInvestmentsGet(
    fastify: FastifyInstance,
) {
    fastify.route<{
        Params: PortfolioIdParam;
        Reply: InvestmentsResponse | InvestmentsNotFound;
    }>({
        method: "GET",
        url: "/portfolios/:portfolioId/investments",
        schema: {
            params: portfolioIdParamSchema,
            response: {
                200: investmentsResponseSchema,
                404: investmentsNotFoundSchema,
            },
        },
        handler: async (request, reply) => {
            try {
                const { portfolioId } = request.params;

                const investments = await retrieveInvestments(portfolioId);

                if (investments.length === 0) {
                    return reply.status(404).send({
                        message: "investmentsNotFound",
                    });
                }

                return reply.status(200).send({
                    data: investments,
                });
            } catch (error) {
                logger.error(
                    { error },
                    "Error fetching investments for portfolio",
                );

                throw error;
            }
        },
    });
}
