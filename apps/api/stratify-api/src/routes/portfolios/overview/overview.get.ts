import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { Return, returnSchema } from "../../../schemas/common-schemas.js";
import {
    portfolioListQuery,
    NotFoundResponse,
    notFoundSchema,
} from "../portfolios.get.js";
import logger from "../../../logger.js";
import { getFromStore } from "../../../plugins/localStorage.js";
import { UserDetails } from "../../../utils/decodeToken.js";
import { calculatePortfolioValueHistory } from "../[portfolioId]/value-history/calculateValueHistory.js";
import { ValueHistory } from "../[portfolioId]/value-history/[portfolioId].value-history.get.js";
import { retrieveInvestments } from "../[portfolioId]/investments/retrievePortfolioInvestments.js";
import { investmentSchema } from "../[portfolioId]/investments/investmentSchema.js";
import db from "../../../database/db.js";
import { createNotFound } from "../../../utils/createNotFoundSchema.js";
import { toTwoDecimalPoints } from "../../../utils/toTwoDecimalPoints.js";

const overviewSchema = Type.Object({
    totalValue: Type.Number(),
    overallChange: Type.Object({
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

const noInvestmentsFoundSchema = createNotFound("noInvestmentsFound");
type NoInvestmentsFound = Static<typeof noInvestmentsFoundSchema>;

const hasInvestmentsQuery = (portfolioIds: number[], userId: string) =>
    db
        .selectFrom("stratify.trades as trades")
        .innerJoin(
            "stratify.portfolios as portfolios",
            "trades.portfolioId",
            "portfolios.id",
        )
        .where("trades.portfolioId", "in", portfolioIds)
        .where("portfolios.userId", "=", userId)
        .selectAll()
        .limit(1);

const calculateChangeInTimePeriod = (
    data: ValueHistory[],
    latestValue: number,
    startDate: Date,
) => {
    const startValueEntry = data.find(
        (entry) => new Date(entry.date).getTime() >= startDate.getTime(),
    );

    if (!startValueEntry || startValueEntry.portfolioValue === 0) {
        return {
            absolute: null,
            percentage: null,
        } satisfies Return;
    }

    const valueDifference = latestValue - startValueEntry.portfolioValue;

    return {
        absolute: toTwoDecimalPoints(valueDifference),
        percentage: toTwoDecimalPoints(
            (valueDifference / startValueEntry.portfolioValue) * 100,
        ),
    } satisfies Return;
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

    const sortedValueHistory = groupedValueHistory.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const { totalValue, overallReturn, totalBuyAmount } = investments.reduce(
        (sum, investment) => {
            return {
                totalValue: (sum.totalValue += investment.currentValue),
                overallReturn: (sum.overallReturn += investment.currentReturn),
                totalBuyAmount: (sum.totalBuyAmount +=
                    investment.totalBuyAmount),
            };
        },
        {
            totalValue: 0,
            overallReturn: 0,
            totalBuyAmount: 0,
        },
    );

    const allTimeReturn = {
        absolute: toTwoDecimalPoints(overallReturn),
        percentage: toTwoDecimalPoints((overallReturn / totalBuyAmount) * 100),
    } satisfies Return;

    const currentInvestments = investments
        .filter((investment) => investment.currentValue > 0)
        .sort((a, b) => b.currentReturnPercentage - a.currentReturnPercentage);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return {
        totalValue,
        overallChange: {
            lastThirtyDays: calculateChangeInTimePeriod(
                sortedValueHistory,
                totalValue,
                thirtyDaysAgo,
            ),
            lastSixMonths: calculateChangeInTimePeriod(
                sortedValueHistory,
                totalValue,
                sixMonthsAgo,
            ),
            allTime: allTimeReturn,
        },
        investments: currentInvestments,
    } satisfies Overview;
};

export default async function overviewGet(fastify: FastifyInstance) {
    fastify.route<{
        Reply: SuccessResponse | NotFoundResponse | NoInvestmentsFound;
    }>({
        method: "GET",
        url: "/portfolios/overview",
        schema: {
            response: {
                200: successResponseSchema,
                404: Type.Union([notFoundSchema, noInvestmentsFoundSchema]),
            },
        },
        handler: async (_request, reply) => {
            try {
                const { userId } = getFromStore("user") as UserDetails;

                const portfolios = await portfolioListQuery(userId).execute();

                if (portfolios.length === 0) {
                    return reply
                        .status(404)
                        .send({ message: "noPortfoliosFound" });
                }

                const portfolioIds = portfolios.map((p) => p.id);

                const hasInvestments = await hasInvestmentsQuery(
                    portfolioIds,
                    userId,
                ).execute();

                if (hasInvestments.length === 0) {
                    return reply
                        .status(404)
                        .send({ message: "noInvestmentsFound" });
                }

                const overviewDetails =
                    await retrieveOverviewDetails(portfolioIds);

                return reply.status(200).send({ data: overviewDetails });
            } catch (error) {
                logger.error({ error }, "Error fetching overview");
                throw error;
            }
        },
    });
}
