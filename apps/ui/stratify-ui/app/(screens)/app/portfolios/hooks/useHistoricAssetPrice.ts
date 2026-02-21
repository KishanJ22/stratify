"use client";

import { useKyClient } from "@/lib/api/ky-client";
import { useMutation } from "@tanstack/react-query";

export const useHistoricAssetPrice = () => {
    const client = useKyClient();

    const { data, mutate, isPending, isSuccess } = useMutation({
        mutationFn: async (value: { assetId: number; tradeDate: string }) =>
            client
                .GET("/assets/{assetId}/historic-price", {
                    params: {
                        path: { assetId: value.assetId },
                        query: { tradeDate: value.tradeDate },
                    },
                })
                .then((res) => res.data?.data || null),
    });

    return {
        data,
        isPending,
        isSuccess,
        mutate,
    };
};
