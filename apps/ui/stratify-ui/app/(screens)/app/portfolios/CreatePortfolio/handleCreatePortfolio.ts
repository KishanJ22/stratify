"use client";

import { useKyClient } from "@/lib/api/ky-client";
import { paths } from "@/openapi/types/stratify-api";
import { useMutation } from "@tanstack/react-query";

export type PortfolioNameAlreadyExistsResponse =
    paths["/portfolios"]["post"]["responses"]["400"]["content"]["application/json"];

export const useCreatePortfolio = () => {
    const client = useKyClient();

    const { isPending, mutate } = useMutation({
        mutationFn: async (value: { name: string }) =>
            client.POST("/portfolios", { body: value }),
    });

    return { isPending, mutate };
};
