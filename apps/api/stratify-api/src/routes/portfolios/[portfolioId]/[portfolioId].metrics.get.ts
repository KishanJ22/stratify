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

const riskLevelValues = ["low", "medium", "high"] as const;

const riskLevelSchema = Type.Union(
    riskLevelValues.map((level) => Type.Literal(level)),
);

type RiskLevel = Static<typeof riskLevelSchema>;

const portfolioMetrics = Type.Object({
    totalValue: Type.Number(),
    overallReturn: Type.Object({
        percentage: Type.Number(),
        absolute: Type.Number(),
    }),
    riskMetrics: Type.Object({
        volatility: Type.Number(),
        sortinoRatio: Type.Number(),
        riskLevel: riskLevelSchema,
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

const determineRiskLevel = (
    volatility: number,
    sortinoRatio: number,
): RiskLevel => {
    if (volatility < 10 && sortinoRatio > 2) {
        return "low";
    }

    if (volatility < 20 && sortinoRatio > 1) {
        return "medium";
    }

    return "high";
};

const retrievePortfolioMetrics = async (portfolioId: number) => {
    const investments = await retrieveInvestments(portfolioId);

    if (investments.length === 0) {
        return null;
    }

    const { totalValue, totalCost, overallReturnAbsolute } = investments.reduce(
        (acc, investment) => {
            return {
                totalValue: acc.totalValue + investment.currentValue,
                totalCost: acc.totalCost + investment.totalBuyAmount,
                overallReturnAbsolute:
                    acc.overallReturnAbsolute + investment.currentReturn,
            };
        },
        {
            totalValue: 0,
            totalCost: 0,
            overallReturnAbsolute: 0,
        },
    );

    const overallReturnPercentage = overallReturnAbsolute / totalCost;

    const assetWeights = investments.map((investment) => ({
        id: investment.assetId,
        weight: investment.currentValue / totalValue,
    }));

    const assetVariances = await Promise.all(
        assetWeights.map(async ({ id }) => await calculateAssetVariance(id)),
    );

    //? Calculate the portfolio variance by summing the weighted variances of each asset
    const { portfolioVariance, downsideVariance, meanMonthlyReturn } =
        assetWeights.reduce(
            (acc, asset) => {
                const assetVariance = assetVariances.find(
                    (variance) => variance.assetId === asset.id,
                );

                if (assetVariance && asset.weight) {
                    return {
                        portfolioVariance:
                            acc.portfolioVariance +
                            Math.pow(asset.weight, 2) * assetVariance.variance,
                        downsideVariance:
                            acc.downsideVariance +
                            Math.pow(asset.weight, 2) *
                                assetVariance.downsideVariance,
                        meanMonthlyReturn:
                            acc.meanMonthlyReturn +
                            asset.weight * assetVariance.meanReturn,
                    };
                }

                return acc;
            },
            {
                portfolioVariance: 0,
                downsideVariance: 0,
                meanMonthlyReturn: 0,
            },
        );

    //? Multiply the variances and mean monthly portfolio return by 12 to get annualised values that follow the same timescale
    const volatility =
        portfolioVariance > 0 ? Math.sqrt(portfolioVariance * 12) * 100 : 0;
    const sortinoRatio =
        downsideVariance > 0 && meanMonthlyReturn > 0
            ? (meanMonthlyReturn * 12) / Math.sqrt(downsideVariance * 12)
            : 0;

    const riskLevel = determineRiskLevel(volatility, sortinoRatio);

    return {
        totalValue,
        overallReturn: {
            percentage: overallReturnPercentage * 100,
            absolute: overallReturnAbsolute,
        },
        riskMetrics: {
            volatility,
            sortinoRatio,
            riskLevel,
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
