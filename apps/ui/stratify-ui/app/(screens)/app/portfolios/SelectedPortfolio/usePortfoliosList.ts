"use client";

import { useKyClient } from "@/lib/api/ky-client";
import { paths } from "@/openapi/types/stratify-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type PortfolioList =
    paths["/portfolios"]["get"]["responses"]["200"]["content"]["application/json"]["data"];

export const usePortfoliosList = () => {
    const client = useKyClient();
    const queryClient = useQueryClient();

    const cachedPortfolioList =
        queryClient.getQueryData<PortfolioList>(["portfolio-list"]) || [];

    const {
        data: fetchedPortfolioList,
        error,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["portfolio-list"],
        queryFn: async () =>
            client.GET("/portfolios").then((res) => res.data?.data || []),
        enabled: !!cachedPortfolioList,
    });

    return {
        data: fetchedPortfolioList || cachedPortfolioList,
        error,
        isLoading,
        refetchPortfolioList: refetch,
    };
};
