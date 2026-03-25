import { formOptions } from "@tanstack/react-form";
import {
    compoundingSimulatorSchema,
    CompoundingSimulatorSchema,
} from "./compounding-simulator-schema";
import { useEffect, useState } from "react";
import {
    SearchAsset,
    useAssetSearch,
} from "../../markets/AssetSearch/useAssetSearch";
import { useDebouncedValue } from "@tanstack/react-pacer";
import type {
    CompoundingSimulatorRequestSchema,
    MutateCompoundingSimulator,
} from "./useCompoundingSimulator";
import { useAppForm } from "@/app/components/Form/useForm";
import { HTTPError } from "ky";
import { AddTradeErrorResponse } from "../../portfolios/hooks/useAddTrade";
import { Field, FieldLabel } from "@/app/components/ui/field";
import {
    Command,
    CommandInput,
    CommandList,
} from "@/app/components/ui/command";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/app/components/ui/skeleton";
import AssetNameCard from "../../portfolios/components/AddInvestment/AssetNameCard";

const defaultValues: CompoundingSimulatorSchema = {
    assetName: "",
    initialInvestment: 0,
    monthlyContribution: 0,
    timePeriodYears: 0,
    dividendYield: "",
};

const compoundingSimulatorFormOptions = formOptions({
    formId: "compounding-simulator-form",
    defaultValues,
});

export interface CompoundingSimulatorFormProps {
    executeSimulation: MutateCompoundingSimulator;
    resetSimulation: () => void;
    isPending: boolean;
}

const CompoundingSimulatorForm = ({
    executeSimulation,
    resetSimulation,
    isPending,
}: CompoundingSimulatorFormProps) => {
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [selectedAsset, setSelectedAsset] = useState<SearchAsset | null>(
        null,
    );
    const [isAssetListOpen, setIsAssetListOpen] = useState(false);
    const [simulationError, setSimulationError] = useState<string | null>(null);

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
        onSubmit: async ({ value }) => {
            if (!selectedAsset) return;

            const requestBody = {
                assetId: selectedAsset.id,
                initialInvestment: value.initialInvestment,
                monthlyContribution: value.monthlyContribution,
                timePeriodYears: value.timePeriodYears,
                dividendYield: value.dividendYield
                    ? parseFloat(value.dividendYield)
                    : null,
            } satisfies CompoundingSimulatorRequestSchema;

            executeSimulation(requestBody, {
                onError: async (error) => {
                    if (error instanceof HTTPError) {
                        const errorJson: AddTradeErrorResponse =
                            await error.response.json();

                        const errorMessage = errorJson?.message;
                        setSimulationError(errorMessage);
                    }
                },
            });
        },
    });

    return (
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
                                                setIsAssetListOpen(false);
                                                setIsSubmitDisabled(true);
                                                setSimulationError(null);
                                                resetSimulation();
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
                                    onFocus={() => setIsAssetListOpen(true)}
                                />
                                {searchStatus != "idle" && (
                                    <CommandList
                                        className={cn(
                                            "p-1 gap-y-1.5 bg-white border border-secondary-dark rounded-md mt-1",
                                            isAssetListOpen ? "" : "hidden",
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
                                                {searchResults?.map((asset) => (
                                                    <AssetNameCard
                                                        key={`${asset.symbol}-${asset.name}`}
                                                        asset={asset}
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
                                                ))}
                                            </div>
                                        )}
                                        {isNoResultsFound &&
                                            !searchResults &&
                                            searchStatus === "success" && (
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
                    {({ state: { meta }, TextInput }) => {
                        return (
                            <TextInput
                                id="dividendYield"
                                dataTestId="annual-dividend-yield-field"
                                label="Annual Dividend Yield"
                                placeholder="Optional"
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

            {simulationError ? (
                <div className="text-negative-base text-sm font-sans mt-1">
                    {simulationError}
                </div>
            ) : null}

            <div className="w-full h-full content-center">
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                    <form.SubmitButton
                        label="Simulate"
                        className="w-full"
                        isDisabled={
                            !form.state.canSubmit ||
                            isSubmitDisabled ||
                            isPending
                        }
                        isLoading={form.state.isSubmitting || isPending}
                    />
                </form.Subscribe>
            </div>
        </form>
    );
};

export default CompoundingSimulatorForm;
