import { Skeleton } from "@/app/components/ui/skeleton";
import { Overview } from "../usePortfoliosOverview";
import KeyPerformanceCard from "./KeyPerformanceCard";
import ValueChangeLabel from "./ValueChangeLabel";

interface OverallChangeCardProps {
    overallChange?: Overview["overallChange"];
    isLoading: boolean;
    isInvestmentsNotFoundError: boolean;
}

const OverallChangeCard = ({
    overallChange,
    isLoading,
    isInvestmentsNotFoundError,
}: OverallChangeCardProps) => {
    return (
        <KeyPerformanceCard title="Overall change">
            {isLoading ? (
                <div
                    className="flex flex-row justify-between items-center"
                    data-testid="overall-change-skeleton"
                >
                    <div className="flex flex-col">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16 mt-1.5" />
                    </div>
                    <div className="flex flex-col">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16 mt-1.5" />
                    </div>
                    <div className="flex flex-col">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16 mt-1.5" />
                    </div>
                </div>
            ) : (
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-lg leading-5 text-secondary-base">
                            {"Last 30 days"}
                        </span>
                        <ValueChangeLabel
                            valueChangePercent={
                                overallChange?.lastThirtyDays.percentage
                            }
                            isInvestmentsNotFoundError={
                                isInvestmentsNotFoundError
                            }
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg leading-5 text-secondary-base">
                            {"Last 6 months"}
                        </span>
                        <ValueChangeLabel
                            valueChangePercent={
                                overallChange?.lastSixMonths.percentage
                            }
                            isInvestmentsNotFoundError={
                                isInvestmentsNotFoundError
                            }
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg leading-5 text-secondary-base">
                            {"All time"}
                        </span>
                        <ValueChangeLabel
                            valueChangePercent={
                                overallChange?.allTime.percentage
                            }
                            isInvestmentsNotFoundError={
                                isInvestmentsNotFoundError
                            }
                        />
                    </div>
                </div>
            )}
        </KeyPerformanceCard>
    );
};

export default OverallChangeCard;
