"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/app/components/ui/chart";
import { useSessionContext } from "../../../SessionProvider";
import { usePortfolioValueHistory } from "./usePortfolioValueHistory";
import { useState } from "react";
import { DateRange } from "./HistoryDateRangeSelector";
import PortfolioValueDetails from "./PortfolioValueDetails";
import PortfolioValueChartSkeleton from "./PortfolioValueChartSkeleton";
import { placeholderChartData } from "./placeholderChartData";

interface ChartTooltipProps {
    active?: boolean;
    date: string;
    portfolioValue: number;
    currency: string;
}

const CustomChartTooltip = ({
    active,
    date,
    portfolioValue,
    currency,
}: ChartTooltipProps) => {
    if (!active) return null;

    const formattedDate = new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="bg-primary-lightest border border-primary-dark rounded-md p-2 font-sans flex flex-col items-start gap-y-1">
            <div className="font-semibold text-primary-darker">
                {formattedDate}
            </div>
            <div className="font-medium text-primary-dark">
                {portfolioValue?.toLocaleString()} ({currency})
            </div>
        </div>
    );
};

interface PortfolioValueChartProps {
    portfolioId: number | null;
}

const PortfolioValueChart = ({ portfolioId }: PortfolioValueChartProps) => {
    const { session } = useSessionContext();
    const currency = session?.userDetails.currency;

    const [selectedDateRange, setSelectedDateRange] =
        useState<DateRange>("30d");

    const { data, isLoading } = usePortfolioValueHistory(portfolioId);

    const filteredData =
        data?.filter((value) => {
            const valueDate = new Date(value.date).toISOString().split("T")[0];
            const startDate = new Date();

            switch (selectedDateRange) {
                case "7d": {
                    startDate.setDate(new Date().getDate() - 7);
                    break;
                }
                case "30d": {
                    startDate.setDate(new Date().getDate() - 30);
                    break;
                }
                case "6m": {
                    startDate.setMonth(new Date().getMonth() - 6);
                    break;
                }
                case "12m": {
                    startDate.setFullYear(new Date().getFullYear() - 1);
                    break;
                }
                case "all":
                    return true;
            }

            return valueDate >= startDate.toISOString().split("T")[0];
        }) ?? [];

    return isLoading ? (
        <PortfolioValueChartSkeleton />
    ) : (
        <div className="flex flex-col w-full font-sans">
            <PortfolioValueDetails
                filteredData={filteredData}
                currency={currency!}
                selectedDateRange={selectedDateRange}
                setSelectedDateRange={setSelectedDateRange}
            />
            <ChartContainer
                config={{
                    portfolioValue: {
                        label: "Portfolio value",
                        color: "var(--primary-base)",
                    },
                }}
                className="aspect-auto h-56"
            >
                <AreaChart
                    data={
                        filteredData.length > 0
                            ? filteredData
                            : placeholderChartData
                    }
                >
                    <defs>
                        <linearGradient
                            id="fillValue"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor={
                                    filteredData.length > 0
                                        ? "var(--primary-base)"
                                        : "var(--muted-base)"
                                }
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor={
                                    filteredData.length > 0
                                        ? "var(--primary-base)"
                                        : "var(--muted-base)"
                                }
                                stopOpacity={0.1}
                            />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="date"
                        hide={filteredData.length === 0}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={40}
                        tickFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            });
                        }}
                    />
                    {filteredData.length > 0 ? (
                        <ChartTooltip
                            cursor={false}
                            content={({ active, payload }) => (
                                <CustomChartTooltip
                                    active={active}
                                    date={payload?.[0]?.payload.date}
                                    portfolioValue={
                                        payload?.[0]?.payload.portfolioValue
                                    }
                                    currency={currency!}
                                />
                            )}
                        />
                    ) : null}
                    <Area
                        dataKey="portfolioValue"
                        type="bump"
                        fill="url(#fillValue)"
                        stroke={
                            filteredData.length > 0
                                ? "var(--primary-base)"
                                : "var(--muted-base)"
                        }
                    />
                </AreaChart>
            </ChartContainer>
        </div>
    );
};

export default PortfolioValueChart;
