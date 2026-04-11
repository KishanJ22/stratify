import { Skeleton } from "@/app/components/ui/skeleton";
import { Overview } from "../usePortfoliosOverview";
import KeyPerformanceCard from "./KeyPerformanceCard";
import ValueChangeLabel from "./ValueChangeLabel";
import { useTranslations } from "next-intl";

export interface OverallChangeCardProps {
    overallChange?: Overview["overallChange"];
    isLoading: boolean;
    isInvestmentsNotFoundError: boolean;
    isPortfoliosNotFoundError: boolean;
}

const OverallChangeCard = ({
    overallChange,
    isLoading,
    isInvestmentsNotFoundError,
    isPortfoliosNotFoundError,
}: OverallChangeCardProps) => {
    const translate = useTranslations();

    return (
        <KeyPerformanceCard title={translate("Dashboard.overallChange")}>
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
                            {translate("valueChange.lastThirtyDays")}
                        </span>
                        <ValueChangeLabel
                            valueChangePercent={
                                overallChange?.lastThirtyDays.percentage ?? null
                            }
                            isNotFoundError={
                                isInvestmentsNotFoundError ||
                                isPortfoliosNotFoundError
                            }
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg leading-5 text-secondary-base">
                            {translate("valueChange.lastSixMonths")}
                        </span>
                        <ValueChangeLabel
                            valueChangePercent={
                                overallChange?.lastSixMonths.percentage ?? null
                            }
                            isNotFoundError={
                                isInvestmentsNotFoundError ||
                                isPortfoliosNotFoundError
                            }
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg leading-5 text-secondary-base">
                            {translate("valueChange.allTime")}
                        </span>
                        <ValueChangeLabel
                            valueChangePercent={
                                overallChange?.allTime.percentage ?? null
                            }
                            isNotFoundError={
                                isInvestmentsNotFoundError ||
                                isPortfoliosNotFoundError
                            }
                        />
                    </div>
                </div>
            )}
        </KeyPerformanceCard>
    );
};

export default OverallChangeCard;
