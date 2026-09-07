"use client";

import { useKyClient } from "@/lib/api/ky-client";
import { useMutation } from "@tanstack/react-query";

export const useDeletePortfolio = () => {
    const client = useKyClient();

    const { isPending, mutate, isSuccess } = useMutation({
        mutationFn: async (portfolioId: number | null) =>
            client.DELETE("/portfolios/{portfolioId}", {
                params: {
                    path: {
                        portfolioId: portfolioId!,
                    },
                },
            }),
    });

    return { mutate, isPending, isSuccess };
};
