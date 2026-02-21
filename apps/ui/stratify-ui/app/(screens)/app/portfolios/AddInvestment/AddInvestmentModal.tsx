"use client";

import { formOptions, useStore } from "@tanstack/react-form";
import { useAppForm } from "@/app/components/Form/useForm";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/app/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import {
    AddInvestmentSchema,
    addInvestmentSchema,
} from "./add-investment-schema";
import { Field, FieldLabel } from "@/app/components/ui/field";
import { useDebouncedValue } from "@tanstack/react-pacer";
import {
    SearchAsset,
    useAssetSearch,
} from "../../markets/AssetSearch/useAssetSearch";
import {
    Command,
    CommandInput,
    CommandList,
} from "@/app/components/ui/command";
import { Skeleton } from "@/app/components/ui/skeleton";
import { cn } from "@/lib/utils";
import AssetNameCard from "./AssetNameCard";
import { useSessionContext } from "../../SessionProvider";
import { useHistoricAssetPrice } from "./useHistoricAssetPrice";
import { useHistoricCurrencyPairPrice } from "./useHistoricConversionRate";
import {
    AddTradeErrorResponse,
    AddTradeRequestSchema,
    useAddTrade,
} from "./useAddTrade";
import { HTTPError } from "ky";
import { toast } from "sonner";

interface AddInvestmentModalProps {
    portfolioId: number;
    isOpen: boolean;
    handleClose: () => void;
}

const defaultValues: AddInvestmentSchema = {
    assetName: "",
    quantity: "",
    tradeDate: "",
    pricePerShare: "",
    currencyConversionRate: "1",
    fee: "0",
    total: 0,
    assetCurrencyTotal: 0,
};

const addInvestmentFormOptions = formOptions({
    formId: "add-investment-form",
    defaultValues,
});

const AddInvestmentModal = ({
    portfolioId,
    isOpen,
    handleClose,
}: AddInvestmentModalProps) => {
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const queryClient = useQueryClient();

    const { session } = useSessionContext();
    const userCurrency = session?.userDetails.currency ?? "---";

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

    const { mutate: addTrade, isPending: isAddingTrade } =
        useAddTrade(portfolioId);

    useEffect(() => {
        if (debouncedSearchValue.length > 0) {
            search();
        }
    }, [debouncedSearchValue, search]);

    const form = useAppForm({
        ...addInvestmentFormOptions,
        validators: {
            onChange: addInvestmentSchema,
            onBlurAsync: async ({ value }) => {
                const result = addInvestmentSchema.safeParse(value);

                //? If currency conversion is required but the conversion rate isn't set, then the submit button should be disabled
                if (selectedAsset?.currency !== userCurrency) {
                    const currencyConversionRateValue =
                        value.currencyConversionRate
                            ? parseFloat(value.currencyConversionRate)
                            : undefined;

                    if (
                        !currencyConversionRateValue ||
                        currencyConversionRateValue <= 0
                    ) {
                        return setIsSubmitDisabled(true);
                    }
                }

                return result.success
                    ? setIsSubmitDisabled(false)
                    : setIsSubmitDisabled(true);
            },
        },
        onSubmit: async ({ value }) => {
            if (!selectedAsset) return;

            const requestBody = {
                assetId: selectedAsset.id,
                quantity: parseFloat(value.quantity),
                pricePerShare: parseFloat(value.pricePerShare),
                currencyConversionRate: parseFloat(
                    value.currencyConversionRate,
                ),
                fee: parseFloat(value.fee || "0"),
                tradeAction: "BUY",
                totalAmount: value.total,
                assetCurrencyTotalAmount: value.assetCurrencyTotal || 0,
                tradeDate: value.tradeDate,
            } satisfies AddTradeRequestSchema;

            addTrade(requestBody, {
                onSuccess: () => {
                    //? Invalidate the query for getting the investments in the portfolio so that the now updated list can be fetched
                    queryClient.invalidateQueries({
                        queryKey: ["investments-list", portfolioId],
                    });

                    toast.success(
                        "Investment added to your portfolio successfully.",
                    );

                    handleClose();
                    form.reset();
                },
                onError: async (error) => {
                    const httpError = error as HTTPError;

                    if (httpError.response) {
                        const errorJson: AddTradeErrorResponse =
                            await httpError.response.json();

                        const errorMessage = errorJson?.message;

                        if (errorMessage === "portfolioNotFound") {
                            toast.error(
                                "Your portfolio could not be found. Please refresh the page and try again.",
                            );
                            setIsSubmitDisabled(true);
                        }
                    }
                },
            });
        },
        onSubmitInvalid: () => {
            toast.error(
                "Investment could not be added to your portfolio. Please check the form for errors.",
            );
            setIsSubmitDisabled(true);
        },
    });

    const formValues = useStore(form.store, (state) => state.values);

    const {
        data: historicAssetPrice,
        mutate: fetchHistoricAssetPrice,
        isPending: isFetchingHistoricPrice,
    } = useHistoricAssetPrice();

    const {
        data: historicCurrencyPairPrice,
        mutate: fetchHistoricCurrencyPairPrice,
        isPending: isFetchingHistoricCurrencyPairPrice,
    } = useHistoricCurrencyPairPrice();

    useEffect(() => {
        if (historicAssetPrice) {
            form.setFieldValue(
                "pricePerShare",
                historicAssetPrice.price.toString(),
            );
        }

        if (historicCurrencyPairPrice) {
            form.setFieldValue(
                "currencyConversionRate",
                historicCurrencyPairPrice.price.toString(),
            );
        }
    }, [historicAssetPrice, historicCurrencyPairPrice, form]);

    const pricePerShare = formValues.pricePerShare
        ? parseFloat(formValues.pricePerShare)
        : 0;
    const quantity = formValues.quantity ? parseFloat(formValues.quantity) : 0;
    const currencyConversionRate = formValues.currencyConversionRate
        ? parseFloat(formValues.currencyConversionRate)
        : 1;

    const fee = formValues.fee ? parseFloat(formValues.fee) : 0;
    const assetCurrency = selectedAsset?.currency ?? "---";

    const isCurrencyConversionRequired =
        selectedAsset && assetCurrency !== userCurrency;

    const assetCurrencySubtotal =
        pricePerShare > 0 && quantity > 0 ? pricePerShare * quantity : 0;

    const subtotal = isCurrencyConversionRequired
        ? assetCurrencySubtotal * currencyConversionRate
        : assetCurrencySubtotal;

    const total = fee > 0 ? subtotal + fee : subtotal;

    useEffect(() => {
        form.setFieldValue("total", total);

        if (isCurrencyConversionRequired) {
            form.setFieldValue("assetCurrencyTotal", assetCurrencySubtotal);
        }
    }, [total, assetCurrencySubtotal, isCurrencyConversionRequired]);

    return (
        <Dialog
            open={isOpen}
            onOpenChange={() => {
                handleClose();
                form.reset();
            }}
        >
            <DialogContent className="bg-muted-lightest border border-primary-dark font-sans">
                <DialogHeader>
                    <div className="flex flex-row items-center justify-between">
                        <DialogTitle className="font-medium text-lg leading-7 text-secondary-darker">
                            Add Investment
                        </DialogTitle>
                        <X
                            size={20}
                            className="cursor-pointer text-muted-dark hover:text-primary-darker transition-colors"
                            onClick={() => {
                                handleClose();
                                form.reset();
                            }}
                            data-testid="close-modal-icon"
                        />
                    </div>
                    <DialogDescription className="text-secondary-darker leading-5">
                        Add a new investment to monitor its performance and see
                        how it impacts your portfolio alongside other
                        investments.
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                    className="flex flex-col gap-y-2.5"
                >
                    <form.AppField name="assetName">
                        {(field) => {
                            return (
                                <Field className="flex flex-col gap-y-1.5">
                                    <FieldLabel htmlFor="assetName">
                                        <span className="flex flex-row w-full items-center justify-between">
                                            Asset Name
                                            {field.state.value && (
                                                <span
                                                    className="p-1 rounded-lg bg-secondary-lighter font-sans font-semibold text-secondary-darker cursor-pointer hover:bg-secondary-base hover:text-secondary-lightest transition-colors"
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
                    <form.AppField
                        name="tradeDate"
                        listeners={{
                            onChange: ({ value }) => {
                                if (selectedAsset) {
                                    fetchHistoricAssetPrice({
                                        assetId: selectedAsset.id,
                                        tradeDate: value,
                                    });

                                    if (isCurrencyConversionRequired) {
                                        fetchHistoricCurrencyPairPrice({
                                            currencyPair: `${selectedAsset.currency}${userCurrency}`,
                                            tradeDate: value,
                                        });
                                    }
                                }
                            },
                        }}
                    >
                        {({ state: { meta }, DatePickerInput }) => {
                            return (
                                <DatePickerInput
                                    id="tradeDate"
                                    label="Trade Date"
                                    placeholder="Select trade date"
                                    className="w-full"
                                    error={
                                        meta.isTouched
                                            ? meta.errors?.[0]?.message
                                            : undefined
                                    }
                                />
                            );
                        }}
                    </form.AppField>
                    <form.AppField name="pricePerShare">
                        {({ state: { meta }, CurrencyInput }) => {
                            return (
                                <CurrencyInput
                                    id="pricePerShare"
                                    label="Price per Share"
                                    isLoading={isFetchingHistoricPrice}
                                    currencyCode={
                                        selectedAsset?.currency ?? "---"
                                    }
                                    placeholder="Enter price per share"
                                    inputClassName=""
                                    error={
                                        meta.isTouched
                                            ? meta.errors?.[0]?.message
                                            : undefined
                                    }
                                />
                            );
                        }}
                    </form.AppField>
                    <form.AppField name="quantity">
                        {({ state: { meta }, TextInput }) => {
                            return (
                                <TextInput
                                    id="quantity"
                                    label="Number of Shares"
                                    placeholder="Enter number of shares"
                                    inputClassName="bg-white text-secondary-dark"
                                    error={
                                        meta.isTouched
                                            ? meta.errors?.[0]?.message
                                            : undefined
                                    }
                                />
                            );
                        }}
                    </form.AppField>
                    {isCurrencyConversionRequired ? (
                        <form.AppField name="currencyConversionRate">
                            {({ state: { meta }, CurrencyInput }) => {
                                return (
                                    <CurrencyInput
                                        id="currencyConversionRate"
                                        label="Currency Conversion Rate"
                                        isLoading={
                                            isFetchingHistoricCurrencyPairPrice
                                        }
                                        currencyCode={`${selectedAsset?.currency}/${userCurrency}`}
                                        placeholder="Enter currency conversion rate"
                                        error={
                                            meta.isTouched
                                                ? meta.errors?.[0]?.message
                                                : undefined
                                        }
                                    />
                                );
                            }}
                        </form.AppField>
                    ) : null}
                    <form.AppField name="fee">
                        {({ state: { meta }, CurrencyInput }) => {
                            return (
                                <CurrencyInput
                                    id="fee"
                                    label="Fee"
                                    currencyCode={userCurrency}
                                    placeholder="Enter fee amount (optional)"
                                    inputClassName="text-secondary-dark"
                                    error={
                                        meta.isTouched
                                            ? meta.errors?.[0]?.message
                                            : undefined
                                    }
                                />
                            );
                        }}
                    </form.AppField>
                    <div className="bg-secondary-lightest border border-secondary-dark rounded-md p-2.5">
                        <div className="flex flex-col gap-y-1">
                            <div className="flex flex-row items-center justify-between">
                                <span className="text-secondary-light font-semibold">
                                    Subtotal
                                </span>
                                <span className="font-medium text-muted-dark">
                                    {subtotal > 0 && userCurrency
                                        ? `${subtotal.toFixed(2)} (${userCurrency})`
                                        : "---"}
                                </span>
                            </div>
                            {isCurrencyConversionRequired &&
                            currencyConversionRate > 0 ? (
                                <div className="flex flex-row items-center justify-between">
                                    <span className="text-secondary-light font-semibold">
                                        Subtotal in Asset Currency
                                    </span>
                                    <span className="font-medium text-muted-dark">
                                        {assetCurrencySubtotal > 0 &&
                                        assetCurrency
                                            ? `${assetCurrencySubtotal.toFixed(2)} (${assetCurrency})`
                                            : "---"}
                                    </span>
                                </div>
                            ) : null}
                            {fee > 0 ? (
                                <div className="flex flex-row items-center justify-between">
                                    <span className="text-secondary-light font-semibold">
                                        Fee
                                    </span>
                                    <span className="font-medium text-muted-dark">
                                        {fee.toFixed(2)} {userCurrency}
                                    </span>
                                </div>
                            ) : null}
                        </div>
                        <div className="flex flex-row items-center justify-between mt-2">
                            <span className="text-secondary-dark font-semibold">
                                Total
                            </span>
                            <span className="font-medium text-muted-darker">
                                {total > 0 && userCurrency
                                    ? `${total.toFixed(2)} (${userCurrency})`
                                    : "---"}
                            </span>
                        </div>
                        <div className="w-full mt-3">
                            <form.Subscribe
                                selector={(state) => [
                                    state.canSubmit,
                                    state.isSubmitting,
                                ]}
                            >
                                <form.SubmitButton
                                    label="Add Investment"
                                    className="w-full"
                                    isDisabled={
                                        !form.state.canSubmit ||
                                        isSubmitDisabled
                                    }
                                    isLoading={
                                        isAddingTrade || form.state.isSubmitting
                                    }
                                />
                            </form.Subscribe>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddInvestmentModal;
