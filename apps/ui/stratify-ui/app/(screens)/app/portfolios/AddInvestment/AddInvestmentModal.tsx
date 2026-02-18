"use client";

import { formOptions } from "@tanstack/react-form";
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
import { addInvestmentSchema } from "./add-investment-schema";
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

interface AddInvestmentModalProps {
    portfolioId: number;
    isOpen: boolean;
    handleClose: () => void;
}

const addInvestmentFormOptions = formOptions({
    formId: "add-investment-form",
    defaultValues: {
        assetName: "",
        assetSymbol: "",
        assetCurrency: "",
        quantity: "",
        tradeDate: "",
        pricePerShare: "",
        fee: 0,
        total: 0,
    },
});

const AddInvestmentModal = ({
    portfolioId,
    isOpen,
    handleClose,
}: AddInvestmentModalProps) => {
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const queryClient = useQueryClient();

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
        ...addInvestmentFormOptions,
        validators: {
            onChange: addInvestmentSchema,
            onBlurAsync: async ({ value }) => {
                const errors = addInvestmentSchema.safeParse(value);

                if (!errors.success) {
                    setIsSubmitDisabled(true);
                    return errors;
                }

                setIsSubmitDisabled(false);
            },
        },
    });

    useEffect(() => {
        console.log(
            "Asset name in form state:",
            form.getFieldInfo("assetName").instance?.state.value,
        );
    }, [form]);

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
                                                    searchStatus ===
                                                        "error" && (
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
                    <form.AppField name="tradeDate">
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
                    <form.AppField name="fee">
                        {({ state: { meta }, CurrencyInput }) => {
                            return (
                                <CurrencyInput
                                    id="fee"
                                    label="Fee"
                                    currencyCode="GBP"
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
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddInvestmentModal;
