import { useKyClient } from "@/lib/api/ky-client";
import { paths } from "@/openapi/types/stratify-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type AssetDetails =
    paths["/assets/{assetId}/details"]["get"]["responses"]["200"]["content"]["application/json"]["data"];

export const useAssetDetails = (assetId: number | null) => {
    const client = useKyClient();
    const queryClient = useQueryClient();

    const cachedAssetDetails = queryClient.getQueryData<AssetDetails>([
        "asset-details",
        assetId,
    ]);

    const {
        data: fetchedAssetDetails,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["asset-details", assetId],
        queryFn: async () =>
            client
                .GET("/assets/{assetId}/details", {
                    params: {
                        path: {
                            assetId: assetId!,
                        },
                    },
                })
                .then((res) => res.data?.data),
        enabled: assetId !== null,
    });

    return {
        data: fetchedAssetDetails || cachedAssetDetails,
        isLoading,
        error,
    };
};
