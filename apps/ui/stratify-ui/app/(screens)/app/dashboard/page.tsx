"use client";

import { usePortfoliosOverview } from "./usePortfoliosOverview";
import TotalValueCard from "./components/TotalValueCard";
import OverallChangeCard from "./components/OverallChangeCard";
import GoalProgressionCard from "./components/GoalProgressionCard/GoalProgressionCard";
import TopPerformersCard from "./components/TopPerformersCard/TopPerformersCard";
import AssetDiversificationCard from "./components/AssetDiversificationCard";
import { useTranslations } from "next-intl";
import { useGoal } from "./components/GoalProgressionCard/useGoal";
import SetGoalModal from "./components/GoalProgressionCard/SetGoalModal";
import { useState } from "react";

export default function DashboardPage() {
    const [isSetGoalModalOpen, setIsSetGoalModalOpen] = useState(false);
    const {
        data: overviewData,
        isLoading: isOverviewLoading,
        isPortfoliosNotFoundError,
        isInvestmentsNotFoundError,
    } = usePortfoliosOverview();

    const {
        data: goalData,
        isLoading: isGoalLoading,
        isGoalNotFoundError,
    } = useGoal();

    const translate = useTranslations("Dashboard");

    const isLoading = isOverviewLoading || isGoalLoading;

    return (
        <div className="min-h-screen px-10">
            <div className="font-sans text-5xl text-primary-base font-semibold leading-14 w-full text-left">
                {translate("title")}
            </div>
            <div className="mt-8 w-full">
                <div className="grid grid-cols-3 gap-x-16 gap-y-10">
                    <TotalValueCard
                        totalValue={overviewData?.totalValue}
                        isLoading={isLoading}
                        isPortfoliosNotFoundError={isPortfoliosNotFoundError}
                        isInvestmentsNotFoundError={isInvestmentsNotFoundError}
                    />
                    <OverallChangeCard
                        overallChange={overviewData?.overallChange}
                        isLoading={isLoading}
                        isInvestmentsNotFoundError={isInvestmentsNotFoundError}
                        isPortfoliosNotFoundError={isPortfoliosNotFoundError}
                    />
                    <GoalProgressionCard
                        totalValue={overviewData?.totalValue}
                        targetValue={goalData?.targetAmount}
                        isGoalNotFoundError={isGoalNotFoundError}
                        isLoading={isLoading}
                        setIsGoalModalOpen={setIsSetGoalModalOpen}
                    />
                    <div className="col-span-2">
                        <TopPerformersCard
                            investments={overviewData?.investments ?? []}
                            isLoading={isLoading}
                            isPortfoliosNotFoundError={
                                isPortfoliosNotFoundError
                            }
                            isInvestmentsNotFoundError={
                                isInvestmentsNotFoundError
                            }
                        />
                    </div>
                    <AssetDiversificationCard
                        investments={overviewData?.investments ?? []}
                        isLoading={isLoading}
                    />
                </div>
            </div>
            <SetGoalModal
                isOpen={isSetGoalModalOpen}
                handleClose={() => setIsSetGoalModalOpen(false)}
                isGoalNotFoundError={isGoalNotFoundError}
                currentTargetAmount={goalData?.targetAmount}
            />
        </div>
    );
}
