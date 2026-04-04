import { useKyClient } from "@/lib/api/ky-client";
import { paths } from "@/openapi/types/stratify-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type AssetPriceHistory =
    paths["/assets/{assetId}/price-history"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number];

export const useAssetPriceHistory = (assetId: number | null) => {
    const client = useKyClient();
    const queryClient = useQueryClient();

    const cachedAssetPriceHistory = queryClient.getQueryData<
        AssetPriceHistory[]
    >(["asset-price-history", assetId]);

    const {
        data: fetchedAssetPriceHistory,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["asset-price-history", assetId],
        queryFn: async () =>
            client
                .GET("/assets/{assetId}/price-history", {
                    params: {
                        path: {
                            assetId: assetId ?? 0,
                        },
                    },
                })
                .then((res) => res.data?.data),
        enabled: assetId !== null,
    });

    return {
        data: fetchedAssetPriceHistory || cachedAssetPriceHistory,
        isLoading,
        error,
    };
};
