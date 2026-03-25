"use client";

import { useKyClient } from "@/lib/api/ky-client";
import { paths } from "@/openapi/types/stratify-api";
import { useMutation } from "@tanstack/react-query";

export type CompoundingSimulatorErrorResponse =
    | paths["/simulate/compounding"]["post"]["responses"]["400"]["content"]["application/json"]
    | paths["/simulate/compounding"]["post"]["responses"]["404"]["content"]["application/json"];

export type CompoundingSimulatorRequestSchema =
    paths["/simulate/compounding"]["post"]["requestBody"]["content"]["application/json"];

export type CompoundingSimulatorSuccessResponse =
    paths["/simulate/compounding"]["post"]["responses"]["200"]["content"]["application/json"];

export type MutateCompoundingSimulator = ReturnType<
    typeof useCompoundingSimulator
>["mutate"];

export const useCompoundingSimulator = () => {
    const client = useKyClient();

    const { isPending, mutate, isSuccess, data, reset } = useMutation({
        mutationKey: ["compounding-simulation"],
        mutationFn: async (value: CompoundingSimulatorRequestSchema) =>
            client.POST("/simulate/compounding", {
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
