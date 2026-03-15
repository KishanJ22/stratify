import { Overview } from "../../usePortfoliosOverview";
import TopPerformersTable from "./TopPerformersTable";

interface TopPerformersCardProps {
    investments?: Overview["investments"];
    isLoading: boolean;
}

const TopPerformersCard = ({
    investments,
    isLoading,
}: TopPerformersCardProps) => {
    return (
        <div className="flex flex-col h-full w-full bg-primary-lightest rounded-xl shadow-lg py-2.5 px-3 font-sans">
            <div className="flex flex-col text-secondary-dark">
                <div className="font-semibold text-2xl leading-8">
                    Top Performers
                </div>
                <div className="font-medium text-sm leading-4">
                    View the investments that are performing the best across all
                    of your portfolios.
                </div>
            </div>
            <div className="mt-3">
                <TopPerformersTable
                    investments={investments}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default TopPerformersCard;
