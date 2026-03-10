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
import { useSessionContext } from "../../SessionProvider";
import { useHistoricAssetPrice } from "../hooks/useHistoricAssetPrice";
import { useHistoricCurrencyPairPrice } from "../hooks/useHistoricConversionRate";
import {
    AddTradeErrorResponse,
    AddTradeRequestSchema,
    useAddTrade,
} from "../hooks/useAddTrade";
import { HTTPError } from "ky";
import { toast } from "sonner";
import { addTradeSchema, AddTradeSchema } from "./add-trade-schema";
import { Field, FieldLabel } from "@/app/components/ui/field";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

interface InvestmentDetails {
    assetId: number;
    symbol: string;
    name: string;
    assetCurrency: string | null;
}

export interface AddTradeModalProps {
    portfolioId: number;
    investment: InvestmentDetails;
    isOpen: boolean;
    handleClose: () => void;
}

const defaultValues: AddTradeSchema = {
    assetName: "",
    quantity: "",
    tradeType: "BUY",
    tradeDate: "",
    pricePerShare: "",
    currencyConversionRate: "1",
    fee: "0",
    total: 0,
    assetCurrencyTotal: 0,
};

const addTradeFormOptions = formOptions({
    formId: "add-trade-form",
    defaultValues,
});

const AddTradeModal = ({
    portfolioId,
    investment,
    isOpen,
    handleClose,
}: AddTradeModalProps) => {
    const { assetId, name, symbol, assetCurrency } = investment;
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const queryClient = useQueryClient();

    const { session } = useSessionContext();
    const userCurrency = session?.userDetails.currency ?? "---";

    const { mutate: addTrade, isPending: isAddingTrade } =
        useAddTrade(portfolioId);

    const [isAttemptingToSellMoreThanHeld, setIsAttemptingToSellMoreThanHeld] =
        useState(false);

    const form = useAppForm({
        ...addTradeFormOptions,
        validators: {
            onChange: addTradeSchema,
            onBlurAsync: async ({ value }) => {
                const result = addTradeSchema.safeParse(value);

                //? If currency conversion is required but the conversion rate isn't set, then the submit button should be disabled
                if (assetCurrency !== userCurrency) {
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
            if (!value.tradeType) {
                return toast.error("Please select a trade type.");
            }

            const requestBody = {
                assetId,
                quantity: parseFloat(value.quantity),
                pricePerShare: parseFloat(value.pricePerShare),
                currencyConversionRate: parseFloat(
                    value.currencyConversionRate,
                ),
                fee: parseFloat(value.fee || "0"),
                tradeAction: value.tradeType,
                totalAmount: value.total,
                assetCurrencyTotalAmount: value.assetCurrencyTotal || 0,
                tradeDate: value.tradeDate,
            } satisfies AddTradeRequestSchema;

            addTrade(requestBody, {
                onSuccess: () => {
                    //? Invalidate the queries related to the portfolio to automatically fetch updated data
                    queryClient.invalidateQueries({
                        queryKey: ["investments-list", portfolioId],
                    });

                    queryClient.invalidateQueries({
                        queryKey: ["portfolio-value-history", portfolioId],
                    });

                    queryClient.invalidateQueries({
                        queryKey: ["portfolio-metrics", portfolioId],
                    });

                    toast.success(
                        "Trade added to your portfolio successfully.",
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

                        if (errorMessage === "cannotSellMoreThanHeld") {
                            setIsAttemptingToSellMoreThanHeld(true);
                            setIsSubmitDisabled(true);
                        }
                    }
                },
            });
        },
        onSubmitInvalid: () => {
            toast.error(
                "Trade could not be added to your portfolio. Please check the form for errors.",
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

        if (assetCurrency === "GBX" && userCurrency === "GBP") {
            form.setFieldValue("currencyConversionRate", "0.01");
        }

        if (historicCurrencyPairPrice) {
            const conversionRate =
                assetCurrency === "GBX"
                    ? parseFloat(historicCurrencyPairPrice.price) / 100
                    : parseFloat(historicCurrencyPairPrice.price);

            form.setFieldValue(
                "currencyConversionRate",
                conversionRate.toString(),
            );
        }
    }, [historicAssetPrice, historicCurrencyPairPrice, form, assetCurrency]);

    const pricePerShare = formValues.pricePerShare
        ? parseFloat(formValues.pricePerShare)
        : 0;
    const quantity = formValues.quantity ? parseFloat(formValues.quantity) : 0;

    const tradeType = formValues.tradeType;
    const currencyConversionRate = formValues.currencyConversionRate
        ? parseFloat(formValues.currencyConversionRate)
        : 1;

    const fee = formValues.fee ? parseFloat(formValues.fee) : 0;

    const isCurrencyConversionRequired = assetCurrency !== userCurrency;

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
                form.reset();
                handleClose();
            }}
        >
            <DialogContent className="bg-muted-lightest border border-primary-dark font-sans">
                <DialogHeader>
                    <div className="flex flex-row items-center justify-between">
                        <DialogTitle
                            className="font-medium text-lg leading-7 text-secondary-darker"
                            data-testid="modal-title"
                        >
                            Add Trade
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
                    <DialogDescription
                        className="text-secondary-darker leading-5"
                        data-testid="modal-description"
                    >
                        Add a transaction to keep your portfolio up to date and
                        monitor it with more accuracy.
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
                        {({ TextInput }) => (
                            <TextInput
                                id="assetName"
                                label="Asset Name"
                                dataTestId="asset-name-field"
                                defaultValue={`${name} (${symbol})`}
                                disabled
                            />
                        )}
                    </form.AppField>
                    <form.AppField
                        name="tradeDate"
                        listeners={{
                            onChange: ({ value }) => {
                                fetchHistoricAssetPrice({
                                    assetId,
                                    tradeDate: value,
                                });

                                if (isCurrencyConversionRequired) {
                                    fetchHistoricCurrencyPairPrice({
                                        currencyPair: `${assetCurrency === "GBX" ? "GBP" : assetCurrency}${userCurrency}`,
                                        tradeDate: value,
                                    });
                                }
                            },
                        }}
                    >
                        {({ state: { meta }, DatePickerInput }) => {
                            return (
                                <DatePickerInput
                                    id="tradeDate"
                                    dataTestId="trade-date-field"
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
                                    dataTestId="price-per-share-field"
                                    label="Price per Share"
                                    isLoading={isFetchingHistoricPrice}
                                    currencyCode={assetCurrency ?? "---"}
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
                    <div className="flex flex-row gap-x-4">
                        <form.AppField
                            name="quantity"
                            validators={{
                                onChange: () =>
                                    setIsAttemptingToSellMoreThanHeld(false),
                            }}
                        >
                            {({ state: { meta }, TextInput }) => {
                                const validationError = meta.isTouched
                                    ? meta.errors?.[0]?.message
                                    : undefined;

                                const quantityError =
                                    isAttemptingToSellMoreThanHeld
                                        ? "You cannot sell more shares than what you currently hold. Please adjust the quantity or change the trade type to Buy."
                                        : validationError;
                                return (
                                    <TextInput
                                        id="quantity"
                                        dataTestId="quantity-field"
                                        label="Number of Shares"
                                        placeholder="Enter number of shares"
                                        inputClassName="bg-white text-secondary-dark"
                                        error={quantityError}
                                    />
                                );
                            }}
                        </form.AppField>
                        <form.AppField name="tradeType">
                            {(field) => (
                                <Field
                                    className="flex flex-col gap-y-1.5"
                                    data-testid="trade-type-field"
                                >
                                    <FieldLabel htmlFor="tradeType">
                                        Trade Type
                                    </FieldLabel>
                                    <Tabs
                                        defaultValue="BUY"
                                        onValueChange={(value) =>
                                            field.setValue(
                                                value as "BUY" | "SELL",
                                            )
                                        }
                                    >
                                        <TabsList className="bg-white border border-secondary-dark rounded-md w-full">
                                            <TabsTrigger
                                                value="BUY"
                                                className="rounded-md p-1 text-sm font-normal text-muted-dark hover:bg-positive-lighter hover:text-positive-dark hover:font-medium data-[state=active]:bg-positive-light data-[state=active]:text-positive-darker data-[state=active]:font-semibold"
                                            >
                                                Buy
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="SELL"
                                                className="rounded-md p-1 text-sm font-normal text-muted-dark hover:bg-negative-lighter hover:text-negative-dark hover:font-medium data-[state=active]:bg-negative-light data-[state=active]:text-negative-darker data-[state=active]:font-semibold"
                                            >
                                                Sell
                                            </TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </Field>
                            )}
                        </form.AppField>
                    </div>
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
                                        currencyCode={`${assetCurrency ?? "---"}/${userCurrency}`}
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
                                    dataTestId="fee-field"
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
                                Total {tradeType === "BUY" && "Bought"}
                                {tradeType === "SELL" && "Sold"}
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
                                    label={`Add Trade for ${symbol}`}
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

export default AddTradeModal;
