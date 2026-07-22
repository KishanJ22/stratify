import { FastifyInstance } from "fastify";
import {
    checkPortfolioNameExists,
    PortfolioNameAlreadyExistsResponse,
    portfolioNameAlreadyExistsResponseSchema,
    RequestBody,
    requestBodySchema,
} from "../create.post.js";
import logger from "../../../logger.js";
import { getFromStore } from "../../../plugins/localStorage.js";
import { UserDetails } from "../../../utils/decodeToken.js";
import db from "../../../database/db.js";
import {
    PortfolioIdParam,
    portfolioIdParamSchema,
} from "./investments/investmentSchema.js";
import { Type } from "@sinclair/typebox";
import {
    PortfolioNotFoundResponse,
    portfolioNotFoundSchema,
} from "./metrics/[portfolioId].metrics.get.js";
import { portfolioExistsForUserCheck } from "./portfolioExistsQuery.js";

const updatePortfolio = (userId: string, name: string, portfolioId: number) =>
    db
        .updateTable("stratify.portfolios")
        .set({
            name: name.toLowerCase(),
        })
        .where("stratify.portfolios.id", "=", portfolioId)
        .where("stratify.portfolios.userId", "=", userId);

export default async function portfolioRenamePatch(fastify: FastifyInstance) {
    fastify.route<{
        Body: RequestBody;
        Params: PortfolioIdParam;
        Reply:
            | {}
            | PortfolioNameAlreadyExistsResponse
            | PortfolioNotFoundResponse;
    }>({
        method: "PATCH",
        url: "/portfolios/:portfolioId",
        schema: {
            body: requestBodySchema,
            params: portfolioIdParamSchema,
            response: {
                204: {},
                400: portfolioNameAlreadyExistsResponseSchema,
                404: portfolioNotFoundSchema,
            },
        },
        handler: async (request, reply) => {
            const { name } = request.body;
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

                const isPortfolioNameAlreadyExists =
                    await checkPortfolioNameExists(userId, name)
                        .where("stratify.portfolios.id", "!=", portfolioId)
                        .executeTakeFirst();

                if (isPortfolioNameAlreadyExists) {
                    return reply.status(400).send({
                        message: "portfolioNameAlreadyExists",
                    });
                }

                await updatePortfolio(
                    userId,
                    name,
                    portfolioId,
                ).executeTakeFirstOrThrow();

                return reply.status(204).send({});
            } catch (error) {
                logger.error({ error }, "Error updating portfolio");
                throw error;
            }
        },
    });
}
