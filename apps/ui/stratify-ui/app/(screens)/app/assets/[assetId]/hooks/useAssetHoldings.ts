import { useKyClient } from "@/lib/api/ky-client";
import { paths } from "@/openapi/types/stratify-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { useState } from "react";

export type AssetHolding =
    paths["/assets/{assetId}/holdings"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number];

export const useAssetHoldings = (assetId: number | null) => {
    const client = useKyClient();
    const queryClient = useQueryClient();

    const cachedAssetHoldings = queryClient.getQueryData<AssetHolding[]>([
        "asset-holdings",
        assetId,
    ]);

    const [isHoldingsNotFoundError, setIsHoldingsNotFoundError] =
        useState(false);

    const { data: fetchedAssetHoldings, isLoading } = useQuery({
        queryKey: ["asset-holdings", assetId],
        queryFn: async () => {
            try {
                const response = await client.GET(
                    "/assets/{assetId}/holdings",
                    {
                        params: {
                            path: {
                                assetId: assetId!,
                            },
                        },
                    },
                );

                return response.data?.data;
            } catch (error) {
                if (
                    error instanceof HTTPError &&
                    error.response.status === 404
                ) {
                    setIsHoldingsNotFoundError(true);
                    return [];
                }
            }
        },
        enabled: assetId !== null,
    });

    return {
        data: fetchedAssetHoldings || cachedAssetHoldings,
        isLoading,
        isHoldingsNotFoundError,
    };
};
