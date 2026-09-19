"use client";

import { useMutation } from "@tanstack/react-query";
import { useKyClient } from "@/lib/api/ky-client";
import type { paths } from "@/openapi/types/stratify-api";

export type PortfolioNameAlreadyExistsResponse =
	paths["/portfolios/{portfolioId}"]["patch"]["responses"]["400"]["content"]["application/json"];

export type UpdatePortfolioRequestSchema =
	paths["/portfolios/{portfolioId}"]["patch"]["requestBody"]["content"]["application/json"];

export const useRenamePortfolio = (portfolioId: number | null) => {
	const client = useKyClient();

	const { isPending, mutate, isSuccess } = useMutation({
		mutationFn: async (body: UpdatePortfolioRequestSchema) =>
			client.PATCH("/portfolios/{portfolioId}", {
				params: {
					path: {
						portfolioId: portfolioId!,
					},
				},
				body,
			}),
	});

	return { mutate, isPending, isSuccess };
};
