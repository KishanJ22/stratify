import { useTranslations } from "next-intl";
import { Overview } from "../../usePortfoliosOverview";
import TopPerformersTable from "./TopPerformersTable";

export interface TopPerformersCardProps {
    investments: Overview["investments"];
    isLoading: boolean;
    isPortfoliosNotFoundError: boolean;
    isInvestmentsNotFoundError: boolean;
}

const TopPerformersCard = ({
    investments,
    isLoading,
    isPortfoliosNotFoundError,
    isInvestmentsNotFoundError,
}: TopPerformersCardProps) => {
    const translate = useTranslations("Dashboard.topPerformers");

    return (
        <div className="flex flex-col h-full w-full bg-primary-lightest rounded-xl shadow-lg py-2.5 px-3 font-sans">
            <div className="flex flex-col text-secondary-dark">
                <div className="font-semibold text-2xl leading-8">
                    {translate("topPerformersTitle")}
                </div>
                <div className="font-medium text-sm leading-4">
                    {translate("topPerformersDescription")}
                </div>
            </div>
            <div className="mt-3">
                <TopPerformersTable
                    investments={investments}
                    isLoading={isLoading}
                    isPortfoliosNotFoundError={isPortfoliosNotFoundError}
                    isInvestmentsNotFoundError={isInvestmentsNotFoundError}
                />
            </div>
        </div>
    );
};

export default TopPerformersCard;
