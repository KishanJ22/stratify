"use client";

import { useKyClient } from "@/lib/api/ky-client";
import { paths } from "@/openapi/types/stratify-api";
import { useMutation } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { useState } from "react";

export type SearchAsset =
    paths["/assets/search"]["post"]["responses"]["200"]["content"]["application/json"]["data"][number];

type AssetsNotFoundResponse =
    paths["/assets/search"]["post"]["responses"]["404"]["content"]["application/json"];

export const useAssetSearch = (searchQuery: string) => {
    const client = useKyClient();

    const [isNoResultsFound, setIsNoResultsFound] = useState(false);

    const { data, isPending, mutateAsync, reset, status } = useMutation({
        mutationKey: ["assetSearch", searchQuery],
        mutationFn: async () => {
            try {
                const response = await client
                    .POST("/assets/search", { body: { query: searchQuery } })
                    .then((res) => res.data?.data);

                return response;
            } catch (error) {
                if (error instanceof HTTPError) {
                    const responseStatus = error.response.status;

                    if (responseStatus === 404) {
                        const errorMessage: AssetsNotFoundResponse =
                            await error.response.json();

                        if (errorMessage.message === "noAssetsFound") {
                            return setIsNoResultsFound(true);
                        }
                    }
                }
            }
        },
    });

    return {
        searchResults: data,
        isSearching: isPending,
        search: mutateAsync,
        resetSearch: reset,
        searchStatus: status,
        isNoResultsFound,
    };
};
