"use client";

import { useMutation } from "@tanstack/react-query";
import { useKyClient } from "@/lib/api/ky-client";
import type { paths } from "@/openapi/types/stratify-api";

export type SetGoalRequestSchema =
	paths["/goal"]["post"]["requestBody"]["content"]["application/json"];

export const useSetGoal = () => {
	const client = useKyClient();

	const { isPending, mutate, isSuccess } = useMutation({
		mutationFn: async (value: SetGoalRequestSchema) =>
			client.POST("/goal", {
				body: value,
			}),
	});

	return {
		mutate,
		isPending,
		isSuccess,
	};
};
