"use client";

import { usePortfoliosOverview } from "./usePortfoliosOverview";
import TotalValueCard from "./components/TotalValueCard";
import OverallChangeCard from "./components/OverallChangeCard";
import GoalProgressionCard from "./components/GoalProgressionCard";

export default function DashboardPage() {
    const {
        data,
        isLoading,
        isPortfoliosNotFoundError,
        isInvestmentsNotFoundError,
    } = usePortfoliosOverview();

    return (
        <div className="items-center justify-items-center min-h-screen px-10">
            <div className="font-sans text-5xl text-primary-base font-semibold">
                Dashboard
            </div>
            <div className="mt-8">
                <div className="grid grid-cols-3 items-center gap-x-16">
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
                </div>
            </div>
        </div>
    );
}
