"use client";

import { useKyClient } from "@/lib/api/ky-client";
import { paths } from "@/openapi/types/stratify-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { useState } from "react";

export type Goal =
    paths["/goal"]["get"]["responses"]["200"]["content"]["application/json"]["data"];

type NotFoundResponse =
    paths["/goal"]["get"]["responses"]["404"]["content"]["application/json"];

export const useGoal = () => {
    const client = useKyClient();
    const queryClient = useQueryClient();

    const cachedGoal = queryClient.getQueryData<Goal>(["goal"]);

    const [isGoalNotFoundError, setIsGoalNotFoundError] = useState(false);

    const {
        data: fetchedGoal,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["goal"],
        queryFn: async () => {
            try {
                const response = await client.GET("/goal");

                return response.data?.data;
            } catch (error) {
                if (error instanceof HTTPError) {
                    const errorMessage: NotFoundResponse =
                        await error.response.json();

                    if (errorMessage.message === "goalNotFound") {
                        setIsGoalNotFoundError(true);
                    }
                }

                throw error;
            }
        },
    });

    return {
        data: fetchedGoal || cachedGoal,
        isLoading,
        isGoalNotFoundError,
        refetch,
    };
};
