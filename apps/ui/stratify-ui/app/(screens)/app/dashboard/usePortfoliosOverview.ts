"use client";

import { useKyClient } from "@/lib/api/ky-client";
import { paths } from "@/openapi/types/stratify-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type Overview =
    paths["/portfolios/overview"]["get"]["responses"]["200"]["content"]["application/json"]["data"];

export const usePortfoliosOverview = () => {
    const client = useKyClient();
    const queryClient = useQueryClient();

    const cachedOverview =
        queryClient.getQueryData<Overview>(["portfolios-overview"]) || null;

    const {
        data: fetchedOverview,
        error,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["portfolios-overview"],
        queryFn: async () =>
            client
                .GET("/portfolios/overview")
                .then((res) => res.data?.data || null),
        enabled: !cachedOverview,
    });

    return {
        data: fetchedOverview || cachedOverview,
        error,
        isLoading,
        refetchPortfoliosOverview: refetch,
    };
};
