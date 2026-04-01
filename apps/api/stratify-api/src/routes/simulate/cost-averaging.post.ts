import { Static, Type } from "@sinclair/typebox";
import { returnSchema } from "../../schemas/common-schemas.js";
import { assetPricesQuery } from "../portfolios/[portfolioId]/metrics/calculateAssetVariance.js";
import { toTwoDecimalPoints } from "../../utils/toTwoDecimalPoints.js";
import { FastifyInstance } from "fastify";
import {
    CannotSimulateResponse,
    cannotSimulateSchema,
    NotFoundResponse,
    notFoundSchema,
} from "./simulationSchemas.js";
import logger from "../../logger.js";

const contributionFrequencies = [
    "weekly",
    "monthly",
    "quarterly",
    "annually",
] as const;

const contributionFrequencySchema = Type.Union(
    contributionFrequencies.map((freq) => Type.Literal(freq)),
);

const requestBodySchema = Type.Object({
    assetId: Type.Number(),
    totalInvestment: Type.Number(),
    contributionFrequency: contributionFrequencySchema,
    timePeriodYears: Type.Number(),
    amountPerContribution: Type.Number(),
});

type RequestBody = Static<typeof requestBodySchema>;

const simulationResult = Type.Object({
    date: Type.String(),
    lumpSumValue: Type.Number(),
    costAveragingValue: Type.Number(),
});

type SimulationResult = Static<typeof simulationResult>;

const simulationResponseSchema = Type.Object({
    results: Type.Array(simulationResult),
    returns: Type.Object({
        lumpSum: returnSchema,
        costAveraging: returnSchema,
    }),
});

export type SimulationResponse = Static<typeof simulationResponseSchema>;

const successResponseSchema = Type.Object({
    data: simulationResponseSchema,
});

type SuccessResponse = Static<typeof successResponseSchema>;

const executeCostAveragingSimulation = async (body: RequestBody) => {
    const {
        assetId,
        timePeriodYears,
        contributionFrequency,
        amountPerContribution,
        totalInvestment,
    } = body;

    //? Set start date to first day of the month and timePeriodYears ago
    const startDate = new Date();
    startDate.setFullYear(new Date().getFullYear() - timePeriodYears);
    startDate.setDate(1);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);

    const historicAssetPrices = await assetPricesQuery(
        assetId,
        startDate,
    ).execute();

    if (historicAssetPrices.length === 0) {
        return "noDataFound";
    }

    const assetPriceMap = new Map<string, number>();

    historicAssetPrices.forEach(({ priceDate, assetPrice }) => {
        const key = priceDate.toISOString().split("T")[0];
        assetPriceMap.set(key, parseFloat(assetPrice));
    });

    const results: SimulationResult[] = [];

    let lumpSumShares = 0;
    let totalShares = 0;

    const date = new Date(startDate);

    while (date <= startOfMonth) {
        const formattedDate = date.toISOString().split("T")[0];

        //? If the current date is a weekend, then the asset price from Friday should be used as markets are closed on weekends
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;

        const fridayDate = new Date(
            new Date(date).setDate(
                date.getDate() - (date.getDay() === 0 ? 2 : 1),
            ),
        );

        const formattedFridayDate = fridayDate.toISOString().split("T")[0];

        const pricePerShare = isWeekend
            ? assetPriceMap.get(formattedFridayDate)
            : assetPriceMap.get(formattedDate);

        if (pricePerShare) {
            if (results.length === 0) {
                lumpSumShares = totalInvestment / pricePerShare;

                results.push({
                    date: formattedDate,
                    lumpSumValue: totalInvestment,
                    costAveragingValue: amountPerContribution,
                });
            } else {
                totalShares += amountPerContribution / pricePerShare;

                results.push({
                    date: formattedDate,
                    lumpSumValue: toTwoDecimalPoints(
                        lumpSumShares * pricePerShare,
                    ),
                    costAveragingValue: toTwoDecimalPoints(
                        totalShares * pricePerShare,
                    ),
                });
            }
        }

        if (contributionFrequency === "weekly") {
            date.setDate(date.getDate() + 7);
        }

        if (contributionFrequency === "monthly") {
            date.setMonth(date.getMonth() + 1);
        }

        if (contributionFrequency === "quarterly") {
            date.setMonth(date.getMonth() + 3);
        }

        if (contributionFrequency === "annually") {
            date.setFullYear(date.getFullYear() + 1);
        }
    }

    if (results.length === 0) {
        return "cannotSimulate";
    }

    const lastResult = results[results.length - 1];

    const returns = {
        lumpSum: {
            absolute: toTwoDecimalPoints(
                lastResult.lumpSumValue - totalInvestment,
            ),
            percentage: toTwoDecimalPoints(
                ((lastResult.lumpSumValue - totalInvestment) /
                    totalInvestment) *
                    100,
            ),
        },
        costAveraging: {
            absolute: toTwoDecimalPoints(
                lastResult.costAveragingValue - totalInvestment,
            ),
            percentage: toTwoDecimalPoints(
                ((lastResult.costAveragingValue - totalInvestment) /
                    totalInvestment) *
                    100,
            ),
        },
    };

    return {
        results,
        returns,
    };
};

export default async function costAveragingSimulationPost(
    fastify: FastifyInstance,
) {
    fastify.route<{
        Body: RequestBody;
        Reply: SuccessResponse | NotFoundResponse | CannotSimulateResponse;
    }>({
        method: "POST",
        url: "/simulate/cost-averaging",
        schema: {
            body: requestBodySchema,
            response: {
                200: successResponseSchema,
                400: cannotSimulateSchema,
                404: notFoundSchema,
            },
        },
        handler: async (request, reply) => {
            const { body } = request;

            try {
                const simulationResults =
                    await executeCostAveragingSimulation(body);

                if (simulationResults === "noDataFound") {
                    return reply.status(404).send({
                        message: "noDataFound",
                    });
                }

                if (simulationResults === "cannotSimulate") {
                    return reply.status(400).send({
                        message: "cannotSimulate",
                    });
                }

                return reply.status(200).send({
                    data: simulationResults,
                });
            } catch (error) {
                logger.error(
                    { error },
                    "Error during cost averaging simulation",
                );
                throw error;
            }
        },
    });
}
