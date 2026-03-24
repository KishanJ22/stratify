import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import logger from "../../logger.js";
import {
    CannotSimulateResponse,
    cannotSimulateSchema,
    NotFoundResponse,
    notFoundSchema,
} from "./simulationSchemas.js";
import { assetPricesQuery } from "../portfolios/[portfolioId]/metrics/calculateAssetVariance.js";
import { returnSchema } from "../../schemas/common-schemas.js";
import { toTwoDecimalPoints } from "../../utils/toTwoDecimalPoints.js";

const requestBodySchema = Type.Object({
    assetId: Type.Number(),
    initialInvestment: Type.Number(),
    monthlyContribution: Type.Number(),
    timePeriodYears: Type.Number(),
    dividendYield: Type.Union([Type.Number(), Type.Null()]),
});

type RequestBody = Static<typeof requestBodySchema>;

const simulationResult = Type.Object({
    date: Type.String(),
    noCompoundingValue: Type.Number(),
    compoundingValue: Type.Number(),
    compoundingWithDividendsValue: Type.Number(),
});

type SimulationResult = Static<typeof simulationResult>;

const successResponseSchema = Type.Object({
    data: Type.Object({
        results: Type.Array(simulationResult),
        returns: Type.Object({
            noCompounding: returnSchema,
            compounding: returnSchema,
            compoundingWithDividends: returnSchema,
        }),
    }),
});

type SuccessResponse = Static<typeof successResponseSchema>;

const executeCompoundingSimulation = async (body: RequestBody) => {
    const {
        assetId,
        timePeriodYears,
        monthlyContribution,
        initialInvestment,
        dividendYield,
    } = body;

    const startDate = new Date(
        new Date().setFullYear(new Date().getFullYear() - timePeriodYears),
    );

    const historicAssetPrices = await assetPricesQuery(
        assetId,
        startDate,
    ).execute();

    if (historicAssetPrices.length === 0) {
        return "assetNotFound";
    }

    const assetPriceMap = new Map<string, number>();

    historicAssetPrices.forEach(({ priceDate, assetPrice }) => {
        const key = priceDate.toISOString().split("T")[0];
        assetPriceMap.set(key, parseFloat(assetPrice));
    });

    const results: SimulationResult[] = [];

    let totalShares = 0;
    let totalSharesWithDividends = 0;

    for (
        let date = new Date(startDate);
        date <= new Date();
        date.setMonth(date.getMonth() + 1)
    ) {
        const formattedDate = date.toISOString().split("T")[0];

        //? If the current date is a weekend, then the conversion rate and/or asset price from Friday should be used as markets are closed on weekends (except for cryptocurrencies)
        const isWeekend =
            new Date(date).getDay() === 0 || new Date(date).getDay() === 6;

        const fridayDate = new Date(
            new Date(date).setDate(
                date.getDate() - (date.getDay() === 0 ? 2 : 1),
            ),
        );

        const isFullYear =
            date.getMonth() === startDate.getMonth() &&
            date.getFullYear() !== startDate.getFullYear();

        const formattedFridayDate = fridayDate.toISOString().split("T")[0];

        const pricePerShare = isWeekend
            ? assetPriceMap.get(formattedFridayDate)
            : assetPriceMap.get(formattedDate);

        if (pricePerShare) {
            if (results.length === 0) {
                totalShares = initialInvestment / pricePerShare;
                totalSharesWithDividends = initialInvestment / pricePerShare;

                results.push({
                    date: formattedDate,
                    noCompoundingValue: initialInvestment,
                    compoundingValue: initialInvestment,
                    compoundingWithDividendsValue: initialInvestment,
                });

                continue;
            }

            const previousResult = results[results.length - 1];

            totalShares += monthlyContribution / pricePerShare;
            totalSharesWithDividends += monthlyContribution / pricePerShare;

            const compoundingValue = totalShares * pricePerShare;

            if (isFullYear && dividendYield) {
                totalSharesWithDividends +=
                    (totalSharesWithDividends * dividendYield) / 100;
            }

            results.push({
                date: formattedDate,
                noCompoundingValue: toTwoDecimalPoints(
                    previousResult.noCompoundingValue + monthlyContribution,
                ),
                compoundingValue: toTwoDecimalPoints(compoundingValue),
                compoundingWithDividendsValue: toTwoDecimalPoints(
                    totalSharesWithDividends * pricePerShare,
                ),
            });
        }
    }

    if (results.length === 0) {
        return "noDataFound";
    }

    const totalCost =
        initialInvestment + monthlyContribution * (results.length - 1);

    const lastResult = results[results.length - 1];

    const returns = {
        noCompounding: {
            absolute: toTwoDecimalPoints(
                lastResult.noCompoundingValue - totalCost,
            ),
            percentage: toTwoDecimalPoints(
                ((lastResult.noCompoundingValue - totalCost) / totalCost) * 100,
            ),
        },
        compounding: {
            absolute: toTwoDecimalPoints(
                lastResult.compoundingValue - totalCost,
            ),
            percentage: toTwoDecimalPoints(
                ((lastResult.compoundingValue - totalCost) / totalCost) * 100,
            ),
        },
        compoundingWithDividends: {
            absolute: toTwoDecimalPoints(
                lastResult.compoundingWithDividendsValue - totalCost,
            ),
            percentage: toTwoDecimalPoints(
                ((lastResult.compoundingWithDividendsValue - totalCost) /
                    totalCost) *
                    100,
            ),
        },
    };

    return {
        results,
        returns,
    };
};

export default async function compoundingSimulationPost(
    fastify: FastifyInstance,
) {
    fastify.route<{
        Body: RequestBody;
        Reply: SuccessResponse | NotFoundResponse | CannotSimulateResponse;
    }>({
        method: "POST",
        url: "/simulate/compounding",
        schema: {
            body: requestBodySchema,
            response: {
                200: successResponseSchema,
                404: notFoundSchema,
                400: cannotSimulateSchema,
            },
        },
        handler: async (request, reply) => {
            const { body } = request;

            try {
                const simulationResults =
                    await executeCompoundingSimulation(body);

                if (simulationResults === "noDataFound") {
                    return reply.status(400).send({
                        message: "cannotSimulate",
                    });
                }

                if (simulationResults === "assetNotFound") {
                    return reply.status(404).send({
                        message: "assetNotFound",
                    });
                }

                return reply.status(200).send({
                    data: simulationResults,
                });
            } catch (error) {
                logger.error({ error }, "Error during compounding simulation");
                throw error;
            }
        },
    });
}
