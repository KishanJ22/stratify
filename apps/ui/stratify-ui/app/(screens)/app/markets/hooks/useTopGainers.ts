"use client";

import { useKyClient } from "@/lib/api/ky-client";
import { paths } from "@/openapi/types/stratify-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type TopGainersList =
    paths["/data/market/top-gainers"]["get"]["responses"]["200"]["content"]["application/json"]["data"];

export const useTopGainers = (enabled: boolean) => {
    const client = useKyClient();
    const queryClient = useQueryClient();

    const cachedTopGainersList =
        queryClient.getQueryData<TopGainersList>(["top-gainers-list"]) || [];

    const {
        data: fetchedTopGainersList,
        error,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["top-gainers-list"],
        queryFn: async () =>
            client
                .GET("/data/market/top-gainers")
                .then((res) => res.data?.data || []),
        enabled: !!cachedTopGainersList || enabled,
    });

    return {
        data: fetchedTopGainersList || cachedTopGainersList,
        error,
        isLoading,
        refetchTopGainersList: refetch,
    };
};
