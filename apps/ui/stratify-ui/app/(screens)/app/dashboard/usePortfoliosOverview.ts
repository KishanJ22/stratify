"use client";

import { useKyClient } from "@/lib/api/ky-client";
import { paths } from "@/openapi/types/stratify-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { useState } from "react";

export type Overview =
    paths["/portfolios/overview"]["get"]["responses"]["200"]["content"]["application/json"]["data"];

type NotFoundResponse =
    paths["/portfolios/overview"]["get"]["responses"]["404"]["content"]["application/json"];

export const usePortfoliosOverview = () => {
    const client = useKyClient();
    const queryClient = useQueryClient();

    const cachedOverview = queryClient.getQueryData<Overview>([
        "portfolios-overview",
    ]);

    const [isPortfoliosNotFoundError, setIsPortfoliosNotFoundError] =
        useState(false);

    const [isInvestmentsNotFoundError, setIsInvestmentsNotFoundError] =
        useState(false);

    const {
        data: fetchedOverview,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["portfolios-overview"],
        queryFn: async () => {
            try {
                const response = await client.GET("/portfolios/overview");
                return response.data?.data;
            } catch (error) {
                if (error instanceof HTTPError) {
                    const errorMessage: NotFoundResponse =
                        await error.response.json();

                    if (errorMessage.message === "noPortfoliosFound") {
                        setIsPortfoliosNotFoundError(true);
                    }

                    if (errorMessage.message === "noInvestmentsFound") {
                        setIsInvestmentsNotFoundError(true);
                    }
                }

                throw error;
            }
        },
        enabled: !cachedOverview,
    });

    return {
        data: fetchedOverview || cachedOverview,
        isLoading,
        isPortfoliosNotFoundError,
        isInvestmentsNotFoundError,
        refetchPortfoliosOverview: refetch,
    };
};
