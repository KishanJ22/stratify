"use client";

import { useMutation } from "@tanstack/react-query";
import { useKyClient } from "@/lib/api/ky-client";
import type { paths } from "@/openapi/types/stratify-api";

export type PortfolioNameAlreadyExistsResponse =
	paths["/portfolios"]["post"]["responses"]["400"]["content"]["application/json"];

export const useCreatePortfolio = () => {
	const client = useKyClient();

	const { isPending, mutate, isSuccess } = useMutation({
		mutationFn: async (value: { name: string }) =>
			client.POST("/portfolios", { body: value }),
	});

	return { isPending, mutate, isSuccess };
};
