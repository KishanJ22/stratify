import { Static, Type } from "@sinclair/typebox";
import { createNotFound } from "../../../utils/createNotFoundSchema.js";
import { FastifyInstance } from "fastify";
import {
    PortfolioIdParam,
    portfolioIdParamSchema,
} from "./investments.schema.js";
import { getFromStore } from "../../../plugins/localStorage.js";
import { UserDetails } from "../../../utils/decodeToken.js";
import { portfolioExistsForUserCheck } from "./portfolioExistsQuery.js";
import { retrieveInvestments } from "./retrievePortfolioInvestments.js";
import { calculateAssetVariance } from "./calculateAssetVariance.js";
import logger from "../../../logger.js";

const portfolioMetrics = Type.Object({
    totalValue: Type.Number(),
    overallReturn: Type.Object({
        percentage: Type.Number(),
        absolute: Type.Number(),
    }),
    riskMetrics: Type.Object({
        volatility: Type.Number(),
        sortinoRatio: Type.Number(),
    }),
});

type PortfolioMetrics = Static<typeof portfolioMetrics>;

const portfolioMetricsResponse = Type.Object({
    data: portfolioMetrics,
});

type PortfolioMetricsResponse = Static<typeof portfolioMetricsResponse>;

const portfolioNotFoundSchema = createNotFound("portfolioNotFound");
type PortfolioNotFoundResponse = Static<typeof portfolioNotFoundSchema>;

const metricsNotFoundSchema = createNotFound("metricsNotFound");
type MetricsNotFoundResponse = Static<typeof metricsNotFoundSchema>;

type NotFoundResponse = PortfolioNotFoundResponse | MetricsNotFoundResponse;

const retrievePortfolioMetrics = async (portfolioId: number) => {
    const investments = await retrieveInvestments(portfolioId);

    if (investments.length === 0) {
        return null;
    }

    const { totalValue, totalPurchaseValue } = investments.reduce(
        (acc, investment) => {
            const currentInvestmentValue = investment.currentValue;

            return {
                totalValue: acc.totalValue + currentInvestmentValue,
                totalPurchaseValue:
                    acc.totalPurchaseValue + investment.totalPurchaseValue,
            };
        },
        {
            totalValue: 0,
            totalPurchaseValue: 0,
        },
    );

    const overallReturnAbsolute = totalValue - totalPurchaseValue;
    const overallReturnPercentage = overallReturnAbsolute / totalPurchaseValue;

    const assetWeights = investments.map((investment) => ({
        id: investment.assetId,
        weight: investment.currentValue / totalValue,
    }));

    const assetVariances = await Promise.all(
        assetWeights.map(async ({ id }) => await calculateAssetVariance(id)),
    );

    const { portfolioVariance, downsideVariance } = assetWeights.reduce(
        (acc, asset) => {
            const assetVariance = assetVariances.find(
                (variance) => variance.assetId === asset.id,
            );

            if (assetVariance) {
                return {
                    portfolioVariance:
                        acc.portfolioVariance +
                        Math.pow(asset.weight, 2) * assetVariance.variance,
                    downsideVariance:
                        acc.downsideVariance +
                        Math.pow(asset.weight, 2) *
                            assetVariance.downsideVariance,
                };
            }

            return acc;
        },
        {
            portfolioVariance: 0,
            downsideVariance: 0,
        },
    );

    return {
        totalValue,
        overallReturn: {
            percentage: overallReturnPercentage * 100,
            absolute: overallReturnAbsolute,
        },
        riskMetrics: {
            volatility: Math.sqrt(portfolioVariance) * 100,
            sortinoRatio: overallReturnPercentage / Math.sqrt(downsideVariance),
        },
    } satisfies PortfolioMetrics;
};

export default async function portfolioMetricsGet(fastify: FastifyInstance) {
    fastify.route<{
        Params: PortfolioIdParam;
        Reply: PortfolioMetricsResponse | NotFoundResponse;
    }>({
        method: "GET",
        url: "/portfolios/:portfolioId/metrics",
        schema: {
            params: portfolioIdParamSchema,
            response: {
                200: portfolioMetricsResponse,
                404: Type.Union([
                    portfolioNotFoundSchema,
                    metricsNotFoundSchema,
                ]),
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

                const metrics = await retrievePortfolioMetrics(portfolioId);

                if (!metrics) {
                    return reply.status(404).send({
                        message: "metricsNotFound",
                    });
                }

                return reply.status(200).send({
                    data: metrics,
                });
            } catch (error) {
                logger.error({ error }, "Error retrieving portfolio metrics");
                throw error;
            }
        },
    });
}
