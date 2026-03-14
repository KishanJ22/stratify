import { cn } from "@/lib/utils";
import { useSessionContext } from "../../../SessionProvider";
import PortfolioMetricCard from "./PortfolioMetricCard";
import {
    PortfolioMetricsResponse,
    usePortfolioMetrics,
} from "./usePortfolioMetrics";
import { ChartColumnDecreasing, ChartColumnIncreasing } from "lucide-react";

const riskLevelLabelMap = {
    low: "Low",
    medium: "Medium",
    high: "High",
    veryHigh: "Very High",
    unknown: "Unknown",
} satisfies Record<
    PortfolioMetricsResponse["riskMetrics"]["riskLevel"],
    string
>;

interface PortfolioMetricsProps {
    portfolioId: number | null;
}

const PortfolioMetrics = ({ portfolioId }: PortfolioMetricsProps) => {
    const { data, isLoading } = usePortfolioMetrics(portfolioId);
    const { session } = useSessionContext();
    const userCurrency = session?.userDetails?.currency || "---";

    return (
        <div className="flex flex-col gap-y-5 text-nowrap min-w-80">
            <PortfolioMetricCard
                title="Overall return"
                isLoading={isLoading}
                tooltipContent="Overall return for the portfolio"
            >
                {data?.overallReturn ? (
                    <div
                        className={`flex flex-row items-center justify-between font-sans font-medium text-lg ${
                            data.overallReturn.absolute >= 0
                                ? "text-positive-base"
                                : "text-negative-base"
                        }`}
                        data-testid="overall-return"
                    >
                        <span>
                            {data.overallReturn.absolute >= 0 ? "+" : ""}
                            {data.overallReturn.absolute.toLocaleString()} (
                            {userCurrency})
                        </span>
                        <div className="flex flex-row items-center gap-x-1">
                            {data.overallReturn.percentage >= 0 ? (
                                <ChartColumnIncreasing
                                    size={22}
                                    data-testid="chart-column-increasing"
                                />
                            ) : (
                                <ChartColumnDecreasing
                                    size={22}
                                    data-testid="chart-column-decreasing"
                                />
                            )}
                            {data.overallReturn.percentage >= 0 ? "+" : ""}
                            {data.overallReturn.percentage}%
                        </div>
                    </div>
                ) : (
                    "---"
                )}
            </PortfolioMetricCard>
            <PortfolioMetricCard
                title="Overall risk"
                isLoading={isLoading}
                tooltipContent="Overall risk for the portfolio"
            >
                {data?.riskMetrics ? (
                    <div className="flex flex-col items-center font-sans font-medium text-lg text-secondary-dark">
                        <div className="flex flex-row items-center justify-between w-full">
                            <span>Portfolio volatility</span>
                            <span>
                                {data.riskMetrics.riskLevel !== "unknown"
                                    ? `${data.riskMetrics.volatility}%`
                                    : "---"}
                            </span>
                        </div>
                        <div className="flex flex-row items-center justify-between w-full">
                            <span>Sortino ratio</span>
                            <span>
                                {data.riskMetrics.riskLevel !== "unknown"
                                    ? data.riskMetrics.sortinoRatio
                                    : "---"}
                            </span>
                        </div>
                        <div className="border-t border-secondary-light my-1 w-full" />
                        <div
                            className={cn(
                                "flex flex-row items-center justify-between w-full",
                                data.riskMetrics.riskLevel === "low" &&
                                    "text-positive-base",
                                data.riskMetrics.riskLevel === "medium" &&
                                    "text-accent-dark",
                                data.riskMetrics.riskLevel === "high" &&
                                    "text-negative-base",
                                data.riskMetrics.riskLevel === "veryHigh" &&
                                    "text-negative-dark",
                                data.riskMetrics.riskLevel === "unknown" &&
                                    "text-muted-dark",
                            )}
                        >
                            <span>Risk level</span>
                            <span>
                                {data.riskMetrics.riskLevel !== "unknown"
                                    ? riskLevelLabelMap[
                                          data.riskMetrics.riskLevel
                                      ]
                                    : "---"}
                            </span>
                        </div>
                    </div>
                ) : (
                    "---"
                )}
            </PortfolioMetricCard>
        </div>
    );
};

export default PortfolioMetrics;
