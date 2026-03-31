"use client";

import { useKyClient } from "@/lib/api/ky-client";
import { paths } from "@/openapi/types/stratify-api";
import { useMutation } from "@tanstack/react-query";

export type CostAveragingSimulatorErrorResponse =
    | paths["/simulate/cost-averaging"]["post"]["responses"]["400"]["content"]["application/json"]
    | paths["/simulate/cost-averaging"]["post"]["responses"]["404"]["content"]["application/json"];

export type CostAveragingSimulatorRequestSchema =
    paths["/simulate/cost-averaging"]["post"]["requestBody"]["content"]["application/json"];

export type CostAveragingSimulatorSuccessResponse =
    paths["/simulate/cost-averaging"]["post"]["responses"]["200"]["content"]["application/json"];

export type MutateCostAveragingSimulator = ReturnType<
    typeof useCostAveragingSimulator
>["mutate"];

export const useCostAveragingSimulator = () => {
    const client = useKyClient();

    const { isPending, mutate, isSuccess, data, reset } = useMutation({
        mutationKey: ["cost-averaging-simulation"],
        mutationFn: async (value: CostAveragingSimulatorRequestSchema) =>
            client.POST("/simulate/cost-averaging", {
                body: value,
            }),
    });

    return {
        mutate,
        isPending,
        isSuccess,
        data: data?.data?.data,
        reset,
    };
};
