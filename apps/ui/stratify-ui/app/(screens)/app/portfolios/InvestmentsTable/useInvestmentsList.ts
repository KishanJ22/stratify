import { useKyClient } from "@/lib/api/ky-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Investment } from "./InvestmentsTable";

const useInvestmentsList = (portfolioId: number | null) => {
    const client = useKyClient();
    const queryClient = useQueryClient();

    const cachedInvestmentsList =
        queryClient.getQueryData<Investment[]>([
            "investments-list",
            portfolioId,
        ]) || [];

    const {
        data: fetchedInvestmentsList,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["investments-list", portfolioId],
        queryFn: async () =>
            client
                .GET("/portfolios/{portfolioId}/investments", {
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
        data: fetchedInvestmentsList || cachedInvestmentsList,
        isLoading,
        error,
        refetch,
    };
};

export default useInvestmentsList;
