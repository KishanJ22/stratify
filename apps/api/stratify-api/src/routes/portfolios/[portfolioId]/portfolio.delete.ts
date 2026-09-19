import { FastifyInstance } from "fastify";
import db from "../../../database/db.js";
import {
    PortfolioIdParam,
    portfolioIdParamSchema,
} from "./investments/investmentSchema.js";
import {
    PortfolioNotFoundResponse,
    portfolioNotFoundSchema,
} from "./metrics/[portfolioId].metrics.get.js";
import logger from "../../../logger.js";
import { getFromStore } from "../../../plugins/localStorage.js";
import { UserDetails } from "../../../utils/decodeToken.js";
import { portfolioExistsForUserCheck } from "./portfolioExistsQuery.js";

const deletePortfolio = (userId: string, portfolioId: number) =>
    db
        .deleteFrom("stratify.portfolios")
        .where("stratify.portfolios.id", "=", portfolioId)
        .where("stratify.portfolios.userId", "=", userId);

export default async function portfolioDelete(fastify: FastifyInstance) {
    fastify.route<{
        Params: PortfolioIdParam;
        Reply: {} | PortfolioNotFoundResponse;
    }>({
        method: "DELETE",
        url: "/portfolios/:portfolioId",
        schema: {
            params: portfolioIdParamSchema,
            response: {
                204: {},
                404: portfolioNotFoundSchema,
            },
        },
        handler: async (request, reply) => {
            const { portfolioId } = request.params;

            try {
                const { userId } = getFromStore("user") as UserDetails;

                const isPortfolioValid = await portfolioExistsForUserCheck(
                    portfolioId,
                    userId,
                ).executeTakeFirst();

                if (!isPortfolioValid) {
                    return reply.status(404).send({
                        message: "portfolioNotFound",
                    });
                }

                await deletePortfolio(
                    userId,
                    portfolioId,
                ).executeTakeFirstOrThrow();

                return reply.status(204).send({});
            } catch (error) {
                logger.error({ error }, "Failed to delete portfolio");
            }
        },
    });
}
