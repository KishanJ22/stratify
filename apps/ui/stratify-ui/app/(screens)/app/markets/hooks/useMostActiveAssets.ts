"use client";

import { useKyClient } from "@/lib/api/ky-client";
import { paths } from "@/openapi/types/stratify-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type MostActiveAssetsList =
    paths["/data/market/most-active"]["get"]["responses"]["200"]["content"]["application/json"]["data"];

export const useMostActiveAssets = (enabled: boolean) => {
    const client = useKyClient();
    const queryClient = useQueryClient();

    const cachedMostActiveAssetsList =
        queryClient.getQueryData<MostActiveAssetsList>([
            "most-active-assets-list",
        ]) || [];

    const {
        data: fetchedMostActiveAssetsList,
        error,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["most-active-assets-list"],
        queryFn: async () =>
            client
                .GET("/data/market/most-active")
                .then((res) => res.data?.data || []),
        enabled: !!cachedMostActiveAssetsList || enabled,
    });

    return {
        data: fetchedMostActiveAssetsList || cachedMostActiveAssetsList,
        error,
        isLoading,
        refetchMostActiveAssetsList: refetch,
    };
};
