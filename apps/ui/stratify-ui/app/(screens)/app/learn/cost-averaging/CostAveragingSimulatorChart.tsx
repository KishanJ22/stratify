import { ChartTooltip } from "@/app/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, XAxis } from "recharts";
import { Skeleton } from "@/app/components/ui/skeleton";
import type { CostAveragingSimulatorSuccessResponse } from "./useCostAveragingSimulator";
import { placeholderChartData } from "./placeholderChartData";

interface ChartTooltipProps {
    active?: boolean;
    payload: CostAveragingSimulatorSuccessResponse["data"]["results"][number];
}

const CustomChartTooltip = ({ active, payload }: ChartTooltipProps) => {
    if (!active) return null;

    const { date, lumpSumValue, costAveragingValue } = payload;

    const formattedDate = new Date(date).toLocaleDateString("en", {
        month: "short",
        year: "numeric",
    });

    return (
        <div className="bg-primary-lightest border border-primary-light rounded-md p-2 font-sans flex flex-col items-start gap-y-1">
            <div className="font-semibold text-base text-primary-darker">
                {formattedDate}
            </div>
            <div className="flex flex-col text-sm w-full">
                <div className="flex flex-row justify-between gap-x-2">
                    <div className="flex flex-row items-center justify-items-center gap-x-1">
                        <div
                            className="w-1 h-3 py-1 rounded-sm"
                            style={{ backgroundColor: "var(--secondary-base)" }}
                        />
                        {"Cost averaging"}
                    </div>
                    <div>{costAveragingValue.toLocaleString()}</div>
                </div>
                <div className="flex flex-row justify-between gap-x-2">
                    <div className="flex flex-row items-center justify-items-center gap-x-1">
                        <div
                            className="w-1 h-3 py-1 rounded-sm"
                            style={{ backgroundColor: "var(--primary-base)" }}
                        />
                        {"Lump Sum"}
                    </div>
                    <div>{lumpSumValue.toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
};

export interface CostAveragingSimulatorChartProps {
    data: CostAveragingSimulatorSuccessResponse["data"]["results"];
    isLoading: boolean;
}

const CostAveragingSimulatorChart = ({
    data,
    isLoading,
}: CostAveragingSimulatorChartProps) => {
    return isLoading ? (
        <Skeleton
            className="w-full h-62.5 mt-2"
            data-testid="cost-averaging-simulator-chart-skeleton"
        />
    ) : (
        <div data-testid="cost-averaging-simulator-chart">
            <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data.length > 0 ? data : placeholderChartData}>
                    <defs>
                        <linearGradient
                            id="fillCostAveraging"
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
                            id="fillLumpSum"
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
                        dataKey="costAveragingValue"
                        type="natural"
                        fill="url(#fillCostAveraging)"
                        stroke="var(--secondary-base)"
                        stackId="a"
                        data-testid="cost-averaging-area"
                    />
                    <Area
                        dataKey="lumpSumValue"
                        type="natural"
                        fill="url(#fillLumpSum)"
                        stroke="var(--primary-base)"
                        stackId="a"
                        data-testid="lump-sum-area"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CostAveragingSimulatorChart;
