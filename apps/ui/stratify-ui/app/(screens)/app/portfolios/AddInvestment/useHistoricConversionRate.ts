"use client";

import { useKyClient } from "@/lib/api/ky-client";
import { useMutation } from "@tanstack/react-query";

export const useHistoricCurrencyPairPrice = () => {
    const client = useKyClient();

    const { data, mutate, isPending } = useMutation({
        mutationFn: async (value: {
            currencyPair: string;
            tradeDate: string;
        }) =>
            client
                .GET("/currencies/{currencyPair}/historic-price", {
                    params: {
                        path: { currencyPair: value.currencyPair },
                        query: { tradeDate: value.tradeDate },
                    },
                })
                .then((res) => res.data?.data || null),
    });

    return {
        data,
        isPending,
        mutate,
    };
};
