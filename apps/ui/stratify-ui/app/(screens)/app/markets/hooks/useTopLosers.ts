"use client";

import { useKyClient } from "@/lib/api/ky-client";
import { paths } from "@/openapi/types/stratify-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type TopLosersList =
    paths["/data/market/top-losers"]["get"]["responses"]["200"]["content"]["application/json"]["data"];

export const useTopLosers = () => {
    const client = useKyClient();
    const queryClient = useQueryClient();

    const cachedTopLosersList =
        queryClient.getQueryData<TopLosersList>(["top-losers-list"]) || [];

    const {
        data: fetchedTopLosersList,
        error,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["top-losers-list"],
        queryFn: async () =>
            client
                .GET("/data/market/top-losers")
                .then((res) => res.data?.data || []),
        enabled: false,
    });

    return {
        data: fetchedTopLosersList || cachedTopLosersList,
        error,
        isLoading,
        fetchTopLosersList: refetch,
    };
};
