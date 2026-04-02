import { Dispatch, SetStateAction } from "react";
import {
    ChartColumnDecreasing,
    ChartColumnIncreasing,
    InfoIcon,
} from "lucide-react";
import { Tooltip } from "@/app/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AssetPriceHistory } from "../hooks/useAssetPriceHistory";
import HistoryDateRangeSelector, {
    DateRange,
} from "../../../portfolios/components/PortfolioValueChart/HistoryDateRangeSelector";

const changeInDateRangeLabel = {
    "7d": "in the past seven days",
    "30d": "in the past thirty days",
    "6m": "in the past six months",
    "12m": "in the past twelve months",
    all: "since the first recorded price",
};

interface AssetPriceDetailsProps {
    filteredData: AssetPriceHistory[];
    currentPrice: number | null;
    selectedDateRange: DateRange;
    setSelectedDateRange: Dispatch<SetStateAction<DateRange>>;
    assetCurrency: string;
}

const AssetPriceDetails = ({
    filteredData,
    currentPrice,
    assetCurrency,
    selectedDateRange,
    setSelectedDateRange,
}: AssetPriceDetailsProps) => {
    const firstValue =
        filteredData.length > 0 ? filteredData[0].priceDetails.close : null;

    const portfolioValueChange =
        firstValue && currentPrice
            ? ((currentPrice - firstValue) / firstValue) * 100
            : null;

    const isPositiveChange =
        portfolioValueChange !== null && portfolioValueChange >= 0.01;

    const sign = isPositiveChange ? "+" : "";

    return (
        <div className="flex flex-col">
            <div className="flex flex-row items-center text-2xl text-primary-dark font-semibold justify-between">
                <div className="flex flex-row items-center gap-x-1.5">
                    <span>Asset price</span>
                    <Tooltip>
                        <InfoIcon
                            size={20}
                            className="text-primary-dark mt-1"
                        />
                    </Tooltip>
                </div>
                <HistoryDateRangeSelector
                    selectedDateRange={selectedDateRange}
                    setSelectedDateRange={setSelectedDateRange}
                    disabled={filteredData.length === 0}
                />
            </div>
            <div className="flex flex-row text-muted-base text-3xl font-semibold">
                {currentPrice !== null ? (
                    <>
                        <div>{currentPrice.toLocaleString()}</div>
                        <div className="text-base ml-1 mt-2 content-end">
                            {`(${assetCurrency})`}
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

export default AssetPriceDetails;
