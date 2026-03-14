import { mockInvestmentsData } from "../../portfolios/components/InvestmentsTable/_mocks/mockInvestmentData";
import type { Overview } from "../usePortfoliosOverview";

export const mockPortfoliosOverviewData = {
    totalValue: 100000,
    overallChange: {
        lastSevenDays: {
            absolute: 5000,
            percentage: 5,
        },
        lastThirtyDays: {
            absolute: 10000,
            percentage: 10,
        },
        lastSixMonths: {
            absolute: 15000,
            percentage: 15,
        },
        allTime: {
            absolute: 20000,
            percentage: 20,
        },
    },
    investments: mockInvestmentsData,
} satisfies Overview;
