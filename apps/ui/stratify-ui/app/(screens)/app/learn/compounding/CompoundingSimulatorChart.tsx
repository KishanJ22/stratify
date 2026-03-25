import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
} from "@/app/components/ui/chart";
import { Area, AreaChart, XAxis } from "recharts";
import { Skeleton } from "@/app/components/ui/skeleton";
import { CompoundingSimulatorSuccessResponse } from "./useCompoundingSimulator";
import { placeholderChartData } from "./placeholderChartData";

interface ChartTooltipProps {
    active?: boolean;
    payload: CompoundingSimulatorSuccessResponse["data"]["results"][number];
}

const CustomChartTooltip = ({ active, payload }: ChartTooltipProps) => {
    if (!active) return null;

    const {
        date,
        noCompoundingValue,
        compoundingValue,
        compoundingWithDividendsValue,
    } = payload;

    const formattedDate = new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="bg-primary-lightest border border-primary-light rounded-md p-2 font-sans flex flex-col items-start gap-y-1">
            <div className="font-semibold text-base text-primary-darker">
                {formattedDate}
            </div>
            <div className="flex flex-col text-sm w-full">
                {compoundingWithDividendsValue ? (
                    <div className="flex flex-row justify-between gap-x-2">
                        <div className="flex flex-row items-center justify-items-center gap-x-1">
                            <div
                                className="w-1 h-3 py-1 rounded-sm"
                                style={{
                                    backgroundColor: "var(--primary-base)",
                                }}
                            />
                            {"Compounding with dividends"}
                        </div>
                        <div>
                            {compoundingWithDividendsValue.toLocaleString()}
                        </div>
                    </div>
                ) : null}
                <div className="flex flex-row justify-between gap-x-2">
                    <div className="flex flex-row items-center justify-items-center gap-x-1">
                        <div
                            className="w-1 h-3 py-1 rounded-sm"
                            style={{ backgroundColor: "var(--secondary-base)" }}
                        />
                        {"Compounding"}
                    </div>
                    <div>{compoundingValue.toLocaleString()}</div>
                </div>
                <div className="flex flex-row justify-between gap-x-2">
                    <div className="flex flex-row items-center justify-items-center gap-x-1">
                        <div
                            className="w-1 h-3 py-1 rounded-sm"
                            style={{ backgroundColor: "var(--accent-base)" }}
                        />
                        {"No Compounding"}
                    </div>
                    <div>{noCompoundingValue.toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
};

const chartConfig = {
    noCompounding: {
        label: "No Compounding",
        color: "var(--accent-base)",
    },
    compounding: {
        label: "Compounding",
        color: "var(--secondary-base)",
    },
    compoundingWithDividends: {
        label: "Compounding and Dividends",
        color: "var(--primary-base)",
    },
} satisfies ChartConfig;

export interface CompoundingSimulatorChartProps {
    data: CompoundingSimulatorSuccessResponse["data"]["results"];
    isLoading: boolean;
}

const CompoundingSimulatorChart = ({
    data,
    isLoading,
}: CompoundingSimulatorChartProps) => {
    return isLoading ? (
        <Skeleton className="w-full h-62.5 mt-2" />
    ) : (
        <ChartContainer config={chartConfig} className="aspect-auto h-62.5">
            <AreaChart data={data.length > 0 ? data : placeholderChartData}>
                <defs>
                    <linearGradient
                        id="fillNoCompounding"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="5%"
                            stopColor="var(--accent-base)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="var(--accent-base)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                    <linearGradient
                        id="fillCompounding"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="5%"
                            stopColor="var(--secondary-base)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="var(--secondary-base)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                    <linearGradient
                        id="fillCompoundingWithDividends"
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
                <XAxis
                    dataKey="date"
                    hide={data.length === 0}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={40}
                    tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                        });
                    }}
                />

                {data.length > 0 ? (
                    <ChartTooltip
                        cursor={false}
                        content={({ active, payload }) => (
                            <CustomChartTooltip
                                active={active}
                                payload={payload?.[0]?.payload}
                            />
                        )}
                    />
                ) : null}

                <Area
                    dataKey="noCompoundingValue"
                    type="natural"
                    fill="url(#fillNoCompounding)"
                    stroke="var(--accent-base)"
                    stackId="a"
                />
                <Area
                    dataKey="compoundingValue"
                    type="natural"
                    fill="url(#fillCompounding)"
                    stroke="var(--secondary-base)"
                    stackId="a"
                />
                <Area
                    dataKey="compoundingWithDividendsValue"
                    type="natural"
                    fill="url(#fillCompoundingWithDividends)"
                    stroke="var(--primary-base)"
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
    );
};

export default CompoundingSimulatorChart;
