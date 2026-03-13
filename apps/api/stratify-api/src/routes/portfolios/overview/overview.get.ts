import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { Return, returnSchema } from "../../../schemas/common-schemas.js";
import {
    fetchPortfolios,
    NotFoundResponse,
    notFoundSchema,
} from "../portfolios.get.js";
import logger from "../../../logger.js";
import { getFromStore } from "../../../plugins/localStorage.js";
import { UserDetails } from "../../../utils/decodeToken.js";
import { calculatePortfolioValueHistory } from "../[portfolioId]/value-history/calculateValueHistory.js";
import { ValueHistory } from "../[portfolioId]/value-history/[portfolioId].value-history.get.js";
import { retrieveInvestments } from "../[portfolioId]/investments/retrievePortfolioInvestments.js";
import { investmentSchema } from "../[portfolioId]/investments/investments.schema.js";

const overviewSchema = Type.Object({
    totalValue: Type.Number(),
    overallChange: Type.Object({
        lastSevenDays: returnSchema,
        lastThirtyDays: returnSchema,
        lastSixMonths: returnSchema,
        allTime: returnSchema,
    }),
    investments: Type.Array(investmentSchema),
});

type Overview = Static<typeof overviewSchema>;

const successResponseSchema = Type.Object({
    data: overviewSchema,
});

type SuccessResponse = Static<typeof successResponseSchema>;

const calculateChangeInTimePeriod = (
    data: ValueHistory[],
    latestValue: number,
    startDate: Date,
) => {
    const startValueEntry = data.find(
        (entry) => new Date(entry.date) >= startDate,
    );

    if (!startValueEntry) {
        return {
            absolute: 0,
            percentage: 0,
        };
    }

    const valueDifference = latestValue - startValueEntry.portfolioValue;

    return {
        absolute: parseFloat(valueDifference.toFixed(2)),
        percentage: parseFloat(
            ((valueDifference / startValueEntry.portfolioValue) * 100).toFixed(
                2,
            ),
        ),
    };
};

const retrieveOverviewDetails = async (portfolioIds: number[]) => {
    const investments = await Promise.all(
        portfolioIds.map((id) => retrieveInvestments(id)),
    ).then((results) => results.flat());

    const portfolioValueHistories = await Promise.all(
        portfolioIds.map((id) => calculatePortfolioValueHistory(id)),
    ).then((results) => results.flat());

    const groupedValueHistory = portfolioValueHistories.reduce(
        (acc, history) => {
            const existingHistory = acc.find((h) => h.date === history.date);

            if (existingHistory) {
                existingHistory.portfolioValue += history.portfolioValue;
            } else {
                acc.push({ ...history });
            }

            return acc;
        },
        [] as ValueHistory[],
    );

    // Sort history from oldest to newest§11§§§
    const sortedValueHistory = groupedValueHistory.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const totalValue = sortedValueHistory.length
        ? sortedValueHistory[sortedValueHistory.length - 1].portfolioValue
        : 0;

    const { overallReturn, totalBuyAmount } = investments.reduce(
        (sum, investment) => {
            return {
                overallReturn: (sum.overallReturn += investment.currentReturn),
                totalBuyAmount: (sum.totalBuyAmount +=
                    investment.totalBuyAmount),
            };
        },
        {
            overallReturn: 0,
            totalBuyAmount: 0,
        },
    );

    const allTimeReturn = {
        absolute: parseFloat(overallReturn.toFixed(2)),
        percentage: parseFloat(
            ((overallReturn / totalBuyAmount) * 100).toFixed(2),
        ),
    } satisfies Return;

    return {
        totalValue,
        overallChange: {
            lastSevenDays: calculateChangeInTimePeriod(
                sortedValueHistory,
                totalValue,
                new Date(new Date().setDate(new Date().getDate() - 7)),
            ),
            lastThirtyDays: calculateChangeInTimePeriod(
                sortedValueHistory,
                totalValue,
                new Date(new Date().setDate(new Date().getDate() - 30)),
            ),
            lastSixMonths: calculateChangeInTimePeriod(
                sortedValueHistory,
                totalValue,
                new Date(new Date().setMonth(new Date().getMonth() - 6)),
            ),
            allTime: allTimeReturn,
        },
        investments: investments.sort(
            (a, b) => b.currentReturn - a.currentReturn,
        ),
    } satisfies Overview;
};

export default async function overviewGet(fastify: FastifyInstance) {
    fastify.route<{
        Reply: SuccessResponse | NotFoundResponse;
    }>({
        method: "GET",
        url: "/portfolios/overview",
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

                const overviewDetails = await retrieveOverviewDetails(
                    portfolios.map((p) => p.id),
                );

                return reply.status(200).send({ data: overviewDetails });
            } catch (error) {
                logger.error({ error }, "Error fetching overview");
                throw error;
            }
        },
    });
}
