import { formOptions, useStore } from "@tanstack/react-form";
import {
    costAveragingSimulatorSchema,
    CostAveragingSimulatorSchema,
} from "./costAveragingSimulatorSchema";
import {
    SearchAsset,
    useAssetSearch,
} from "../../markets/AssetSearch/useAssetSearch";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { useAppForm } from "@/app/components/Form/useForm";
import { HTTPError } from "ky";
import { AddTradeErrorResponse } from "../../portfolios/hooks/useAddTrade";
import { Field, FieldLabel } from "@/app/components/ui/field";
import type {
    CostAveragingSimulatorRequestSchema,
    MutateCostAveragingSimulator,
} from "./useCostAveragingSimulator";
import {
    Command,
    CommandInput,
    CommandList,
} from "@/app/components/ui/command";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/app/components/ui/skeleton";
import AssetNameCard from "../../portfolios/components/AddInvestment/AssetNameCard";
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";

const defaultValues: CostAveragingSimulatorSchema = {
    assetName: "",
    totalInvestment: "",
    contributionFrequency: "monthly",
    timePeriodYears: "",
    amountPerContribution: "",
};

const costAveragingSimulatorFormOptions = formOptions({
    formId: "cost-averaging-simulator-form",
    defaultValues,
});

const contributionFrequencyOptions = [
    {
        label: "Weekly",
        value: "weekly",
    },
    {
        label: "Monthly",
        value: "monthly",
    },
    {
        label: "Quarterly",
        value: "quarterly",
    },
    {
        label: "Annually",
        value: "annually",
    },
];

const contributionFrequencyToAmountLabelMap = {
    weekly: "Amount per Week",
    monthly: "Amount per Month",
    quarterly: "Amount per Quarter",
    annually: "Amount per Year",
} as const;

const contributionFrequencyToContributionsPerYearMap = {
    weekly: 52,
    monthly: 12,
    quarterly: 4,
    annually: 1,
} as const;

export interface CostAveragingSimulatorFormProps {
    executeSimulation: MutateCostAveragingSimulator;
    resetSimulation: () => void;
    isPending: boolean;
}

const CostAveragingSimulatorForm = ({
    executeSimulation,
    resetSimulation,
    isPending,
}: CostAveragingSimulatorFormProps) => {
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
        ...costAveragingSimulatorFormOptions,
        validators: {
            onChange: costAveragingSimulatorSchema,
            onBlurAsync: async ({ value }) => {
                const result = costAveragingSimulatorSchema.safeParse(value);

                return result.success
                    ? setIsSubmitDisabled(false)
                    : setIsSubmitDisabled(true);
            },
        },
        onSubmit: async ({ value }) => {
            if (!selectedAsset) return;

            const requestBody = {
                assetId: selectedAsset.id,
                totalInvestment: parseFloat(value.totalInvestment),
                contributionFrequency: value.contributionFrequency,
                amountPerContribution: parseFloat(value.amountPerContribution),
                timePeriodYears: parseInt(value.timePeriodYears),
            } satisfies CostAveragingSimulatorRequestSchema;

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

    const formValues = useStore(form.store, (state) => state.values);

    useEffect(() => {
        if (formValues.totalInvestment && formValues.timePeriodYears) {
            const totalContributions =
                parseInt(formValues.timePeriodYears) *
                contributionFrequencyToContributionsPerYearMap[
                    formValues.contributionFrequency
                ];

            form.setFieldValue(
                "amountPerContribution",
                (
                    parseFloat(formValues.totalInvestment) / totalContributions
                ).toFixed(2),
            );
        }
    }, [
        formValues.totalInvestment,
        formValues.timePeriodYears,
        formValues.contributionFrequency,
    ]);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
            className="bg-primary-lightest rounded-xl border border-primary-light py-2 px-3 flex flex-col gap-y-3 w-1/3"
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
                <form.AppField name="totalInvestment">
                    {({ state: { meta }, TextInput }) => {
                        return (
                            <TextInput
                                id="totalInvestment"
                                dataTestId="total-investment-field"
                                label="Total Investment"
                                placeholder="e.g. 100,000"
                                error={
                                    meta.isTouched
                                        ? meta.errors?.[0]?.message
                                        : undefined
                                }
                            />
                        );
                    }}
                </form.AppField>
                <form.AppField name="contributionFrequency">
                    {(field) => {
                        return (
                            <Field
                                className="flex flex-col gap-y-1.5"
                                data-testid="contribution-frequency-field"
                            >
                                <FieldLabel htmlFor="contributionFrequency">
                                    Contribution Frequency
                                </FieldLabel>
                                <Select
                                    value={field.state.value}
                                    onValueChange={(value) =>
                                        field.handleChange(
                                            value as CostAveragingSimulatorSchema["contributionFrequency"],
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        iconClassName="text-secondary-dark"
                                        className="border-secondary-dark bg-white text-secondary-dark ring-secondary-dark shadow-none"
                                    >
                                        <SelectValue data-testid="contribution-frequency-select-value" />
                                    </SelectTrigger>
                                    <SelectContent
                                        className="border-secondary-base bg-white text-secondary-dark"
                                        side="bottom"
                                        align="start"
                                    >
                                        <SelectGroup
                                            className="flex flex-col gap-y-1"
                                            data-testid="contribution-frequency-select-options"
                                        >
                                            {contributionFrequencyOptions.map(
                                                (option) => (
                                                    <SelectItem
                                                        className="data-highlighted:bg-secondary-lighter data-[state=checked]:bg-secondary-light/70 data-[state=checked]:text-secondary-darkest text-secondary-dark cursor-pointer"
                                                        iconClassName="text-secondary-dark"
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>
                        );
                    }}
                </form.AppField>
            </div>
            <div className="flex flex-row justify-between gap-x-5">
                <form.AppField name="timePeriodYears">
                    {({ state: { meta }, TextInput }) => {
                        return (
                            <TextInput
                                id="timePeriodYears"
                                dataTestId="time-period-years-field"
                                label="Time Period (Years)"
                                placeholder="e.g. 5"
                                error={
                                    meta.isTouched
                                        ? meta.errors?.[0]?.message
                                        : undefined
                                }
                            />
                        );
                    }}
                </form.AppField>
                <form.AppField name="amountPerContribution">
                    {({ TextInput }) => {
                        return (
                            <TextInput
                                id="amountPerContribution"
                                dataTestId="amount-per-contribution-field"
                                label={
                                    contributionFrequencyToAmountLabelMap[
                                        formValues.contributionFrequency
                                    ]
                                }
                                disabled
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

export default CostAveragingSimulatorForm;
