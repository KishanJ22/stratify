import { useEffect, useState } from "react";
import {
    compoundingSimulatorSchema,
    CompoundingSimulatorSchema,
} from "./compounding-simulator-schema";
import { formOptions } from "@tanstack/react-form";
import {
    SearchAsset,
    useAssetSearch,
} from "../../markets/AssetSearch/useAssetSearch";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { useAppForm } from "@/app/components/Form/useForm";
import { Field, FieldLabel } from "@/app/components/ui/field";
import {
    Command,
    CommandInput,
    CommandList,
} from "@/app/components/ui/command";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/app/components/ui/skeleton";
import AssetNameCard from "../../portfolios/components/AddInvestment/AssetNameCard";
import { ChartConfig, ChartContainer } from "@/app/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { placeholderChartData } from "../../portfolios/components/PortfolioValueChart/placeholderChartData";

const defaultValues: CompoundingSimulatorSchema = {
    assetName: "",
    initialInvestment: 0,
    monthlyContribution: 0,
    timePeriodYears: 0,
    dividendYield: undefined,
};

const compoundingSimulatorFormOptions = formOptions({
    formId: "compounding-simulator-form",
    defaultValues,
});

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

const CompoundingSimulator = () => {
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    const [searchValue, setSearchValue] = useState("");
    const [selectedAsset, setSelectedAsset] = useState<SearchAsset | null>(
        null,
    );
    const [isAssetListOpen, setIsAssetListOpen] = useState(false);

    const debouncedSearchValue = useDebouncedValue(searchValue, {
        wait: 500,
    })[0];

    const {
        searchResults,
        isSearching,
        search,
        isNoResultsFound,
        searchStatus,
        resetSearch,
    } = useAssetSearch(debouncedSearchValue);

    useEffect(() => {
        if (debouncedSearchValue.length > 0) {
            search();
        }
    }, [debouncedSearchValue, search]);

    const form = useAppForm({
        ...compoundingSimulatorFormOptions,
        validators: {
            onChange: compoundingSimulatorSchema,
            onBlurAsync: async ({ value }) => {
                const result = compoundingSimulatorSchema.safeParse(value);

                return result.success
                    ? setIsSubmitDisabled(false)
                    : setIsSubmitDisabled(true);
            },
        },
    });

    return (
        <div className="flex flex-col gap-y-2.5">
            <div className="font-medium text-4xl leading-14 text-primary-dark">
                {"See compounding in action"}
            </div>
            <div className="flex flex-row gap-x-5">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                    className="bg-primary-lightest rounded-xl border border-primary-light py-2 px-3 flex flex-col gap-y-3"
                >
                    <form.AppField name="assetName">
                        {(field) => {
                            return (
                                <Field
                                    className="flex flex-col gap-y-1.5"
                                    data-testid="asset-name-field"
                                >
                                    <FieldLabel htmlFor="assetName">
                                        <span className="flex flex-row w-full items-center justify-between">
                                            Simulate with
                                            {field.state.value && (
                                                <span
                                                    className="p-0.5 px-1 rounded-lg bg-secondary-lighter font-sans font-semibold text-secondary-darker cursor-pointer hover:bg-secondary-base hover:text-secondary-lightest transition-colors"
                                                    onClick={() => {
                                                        setSearchValue("");
                                                        setSelectedAsset(null);
                                                        setIsAssetListOpen(
                                                            false,
                                                        );
                                                        setIsSubmitDisabled(
                                                            true,
                                                        );
                                                        form.reset();
                                                    }}
                                                >
                                                    Clear
                                                </span>
                                            )}
                                        </span>
                                    </FieldLabel>
                                    <Command>
                                        <CommandInput
                                            id="assetName"
                                            placeholder="Search for an asset by name or symbol"
                                            className="bg-white border border-secondary-dark rounded-md focus-visible:ring-secondary-dark"
                                            inputClassName="placeholder:text-secondary-light text-secondary-dark"
                                            showIcon={false}
                                            iconClassName="text-secondary-dark"
                                            disabled={field.state.value !== ""}
                                            value={
                                                field.state.value
                                                    ? `${selectedAsset?.name} (${selectedAsset?.symbol})`
                                                    : searchValue
                                            }
                                            onValueChange={(searchValue) =>
                                                setSearchValue(searchValue)
                                            }
                                            onFocus={() =>
                                                setIsAssetListOpen(true)
                                            }
                                        />
                                        {searchStatus != "idle" && (
                                            <CommandList
                                                className={cn(
                                                    "p-1 gap-y-1.5 bg-white border border-secondary-dark rounded-md mt-1",
                                                    isAssetListOpen
                                                        ? ""
                                                        : "hidden",
                                                )}
                                                asChild
                                            >
                                                {isSearching ? (
                                                    <div className="flex flex-col gap-2">
                                                        {Array.from({
                                                            length: 3,
                                                        }).map((_, index) => (
                                                            <Skeleton
                                                                key={index}
                                                                className="w-full h-10 rounded-xl bg-secondary-lighter"
                                                            />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col gap-y-1">
                                                        {searchResults?.map(
                                                            (asset) => (
                                                                <AssetNameCard
                                                                    key={`${asset.symbol}-${asset.name}`}
                                                                    asset={
                                                                        asset
                                                                    }
                                                                    onSelect={() => {
                                                                        field.handleChange(
                                                                            asset.name,
                                                                        );
                                                                        setSelectedAsset(
                                                                            asset,
                                                                        );
                                                                        setIsAssetListOpen(
                                                                            false,
                                                                        );

                                                                        resetSearch();
                                                                    }}
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                                {isNoResultsFound &&
                                                    !searchResults &&
                                                    searchStatus ===
                                                        "success" && (
                                                        <div className="p-2 text-center text-base font-sans text-secondary-dark">
                                                            No assets found.
                                                        </div>
                                                    )}
                                            </CommandList>
                                        )}
                                    </Command>
                                </Field>
                            );
                        }}
                    </form.AppField>
                    <div className="flex flex-row justify-between gap-x-5">
                        <form.AppField name="initialInvestment">
                            {({ state: { meta }, NumberInput }) => {
                                return (
                                    <NumberInput
                                        id="initialInvestment"
                                        dataTestId="initial-investment-field"
                                        label="Initial Investment"
                                        placeholder="Enter initial investment"
                                        type="number"
                                        error={
                                            meta.isTouched
                                                ? meta.errors?.[0]?.message
                                                : undefined
                                        }
                                    />
                                );
                            }}
                        </form.AppField>
                        <form.AppField name="monthlyContribution">
                            {({ state: { meta }, NumberInput }) => {
                                return (
                                    <NumberInput
                                        id="monthlyContribution"
                                        dataTestId="monthly-contribution-field"
                                        label="Monthly Contribution"
                                        placeholder="Enter monthly contribution"
                                        error={
                                            meta.isTouched
                                                ? meta.errors?.[0]?.message
                                                : undefined
                                        }
                                    />
                                );
                            }}
                        </form.AppField>
                    </div>
                    <div className="flex flex-row justify-between gap-x-5">
                        <form.AppField name="timePeriodYears">
                            {({ state: { meta }, NumberInput }) => {
                                return (
                                    <NumberInput
                                        id="timePeriodYears"
                                        dataTestId="time-period-years-field"
                                        label="Time Period (Years)"
                                        placeholder="Enter time period in years"
                                        error={
                                            meta.isTouched
                                                ? meta.errors?.[0]?.message
                                                : undefined
                                        }
                                    />
                                );
                            }}
                        </form.AppField>
                        <form.AppField name="dividendYield">
                            {({ state: { meta }, NumberInput }) => {
                                return (
                                    <NumberInput
                                        id="dividendYield"
                                        dataTestId="dividend-yield-field"
                                        label="Dividend Yield"
                                        placeholder="Enter dividend yield (optional)"
                                        error={
                                            meta.isTouched
                                                ? meta.errors?.[0]?.message
                                                : undefined
                                        }
                                    />
                                );
                            }}
                        </form.AppField>
                    </div>
                    <div className="w-full my-8">
                        <form.Subscribe
                            selector={(state) => [
                                state.canSubmit,
                                state.isSubmitting,
                            ]}
                        >
                            <form.SubmitButton
                                label="Simulate"
                                className="w-full"
                                isDisabled={
                                    !form.state.canSubmit || isSubmitDisabled
                                }
                                isLoading={form.state.isSubmitting}
                            />
                        </form.Subscribe>
                    </div>
                </form>
                <div className="flex flex-1 flex-col gap-y-2.5 items-center justify-center">
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-56"
                    >
                        <AreaChart data={placeholderChartData}>
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
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                hide={false}
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
                            <Area
                                dataKey="noCompounding"
                                type="natural"
                                fill="url(#fillNoCompounding)"
                                stroke="var(--accent-base)"
                                stackId="a"
                            />
                            <Area
                                dataKey="compounding"
                                type="natural"
                                fill="url(#fillCompounding)"
                                stroke="var(--secondary-base)"
                                stackId="a"
                            />
                            <Area
                                dataKey="compoundingWithDividends"
                                type="natural"
                                fill="url(#fillCompoundingWithDividends)"
                                stroke="var(--primary-base)"
                                stackId="a"
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
};

export default CompoundingSimulator;
