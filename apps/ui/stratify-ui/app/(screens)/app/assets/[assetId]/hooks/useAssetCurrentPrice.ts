import { useKyClient } from "@/lib/api/ky-client";
import { paths } from "@/openapi/types/stratify-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type AssetCurrentPrice =
    paths["/assets/{assetId}/current-price"]["get"]["responses"]["200"]["content"]["application/json"]["data"];

export const useAssetCurrentPrice = (assetId: number | null) => {
    const client = useKyClient();
    const queryClient = useQueryClient();

    const cachedAssetCurrentPrice = queryClient.getQueryData<AssetCurrentPrice>(
        ["asset-current-price", assetId],
    );

    const {
        data: fetchedAssetCurrentPrice,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["asset-current-price", assetId],
        queryFn: async () =>
            client
                .GET("/assets/{assetId}/current-price", {
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
        data: fetchedAssetCurrentPrice || cachedAssetCurrentPrice,
        isLoading,
        error,
    };
};
