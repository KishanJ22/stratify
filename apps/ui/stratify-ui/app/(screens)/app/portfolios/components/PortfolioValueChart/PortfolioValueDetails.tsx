import { Dispatch, SetStateAction } from "react";
import HistoryDateRangeSelector, {
    DateRange,
} from "./HistoryDateRangeSelector";
import { PortfolioValueHistory } from "./usePortfolioValueHistory";
import {
    ChartColumnDecreasing,
    ChartColumnIncreasing,
    InfoIcon,
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { cn } from "@/lib/utils";

const changeInDateRangeLabel = {
    "7d": "in the past seven days",
    "30d": "in the past thirty days",
    "6m": "in the past six months",
    "12m": "in the past twelve months",
    all: "since the first trade",
};

interface PortfolioValueDetailsProps {
    filteredData: PortfolioValueHistory[];
    selectedDateRange: DateRange;
    setSelectedDateRange: Dispatch<SetStateAction<DateRange>>;
    currency?: string;
}

const PortfolioValueDetails = ({
    filteredData,
    currency,
    selectedDateRange,
    setSelectedDateRange,
}: PortfolioValueDetailsProps) => {
    const firstValue =
        filteredData.length > 0 ? filteredData[0].portfolioValue : null;

    const latestValue =
        filteredData.length > 0
            ? filteredData[filteredData.length - 1].portfolioValue
            : null;

    const portfolioValueChange =
        firstValue && latestValue
            ? ((latestValue - firstValue) / firstValue) * 100
            : null;

    const isPositiveChange =
        portfolioValueChange !== null && portfolioValueChange >= 0.01;

    const sign = isPositiveChange ? "+" : "";

    return (
        <div className="flex flex-col">
            <div className="flex flex-row items-center text-2xl text-primary-dark font-semibold justify-between">
                <div className="flex flex-row items-center gap-x-1.5">
                    <span>Portfolio value</span>
                    <Tooltip>
                        <TooltipTrigger>
                            <InfoIcon
                                size={20}
                                className="text-primary-dark mt-1"
                            />
                        </TooltipTrigger>
                        <TooltipContent
                            side="right"
                            className="font-medium text-primary-lightest text-sm w-72"
                        >
                            The total value of your portfolio based on the
                            investments you currently hold and their current
                            prices.
                        </TooltipContent>
                    </Tooltip>
                </div>
                <HistoryDateRangeSelector
                    selectedDateRange={selectedDateRange}
                    setSelectedDateRange={setSelectedDateRange}
                    disabled={filteredData.length === 0}
                />
            </div>
            <div className="flex flex-row text-muted-base text-3xl font-semibold">
                {latestValue !== null ? (
                    <>
                        <div>{latestValue.toLocaleString()}</div>
                        <div className="text-base ml-1 mt-2 content-end">
                            {currency ? `(${currency})` : null}
                        </div>
                    </>
                ) : (
                    <div>No data available</div>
                )}
            </div>

            <div
                className={cn(
                    "text-lg font-medium",
                    isPositiveChange
                        ? "text-positive-base"
                        : "text-negative-base",
                )}
            >
                {portfolioValueChange !== null ? (
                    <div className="flex flex-row items-center transition-all">
                        {isPositiveChange ? (
                            <ChartColumnIncreasing size={22} />
                        ) : (
                            <ChartColumnDecreasing size={22} />
                        )}
                        {sign}
                        {portfolioValueChange.toFixed(2)}%
                        <span className="ml-1 text-sm">
                            {changeInDateRangeLabel[selectedDateRange]}
                        </span>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default PortfolioValueDetails;
