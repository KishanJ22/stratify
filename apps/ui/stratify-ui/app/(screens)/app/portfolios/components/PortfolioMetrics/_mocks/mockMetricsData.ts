import { PortfolioMetricsResponse } from "../usePortfolioMetrics";

export const mockMetricsData = {
    totalValue: 100000,
    overallReturn: {
        absolute: 5000,
        percentage: 5,
    },
    riskMetrics: {
        volatility: 10,
        sortinoRatio: 1.5,
        riskLevel: "low",
    },
} satisfies PortfolioMetricsResponse;