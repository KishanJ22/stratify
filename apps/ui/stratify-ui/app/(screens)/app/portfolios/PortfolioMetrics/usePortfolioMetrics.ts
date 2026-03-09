import { useKyClient } from "@/lib/api/ky-client";
import { paths } from "@/openapi/types/stratify-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type PortfolioMetricsResponse =
    paths["/portfolios/{portfolioId}/metrics"]["get"]["responses"]["200"]["content"]["application/json"]["data"];

export const usePortfolioMetrics = (portfolioId: number | null) => {
    const client = useKyClient();
    const queryClient = useQueryClient();

    const cachedPortfolioMetrics =
        queryClient.getQueryData<PortfolioMetricsResponse>([
            "portfolio-metrics",
            portfolioId,
        ]);

    const {
        data: fetchedPortfolioMetrics,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["portfolio-metrics", portfolioId],
        queryFn: async () =>
            client
                .GET("/portfolios/{portfolioId}/metrics", {
                    params: {
                        path: {
                            portfolioId: portfolioId ?? 0,
                        },
                    },
                })
                .then((res) => res.data?.data),
        enabled: portfolioId !== null,
    });

    return {
        data: fetchedPortfolioMetrics || cachedPortfolioMetrics,
        isLoading,
        error,
        refetch,
    };
};
