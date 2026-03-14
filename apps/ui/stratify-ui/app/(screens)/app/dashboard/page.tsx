"use client";

import { Skeleton } from "@/app/components/ui/skeleton";
import KeyPerformanceCard from "./KeyPerformanceCard";
import { usePortfoliosOverview } from "./usePortfoliosOverview";
import { useSessionContext } from "../SessionProvider";
import ValueChangeLabel from "./ValueChangeLabel";
import { Progress } from "@/app/components/ui/progress";
import { Button } from "@/app/components/ui/button";
import { useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
    const {
        data,
        isLoading,
        isPortfoliosNotFoundError,
        isInvestmentsNotFoundError,
    } = usePortfoliosOverview();

    useEffect(() => {
        console.log("Portfolios overview data:", data);
        console.log("Is loading:", isLoading);
        console.log(
            "Is portfolios not found error:",
            isPortfoliosNotFoundError,
        );
        console.log(
            "Is investments not found error:",
            isInvestmentsNotFoundError,
        );
    }, [
        data,
        isLoading,
        isPortfoliosNotFoundError,
        isInvestmentsNotFoundError,
    ]);

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
                        ) : isPortfoliosNotFoundError ? (
                            <Link
                                href="/app/portfolios?create=true"
                                className="text-3xl leading-9 text-secondary-light hover:text-secondary-base transition-colors hover:underline"
                            >
                                {"Create a portfolio"}
                            </Link>
                        ) : isInvestmentsNotFoundError ? (
                            <span className="text-3xl leading-9 text-secondary-light">
                                {"---"}
                            </span>
                        ) : (
                            <span className="text-3xl leading-9 text-secondary-base">
                                {`${data?.totalValue.toLocaleString()} (${userCurrency})`}
                            </span>
                        )}
                    </KeyPerformanceCard>
                    <KeyPerformanceCard title="Overall change">
                        {isLoading ? (
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
                                                .percentage
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
                                                .percentage
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
                                                .percentage
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
