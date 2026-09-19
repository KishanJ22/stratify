"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useKyClient } from "@/lib/api/ky-client";
import type { paths } from "@/openapi/types/stratify-api";

export type Currency =
	paths["/currencies"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number];

export const useCurrencyList = () => {
	const client = useKyClient();
	const queryClient = useQueryClient();

	const cachedCurrencyList =
		queryClient.getQueryData<Currency[]>(["currency-list"]) || [];

	const {
		data: fetchedCurrencyList,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["currency-list"],
		queryFn: async () =>
			client.GET("/currencies").then((res) => res.data?.data || []),
		enabled: !!cachedCurrencyList,
	});

	return {
		data: fetchedCurrencyList || cachedCurrencyList,
		error,
		isLoading,
	};
};
