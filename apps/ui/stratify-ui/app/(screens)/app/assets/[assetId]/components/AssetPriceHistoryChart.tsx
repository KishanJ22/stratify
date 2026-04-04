"use client";

import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/app/components/ui/chart";
import { useState } from "react";
import { DateRange } from "../../../portfolios/components/PortfolioValueChart/HistoryDateRangeSelector";
import PortfolioValueChartSkeleton from "../../../portfolios/components/PortfolioValueChart/PortfolioValueChartSkeleton";
import { placeholderChartData } from "./placeholderChartData";
import {
    AssetPriceHistory,
    useAssetPriceHistory,
} from "../hooks/useAssetPriceHistory";
import AssetPriceDetails from "./AssetPriceDetails";
import { useAssetCurrentPrice } from "../hooks/useAssetCurrentPrice";
import { formatNumericValue } from "@/app/utils/formatNumericValue";

interface ChartTooltipProps {
    active?: boolean;
    date: string;
    priceDetails: AssetPriceHistory["priceDetails"];
    currency: string;
}

const CustomChartTooltip = ({
    active,
    date,
    priceDetails,
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
                {formatNumericValue(priceDetails.close, currency)}
            </div>
        </div>
    );
};

export interface AssetPriceHistoryChartProps {
    assetId: number | null;
    assetCurrency: string;
    isAssetDetailsLoading: boolean;
}

const AssetPriceHistoryChart = ({
    assetId,
    assetCurrency,
    isAssetDetailsLoading,
}: AssetPriceHistoryChartProps) => {
    const [selectedDateRange, setSelectedDateRange] =
        useState<DateRange>("30d");

    const { data: currentPrice, isLoading: isCurrentPriceLoading } =
        useAssetCurrentPrice(assetId);
    const { data: assetPriceHistory, isLoading: isAssetPriceHistoryLoading } =
        useAssetPriceHistory(assetId);

    const isLoading =
        isCurrentPriceLoading ||
        isAssetPriceHistoryLoading ||
        isAssetDetailsLoading;

    const filteredData =
        assetPriceHistory?.filter((value) => {
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
            <AssetPriceDetails
                filteredData={filteredData}
                currentPrice={currentPrice?.price ?? null}
                assetCurrency={assetCurrency}
                selectedDateRange={selectedDateRange}
                setSelectedDateRange={setSelectedDateRange}
            />
            <ChartContainer
                config={{
                    priceDetails: {
                        label: "Price",
                        color: "var(--primary-base)",
                    },
                }}
                className="aspect-auto h-72"
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
                                year: "numeric",
                            });
                        }}
                    />
                    <YAxis
                        dataKey="priceDetails.close"
                        hide={filteredData.length === 0}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={40}
                        tickFormatter={(value) => {
                            return value.toLocaleString();
                        }}
                    />

                    {filteredData.length > 0 ? (
                        <ChartTooltip
                            cursor={false}
                            content={({ active, payload }) => (
                                <CustomChartTooltip
                                    active={active}
                                    date={payload?.[0]?.payload.date}
                                    priceDetails={
                                        payload?.[0]?.payload?.priceDetails
                                    }
                                    currency={assetCurrency}
                                />
                            )}
                        />
                    ) : null}
                    <Area
                        dataKey="priceDetails.close"
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

export default AssetPriceHistoryChart;
