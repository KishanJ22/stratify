"use client";

import { Skeleton } from "@/app/components/ui/skeleton";
import KeyPerformanceCard from "./KeyPerformanceCard";
import { usePortfoliosOverview } from "./usePortfoliosOverview";
import { useSessionContext } from "../SessionProvider";
import ValueChangeLabel from "./ValueChangeLabel";
import { Progress } from "@/app/components/ui/progress";

export default function DashboardPage() {
    const { data, isLoading } = usePortfoliosOverview();

    const { session } = useSessionContext();
    const userCurrency = session?.userDetails.currency as string;

    return (
        <div className="items-center justify-items-center min-h-screen px-10">
            <div className="font-sans text-5xl text-primary-base font-semibold">
                Dashboard
            </div>
            <div className="mt-8">
                <div className="grid grid-cols-3 items-center gap-x-16">
                    <KeyPerformanceCard title="Total value">
                        {isLoading ? (
                            <Skeleton className="h-8 w-1/2" />
                        ) : (
                            <span className="font-normal text-3xl leading-9 text-secondary-base">
                                {`${data?.totalValue.toLocaleString()} (${userCurrency})`}
                            </span>
                        )}
                    </KeyPerformanceCard>
                    <KeyPerformanceCard title="Overall change">
                        {isLoading && !data ? (
                            <div className="flex flex-row justify-between items-center">
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
                                            data?.overallChange.lastThirtyDays
                                                .percentage || 0
                                        }
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg leading-5 text-secondary-base">
                                        {"Last 6 months"}
                                    </span>
                                    <ValueChangeLabel
                                        valueChangePercent={
                                            data?.overallChange.lastSixMonths
                                                .percentage || 0
                                        }
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg leading-5 text-secondary-base">
                                        {"All time"}
                                    </span>
                                    <ValueChangeLabel
                                        valueChangePercent={
                                            data?.overallChange.allTime
                                                .percentage || 0
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    </KeyPerformanceCard>
                    <KeyPerformanceCard title="Goal progression">
                        {isLoading ? (
                            <Skeleton className="h-4 w-full" />
                        ) : (
                            <div className="flex flex-col gap-y-1">
                                <Progress value={67} />
                                <div className="flex flex-row justify-between text-lg leading-5 text-secondary-base">
                                    <span>{"0"}</span>
                                    <span>{"100"}</span>
                                </div>
                            </div>
                        )}
                    </KeyPerformanceCard>
                </div>
            </div>
        </div>
    );
}
