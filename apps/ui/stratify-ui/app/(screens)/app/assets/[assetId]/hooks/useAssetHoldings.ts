import { useKyClient } from "@/lib/api/ky-client";
import { paths } from "@/openapi/types/stratify-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type AssetHolding =
    paths["/assets/{assetId}/holdings"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number];

export const useAssetHoldings = (assetId: number | null) => {
    const client = useKyClient();
    const queryClient = useQueryClient();

    const cachedAssetHoldings = queryClient.getQueryData<AssetHolding[]>([
        "asset-holdings",
        assetId,
    ]);

    const {
        data: fetchedAssetHoldings,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["asset-holdings", assetId],
        queryFn: async () =>
            client
                .GET("/assets/{assetId}/holdings", {
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
        data: fetchedAssetHoldings || cachedAssetHoldings,
        isLoading,
        error,
    };
};
