"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    type ChartConfig,
} from "@/app/components/ui/chart";
import { Tooltip } from "@/app/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { useSessionContext } from "../../SessionProvider";
import { Skeleton } from "@/app/components/ui/skeleton";
import { usePortfolioValueHistory } from "./usePortfolioValueHistory";
import { Dispatch, SetStateAction, useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";

interface ChartTooltip {
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
}: ChartTooltip) => {
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

const dateRanges = [
    {
        label: "Last 7 days",
        value: "7d",
    },
    {
        label: "Last 30 days",
        value: "30d",
    },
    {
        label: "Last 6 months",
        value: "6m",
    },
    {
        label: "Last 12 months",
        value: "12m",
    },
    {
        label: "All time",
        value: "all",
    },
];

interface HistoryDateRangeSelectorProps {
    selectedDateRange: string;
    setSelectedDateRange: Dispatch<SetStateAction<string>>;
}

const HistoryDateRangeSelector = ({
    selectedDateRange,
    setSelectedDateRange,
}: HistoryDateRangeSelectorProps) => {
    return (
        <Select
            value={selectedDateRange}
            onValueChange={(value) => setSelectedDateRange(value)}
        >
            <SelectTrigger className="max-w-32">
                <SelectValue data-testid="date-range-select-value" />
            </SelectTrigger>
            <SelectContent side="bottom" align="start">
                <SelectGroup className="flex flex-col gap-y-1">
                    {dateRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                            {range.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

const chartConfig = {
    portfolioValue: {
        label: "Portfolio value",
        color: "var(--primary-base)",
    },
} satisfies ChartConfig;

interface PortfolioValueChartProps {
    portfolioId: number | null;
}

const now = new Date();

const PortfolioValueChart = ({ portfolioId }: PortfolioValueChartProps) => {
    const { session } = useSessionContext();
    const currency = session?.userDetails.currency;

    const [selectedDateRange, setSelectedDateRange] = useState("30d");
    const { data, isLoading } = usePortfolioValueHistory(portfolioId);

    const filteredData = data?.filter((value) => {
        const valueDate = new Date(value.date);
        const startDate = new Date();

        const isWeekend = valueDate.getDay() === 0 || valueDate.getDay() === 6;
        if (isWeekend) return false;

        switch (selectedDateRange) {
            case "7d": {
                startDate.setDate(now.getDate() - 7);
                return valueDate >= startDate;
            }
            case "30d": {
                startDate.setDate(now.getDate() - 30);
                return valueDate >= startDate;
            }
            case "6m": {
                startDate.setMonth(now.getMonth() - 6);
                return valueDate >= startDate;
            }
            case "12m": {
                startDate.setFullYear(now.getFullYear() - 1);
                return valueDate >= startDate;
            }
            case "all":
                return true;
        }
    });

    const latestValue =
        filteredData && filteredData.length > 0
            ? filteredData[filteredData.length - 1].portfolioValue
            : null;

    return (
        <div className="flex flex-col w-full font-sans">
            <div className="flex flex-col">
                <div className="flex flex-row items-center text-2xl text-primary-dark font-semibold justify-between">
                    <div className="flex flex-row items-center gap-x-1.5">
                        <span>Portfolio value</span>
                        <Tooltip>
                            <InfoIcon
                                size={20}
                                className="text-primary-dark mt-1"
                            />
                        </Tooltip>
                    </div>
                    <HistoryDateRangeSelector
                        selectedDateRange={selectedDateRange}
                        setSelectedDateRange={setSelectedDateRange}
                    />
                </div>
                {isLoading ? (
                    <div className="mt-2 flex flex-col items-center gap-y-2">
                        <Skeleton className="w-32 h-10 self-start" />
                        <Skeleton className="w-32 h-5 self-start" />
                    </div>
                ) : (
                    <div className="flex flex-row text-muted-base text-3xl font-semibold">
                        <div>{latestValue?.toLocaleString()}</div>
                        <div className="text-base ml-1 mt-2 content-end">
                            ({currency})
                        </div>
                    </div>
                )}
            </div>
            {isLoading ? (
                <Skeleton className="w-full h-[250px] mt-2" />
            ) : (
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto w-full h-[250px]"
                >
                    <AreaChart data={filteredData}>
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
                                    stopColor="var(--primary-base)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--primary-base)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
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
                        <Area
                            dataKey="portfolioValue"
                            type="bump"
                            fill="url(#fillValue)"
                            stroke="var(--primary-base)"
                        />
                    </AreaChart>
                </ChartContainer>
            )}
        </div>
    );
};

export default PortfolioValueChart;
