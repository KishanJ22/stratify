import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import MockEnvironmentProvider from "@/app/tests/_mocks/MockEnvironmentProvider";
import {
    CompoundingSimulatorRequestSchema,
    useCompoundingSimulator,
} from "./useCompoundingSimulator";
import { mockReturns, mockSimulationResults } from "./_mocks/mockChartData";

const mockPostCompoundingSimulator = vi.fn();

const mockKyClient = {
    POST: mockPostCompoundingSimulator,
};

vi.mock("@/lib/api/ky-client", () => ({
    useKyClient: () => mockKyClient,
}));

describe("useCompoundingSimulator", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderCompoundingSimulatorHook = () => {
        return renderHook(() => useCompoundingSimulator(), {
            wrapper: ({ children }) => (
                <MockEnvironmentProvider>{children}</MockEnvironmentProvider>
            ),
        });
    };

    it("should call POST /simulate/compounding successfully", async () => {
        mockPostCompoundingSimulator.mockResolvedValue({
            data: {
                data: {
                    results: mockSimulationResults,
                    returns: mockReturns,
                },
            },
        });

        const { result } = renderCompoundingSimulatorHook();

        expect(result.current.isPending).toBe(false);

        const requestBody = {
            assetId: 1,
            initialInvestment: 10000,
            monthlyContribution: 500,
            timePeriodYears: 20,
            dividendYield: 5,
        } satisfies CompoundingSimulatorRequestSchema;

        result.current.mutate(requestBody);

        await waitFor(() => {
            expect(mockKyClient.POST).toHaveBeenCalledWith(
                "/simulate/compounding",
                {
                    body: requestBody,
                },
            );
        });

        expect(result.current.data).toEqual({
            results: mockSimulationResults,
            returns: mockReturns,
        });
    });
});
