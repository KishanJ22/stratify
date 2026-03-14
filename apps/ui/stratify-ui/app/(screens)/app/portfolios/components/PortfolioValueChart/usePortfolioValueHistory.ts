import { useKyClient } from "@/lib/api/ky-client";
import { paths } from "@/openapi/types/stratify-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type PortfolioValueHistory =
    paths["/portfolios/{portfolioId}/value-history"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number];

export const usePortfolioValueHistory = (portfolioId: number | null) => {
    const client = useKyClient();
    const queryClient = useQueryClient();

    const cachedPortfolioValueHistory =
        queryClient.getQueryData<PortfolioValueHistory[]>([
            "portfolio-value-history",
            portfolioId,
        ]) || [];

    const {
        data: fetchedPortfolioValueHistory,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["portfolio-value-history", portfolioId],
        queryFn: async () =>
            client
                .GET("/portfolios/{portfolioId}/value-history", {
                    params: {
                        path: {
                            portfolioId: portfolioId ?? 0,
                        },
                    },
                })
                .then((res) => res.data?.data || []),
        enabled: portfolioId !== null,
    });

    return {
        data: fetchedPortfolioValueHistory || cachedPortfolioValueHistory,
        isLoading,
        error,
        refetch,
    };
};
