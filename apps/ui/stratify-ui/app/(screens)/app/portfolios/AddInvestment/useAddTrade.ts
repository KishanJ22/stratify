"use client";

import { useKyClient } from "@/lib/api/ky-client";
import { paths } from "@/openapi/types/stratify-api";
import { useMutation } from "@tanstack/react-query";

export type AddTradeErrorResponse =
    | paths["/portfolios/{portfolioId}/add-trade"]["post"]["responses"]["400"]["content"]["application/json"]
    | paths["/portfolios/{portfolioId}/add-trade"]["post"]["responses"]["404"]["content"]["application/json"];

export type AddTradeRequestSchema =
    paths["/portfolios/{portfolioId}/add-trade"]["post"]["requestBody"]["content"]["application/json"];

export const useAddTrade = (portfolioId: number) => {
    const client = useKyClient();

    const { isPending, mutate } = useMutation({
        mutationFn: async (value: AddTradeRequestSchema) =>
            client.POST("/portfolios/{portfolioId}/add-trade", {
                params: {
                    path: {
                        portfolioId,
                    },
                },
                body: {
                    assetId: value.assetId,
                    quantity: value.quantity,
                    pricePerShare: value.pricePerShare,
                    currencyConversionRate: value.currencyConversionRate,
                    fee: value.fee,
                    tradeAction: value.tradeAction,
                    totalAmount: value.totalAmount,
                    assetCurrencyTotalAmount: value.assetCurrencyTotalAmount,
                    tradeDate: value.tradeDate,
                },
            }),
    });

    return {
        mutate,
        isPending,
    };
};
