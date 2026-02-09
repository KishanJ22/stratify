import { useKyClient } from "@/lib/api/ky-client";
import { paths } from "@/openapi/types/stratify-api";
import { useMutation } from "@tanstack/react-query";

export type SearchAsset =
    paths["/assets/search"]["post"]["responses"]["200"]["content"]["application/json"]["data"][number];

export const useAssetSearch = (searchQuery: string) => {
    const client = useKyClient();

    const { data, isPending, error, mutateAsync, reset } = useMutation({
        mutationKey: ["assetSearch", searchQuery],
        mutationFn: async () =>
            client
                .POST("/assets/search", { body: { query: searchQuery } })
                .then((res) => res.data?.data),
    });

    return {
        searchResults: data,
        isSearching: isPending,
        searchError: error,
        search: mutateAsync,
        resetSearch: reset,
    };
};
