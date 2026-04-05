"use client";

import { usePortfoliosOverview } from "./usePortfoliosOverview";
import TotalValueCard from "./components/TotalValueCard";
import OverallChangeCard from "./components/OverallChangeCard";
import GoalProgressionCard from "./components/GoalProgressionCard";
import TopPerformersCard from "./components/TopPerformersCard/TopPerformersCard";
import AssetDiversificationCard from "./components/AssetDiversificationCard";

export default function DashboardPage() {
    const {
        data,
        isLoading,
        isPortfoliosNotFoundError,
        isInvestmentsNotFoundError,
    } = usePortfoliosOverview();

    return (
        <div className="items-center justify-items-center h-full px-10">
            <div className="font-sans text-5xl text-primary-base font-semibold leading-14">
                Dashboard
            </div>
            <div className="mt-8 w-full">
                <div className="grid grid-cols-3 gap-x-16 gap-y-10">
                    <TotalValueCard
                        totalValue={data?.totalValue}
                        isLoading={isLoading}
                        isPortfoliosNotFoundError={isPortfoliosNotFoundError}
                        isInvestmentsNotFoundError={isInvestmentsNotFoundError}
                    />
                    <OverallChangeCard
                        overallChange={data?.overallChange}
                        isLoading={isLoading}
                        isInvestmentsNotFoundError={isInvestmentsNotFoundError}
                    />
                    <GoalProgressionCard isLoading={isLoading} />
                    <div className="col-span-2">
                        <TopPerformersCard
                            investments={data?.investments}
                            isLoading={isLoading}
                        />
                    </div>
                    <AssetDiversificationCard
                        investments={data?.investments}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
}
