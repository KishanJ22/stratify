import { useMemo, useState } from "react";
import { AssetType } from "../../markets/MarketDataTable/MarketDataTable";
import { Investment } from "../InvestmentsTable/InvestmentsTable";
import { GroupByOption } from "./GroupBySelector";
import { Label, Pie, PieChart, ResponsiveContainer } from "recharts";
import { ChartTooltip } from "@/app/components/ui/chart";
import { placeholderData } from "./placeholderChartData";
import PieChartSkeleton from "./PieChartSkeleton";
import { useSessionContext } from "../../SessionProvider";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";

const colourVars = [
    "var(--primary-base)",
    "var(--secondary-base)",
    "var(--accent-base)",
    "var(--positive-base)",
    "var(--negative-base)",
    "var(--primary-dark)",
    "var(--secondary-dark)",
    "var(--accent-dark)",
    "var(--primary-darker)",
    "var(--secondary-darker)",
    "var(--accent-darker)",
    "var(--primary-darkest)",
    "var(--secondary-darkest)",
    "var(--accent-darkest)",
];

interface AssetClassConfig {
    label: string;
    colour: string;
}

const assetClasses = {
    STOCK: {
        label: "Stock",
        colour: "var(--secondary-base)",
    },
    CRYPTOCURRENCY: {
        label: "Cryptocurrency",
        colour: "var(--accent-base)",
    },
    ETF: {
        label: "Exchange traded fund",
        colour: "var(--primary-base)",
    },
} as Record<AssetType, AssetClassConfig>;

export interface ChartDataItem {
    label: string | number;
    currentValue: number;
    absoluteReturn: number;
    percentageReturn: number;
    assetCount: number;
    fill: string;
    sector?: string;
    countryId?: number;
}

interface CustomLegendProps {
    data: ChartDataItem[];
    groupBy: GroupByOption;
}

const CustomLegend = ({ data, groupBy }: CustomLegendProps) => {
    return (
        <div
            className={cn(
                "flex flex-col font-sans justify-items-start text-secondary-dark w-full mt-5 gap-y-1",
                groupBy !== "assetClass" && "grid grid-cols-2",
            )}
            data-testid="asset-allocation-legend"
        >
            {data.map((item) => (
                <div
                    key={item.label}
                    className="flex items-center gap-2 text-base"
                >
                    <div
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: item.fill }}
                    />
                    {item.label}
                </div>
            ))}
        </div>
    );
};

interface ChartTooltipContentProps {
    active: boolean;
    groupBy: GroupByOption;
    data: ChartDataItem;
    totalPortfolioValue: number;
    currency: string;
}

const CustomTooltip = ({
    active,
    groupBy,
    data,
    totalPortfolioValue,
    currency,
}: ChartTooltipContentProps) => {
    if (!active || !data) return null;

    const portfolioAllocationPercentage = (
        (data.currentValue / totalPortfolioValue) *
        100
    ).toFixed(2);

    return (
        <div className="flex flex-col items-start gap-y-1 bg-secondary-lightest border border-secondary-dark rounded-md py-1 px-2 font-sans text-secondary-base font-medium">
            <div className="font-semibold text-base text-secondary-dark text-nowrap">
                {data.label}
            </div>
            {groupBy === "noGrouping" ? (
                <div className="flex flex-col text-sm w-full">
                    <div className="flex flex-row justify-between gap-x-2">
                        {"Country"}
                        <div>{data?.countryId}</div>
                    </div>
                    <div className="flex flex-row justify-between gap-x-2">
                        {"Sector"}
                        <div>{data?.sector}</div>
                    </div>
                    <div className="flex flex-row justify-between gap-x-2">
                        {"Portfolio allocation"}
                        <div>{`${portfolioAllocationPercentage}%`}</div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col text-sm w-full">
                    <div className="flex flex-row justify-between gap-x-2">
                        {"Number of assets"}
                        <div>{data.assetCount}</div>
                    </div>
                    <div className="flex flex-row justify-between gap-x-2">
                        {"Portfolio allocation"}
                        <div>{`${portfolioAllocationPercentage}%`}</div>
                    </div>
                    <div className="flex flex-row justify-between gap-x-2">
                        {`Return (${currency})`}
                        <div
                            className={`${data.currentValue > 0 ? "text-positive-base" : "text-negative-base"}`}
                        >
                            {data.currentValue > 0
                                ? `+ ${data.absoluteReturn.toLocaleString()}`
                                : data.absoluteReturn.toLocaleString()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export interface AssetAllocationChartProps {
    data: Investment[];
    groupBy: GroupByOption;
    isLoading: boolean;
}

const AssetAllocationChart = ({
    data,
    groupBy,
    isLoading,
}: AssetAllocationChartProps) => {
    const { session } = useSessionContext();
    const userCurrency = session?.userDetails.currency;

    const [isLegendVisible, setIsLegendVisible] = useState<boolean>(false);

    const groupedData = useMemo(() => {
        const assetClass = data.reduce((acc, investment) => {
            const assetTypeConfig = assetClasses[investment.type];

            const existingItem = acc.find(
                (item) => item.label === assetTypeConfig.label,
            );

            if (existingItem) {
                existingItem.currentValue += investment.currentValue;
                existingItem.absoluteReturn += investment.currentReturn;
                existingItem.percentageReturn +=
                    investment.currentReturnPercentage;
                existingItem.assetCount += 1;
            } else {
                acc.push({
                    label: assetTypeConfig.label,
                    currentValue: investment.currentValue,
                    fill: assetTypeConfig.colour,
                    absoluteReturn: investment.currentReturn,
                    percentageReturn: investment.currentReturnPercentage,
                    assetCount: 1,
                });
            }

            return acc;
        }, [] as ChartDataItem[]);

        const country = data.reduce((acc, investment) => {
            const countryId = investment.assetCountryId;

            const existingItem = acc.find((item) => item.label === countryId);

            if (existingItem) {
                existingItem.currentValue += investment.currentValue;
                existingItem.absoluteReturn += investment.currentReturn;
                existingItem.percentageReturn +=
                    investment.currentReturnPercentage;
                existingItem.assetCount += 1;
            } else {
                acc.push({
                    label: countryId,
                    currentValue: investment.currentValue,
                    fill: colourVars[
                        Object.keys(acc).length % colourVars.length
                    ],
                    absoluteReturn: investment.currentReturn,
                    percentageReturn: investment.currentReturnPercentage,
                    assetCount: 1,
                });
            }

            return acc;
        }, [] as ChartDataItem[]);

        const sector = data.reduce((acc, investment) => {
            investment.sectorDetails.forEach(({ sector, weight }) => {
                const existingItem = acc.find((item) => item.label === sector);

                if (existingItem) {
                    existingItem.currentValue +=
                        investment.currentValue * weight;
                    existingItem.absoluteReturn +=
                        investment.currentReturn * weight;
                    existingItem.percentageReturn +=
                        investment.currentReturnPercentage * weight;
                    existingItem.assetCount += 1;
                } else {
                    acc.push({
                        label: sector,
                        currentValue: investment.currentValue * weight,
                        fill: colourVars[
                            Object.keys(acc).length % colourVars.length
                        ],
                        absoluteReturn: investment.currentReturn,
                        percentageReturn: investment.currentReturnPercentage,
                        assetCount: 1,
                    });
                }
            });
            return acc;
        }, [] as ChartDataItem[]);

        const noGrouping = data.reduce((acc, investment) => {
            acc.push({
                label: investment.name,
                countryId: investment.assetCountryId,
                sector: investment.sectorDetails[0].sector,
                currentValue: investment.currentValue,
                fill: colourVars[Object.keys(acc).length % colourVars.length],
                absoluteReturn: investment.currentReturn,
                percentageReturn: investment.currentReturnPercentage,
                assetCount: 1,
            });

            return acc;
        }, [] as ChartDataItem[]);

        return {
            assetClass: assetClass.sort(
                (a, b) => b.currentValue - a.currentValue,
            ),
            country: country.sort((a, b) => b.currentValue - a.currentValue),
            sector: sector.sort((a, b) => b.currentValue - a.currentValue),
            noGrouping: noGrouping.sort(
                (a, b) => b.currentValue - a.currentValue,
            ),
        };
    }, [data]);

    const selectedGroupData =
        data.length > 0 ? groupedData[groupBy] : placeholderData;

    const totalPortfolioValue = data.reduce((sum, investment) => {
        return sum + investment.currentValue;
    }, 0);

    return isLoading ? (
        <PieChartSkeleton />
    ) : (
        <div
            className="flex flex-col items-center w-full"
            data-testid="asset-allocation-chart"
        >
            <ResponsiveContainer
                width="100%"
                height={250}
                className={`${isLegendVisible ? "hidden" : ""}`}
            >
                <PieChart>
                    {data.length > 0 ? (
                        <ChartTooltip
                            cursor={false}
                            animationEasing="ease"
                            content={({ active, payload }) => (
                                <CustomTooltip
                                    active={active}
                                    groupBy={groupBy}
                                    data={payload[0]?.payload}
                                    totalPortfolioValue={totalPortfolioValue}
                                    currency={userCurrency!}
                                />
                            )}
                        />
                    ) : null}
                    <Pie
                        nameKey="label"
                        dataKey="currentValue"
                        data={selectedGroupData}
                        innerRadius={85}
                        outerRadius={110}
                        paddingAngle={selectedGroupData.length > 1 ? 3 : 0}
                        cx="50%"
                        cy="50%"
                    >
                        <Label
                            content={({ viewBox }) => {
                                if (
                                    viewBox &&
                                    "cx" in viewBox &&
                                    "cy" in viewBox
                                ) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            {!isLoading && data.length === 0 ? (
                                                <>
                                                    <tspan
                                                        className="font-sans font-medium text-lg fill-secondary-light"
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                    >
                                                        {"No data"}
                                                    </tspan>
                                                    <tspan
                                                        className="font-sans font-medium text-lg fill-secondary-light"
                                                        x={viewBox.cx}
                                                        y={
                                                            (viewBox.cy || 0) +
                                                            24
                                                        }
                                                    >
                                                        {"Available"}
                                                    </tspan>
                                                </>
                                            ) : (
                                                <>
                                                    <tspan
                                                        className="font-sans font-bold text-5xl leading-10 fill-secondary-base"
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                    >
                                                        {data.length}
                                                    </tspan>
                                                    <tspan
                                                        className="font-sans text-xl fill-secondary-base"
                                                        x={viewBox.cx}
                                                        y={
                                                            (viewBox.cy || 0) +
                                                            32
                                                        }
                                                    >
                                                        {data.length === 1
                                                            ? "asset"
                                                            : "assets"}
                                                    </tspan>
                                                </>
                                            )}
                                        </text>
                                    );
                                }
                            }}
                        />
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            {data.length > 0 ? (
                <>
                    {isLegendVisible && (
                        <CustomLegend
                            data={selectedGroupData}
                            groupBy={groupBy}
                        />
                    )}
                    <Button
                        variant="secondary"
                        className="mt-5 w-full"
                        onClick={() => setIsLegendVisible(!isLegendVisible)}
                        data-testid="toggle-legend-button"
                    >
                        {isLegendVisible ? "View Pie Chart" : "View Legend"}
                    </Button>
                </>
            ) : null}
        </div>
    );
};

export default AssetAllocationChart;
