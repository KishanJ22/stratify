import { cn } from "@/lib/utils";
import { useSessionContext } from "../../../SessionProvider";
import PortfolioMetricCard from "./PortfolioMetricCard";
import {
    PortfolioMetricsResponse,
    usePortfolioMetrics,
} from "./usePortfolioMetrics";
import {
    ChartColumnDecreasing,
    ChartColumnIncreasing,
    InfoIcon,
} from "lucide-react";
import { formatNumericValue } from "@/app/utils/formatNumericValue";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/app/components/ui/tooltip";

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

interface RiskLabelTooltipContentProps {
    riskLevel: PortfolioMetricsResponse["riskMetrics"]["riskLevel"];
}

const RiskLabelTooltipContent = ({
    riskLevel,
}: RiskLabelTooltipContentProps) => (
    <div className="flex flex-col gap-y-1">
        <div className="grid grid-cols-3 gap-y-1 text-secondary-dark text-sm font-medium text-center">
            <div className="col-span-3 grid grid-cols-subgrid border-b border-b-secondary-light font-semibold pb-1">
                <span>Risk level</span>
                <span>Volatility</span>
                <span>Sortino ratio</span>
            </div>
            <div
                className={cn(
                    "col-span-3 grid grid-cols-subgrid py-0.5",
                    riskLevel === "low" &&
                        "bg-positive-lighter border border-positive-base rounded-lg",
                )}
            >
                <span>Low</span>
                <span>&lt; 15%</span>
                <span>&gt;= 1</span>
            </div>
            <div
                className={cn(
                    "col-span-3 grid grid-cols-subgrid py-0.5",
                    riskLevel === "medium" &&
                        "bg-accent-lighter border border-accent-base rounded-lg",
                )}
            >
                <span>Medium</span>
                <span>15% - 25%</span>
                <span>&gt;= 1</span>
            </div>
            <div
                className={cn(
                    "col-span-3 grid grid-cols-subgrid py-0.5",
                    riskLevel === "high" &&
                        "bg-negative-lighter border border-negative-base rounded-lg",
                )}
            >
                <span>High</span>
                <span>25% - 45%</span>
                <span>&gt;= 1</span>
            </div>
            <div
                className={cn(
                    "col-span-3 grid grid-cols-subgrid py-0.5",
                    riskLevel === "veryHigh" &&
                        "bg-negative-lighter border border-negative-darker rounded-lg",
                )}
            >
                <span>Very high</span>
                <span>&gt;= 45%</span>
                <span>&lt; 1</span>
            </div>
        </div>
        <div className="text-secondary-dark text-xs italic">
            If the Sortino ratio is greater than 2, then the risk level is
            reduced by one level. The opposite applies if the Sortino ratio is
            below 1.
        </div>
    </div>
);

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
                tooltipContent="Total return of your portfolio, including realised and unrealised gains and losses."
                tooltipContentSide="top"
            >
                {data?.overallReturn ? (
                    <div
                        className={`flex flex-row items-center justify-between font-sans font-medium text-lg ${
                            data.overallReturn.absolute &&
                            data.overallReturn.absolute >= 0
                                ? "text-positive-base"
                                : "text-negative-base"
                        }`}
                        data-testid="overall-return"
                    >
                        <span>
                            {data.overallReturn.absolute &&
                            data.overallReturn.absolute >= 0
                                ? "+"
                                : ""}
                            {data.overallReturn.absolute
                                ? formatNumericValue(
                                      data.overallReturn.absolute,
                                      userCurrency,
                                  )
                                : "---"}
                        </span>
                        <div className="flex flex-row items-center gap-x-1">
                            {data.overallReturn.percentage &&
                            data.overallReturn.percentage >= 0 ? (
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
                            {data.overallReturn.percentage &&
                            data.overallReturn.percentage >= 0
                                ? "+"
                                : ""}
                            {data.overallReturn.percentage &&
                                formatNumericValue(
                                    data.overallReturn.percentage,
                                )}
                            %
                        </div>
                    </div>
                ) : (
                    "---"
                )}
            </PortfolioMetricCard>
            <PortfolioMetricCard
                title="Overall risk"
                isLoading={isLoading}
                tooltipContent="An overall risk assessment of your portfolio based on its volatility and Sortino ratio."
                tooltipContentSide="top"
            >
                {data?.riskMetrics ? (
                    <div className="flex flex-col items-center font-sans font-medium text-xl leading-6 text-secondary-dark">
                        <div className="flex flex-row items-center justify-between w-full">
                            <div className="flex flex-row gap-x-1 items-center">
                                <span>Portfolio volatility</span>
                                <Tooltip>
                                    <TooltipTrigger data-testid="portfolio-metric-card-info-icon">
                                        <InfoIcon
                                            size={20}
                                            className="text-secondary-darker"
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="top"
                                        className="bg-secondary-lighter w-48"
                                        arrowClassName="bg-secondary-lighter fill-secondary-lighter"
                                    >
                                        <div className="flex flex-col gap-y-2 text-secondary-dark font-medium text-sm">
                                            <span>
                                                A measure of how much the value
                                                of your portfolio fluctuates.
                                            </span>
                                            <span>
                                                A high volatility means that the
                                                value can change a lot over
                                                short time periods, which can
                                                indicate higher risk.
                                            </span>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <span>
                                {data.riskMetrics.riskLevel !== "unknown"
                                    ? `${data.riskMetrics.volatility}%`
                                    : "---"}
                            </span>
                        </div>
                        <div className="flex flex-row items-center justify-between w-full">
                            <div className="flex flex-row gap-x-1 items-center">
                                <span>Sortino ratio</span>
                                <Tooltip>
                                    <TooltipTrigger data-testid="portfolio-metric-card-info-icon">
                                        <InfoIcon
                                            size={20}
                                            className="text-secondary-darker"
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="top"
                                        className="bg-secondary-lighter w-52"
                                        arrowClassName="bg-secondary-lighter fill-secondary-lighter"
                                    >
                                        <div className="flex flex-col gap-y-2 text-secondary-dark font-medium text-sm">
                                            <span>
                                                A measure of how well your
                                                portfolio performs relative to
                                                the risk of your investments
                                                losing value.
                                            </span>
                                            <span>
                                                A ratio above 1 indicates that
                                                your portfolio is performing
                                                well relative to the risk taken.
                                            </span>
                                            <span>
                                                A ratio below 1 may mean that
                                                the returns of your portfolio do
                                                not justify the risk of the
                                                investments losing value.
                                            </span>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
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
                            <div className="flex flex-row gap-x-1 items-center">
                                <span>Risk level</span>
                                <Tooltip>
                                    <TooltipTrigger data-testid="portfolio-metric-card-info-icon">
                                        <InfoIcon size={20} />
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="top"
                                        className="bg-secondary-lighter w-64 flex flex-col"
                                        arrowClassName="bg-secondary-lighter fill-secondary-lighter"
                                    >
                                        <RiskLabelTooltipContent
                                            riskLevel={
                                                data.riskMetrics.riskLevel
                                            }
                                        />
                                    </TooltipContent>
                                </Tooltip>
                            </div>
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
