import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import MockEnvironmentProvider from "@/app/tests/_mocks/MockEnvironmentProvider";
import {
    CostAveragingSimulatorRequestSchema,
    useCostAveragingSimulator,
} from "./useCostAveragingSimulator";
import { mockReturns, mockSimulationResults } from "./_mocks/mockChartData";

const mockPostCostAveragingSimulator = vi.fn();

const mockKyClient = {
    POST: mockPostCostAveragingSimulator,
};

vi.mock("@/lib/api/ky-client", () => ({
    useKyClient: () => mockKyClient,
}));

describe("useCompoundingSimulator", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderCostAveragingSimulatorHook = () => {
        return renderHook(() => useCostAveragingSimulator(), {
            wrapper: ({ children }) => (
                <MockEnvironmentProvider>{children}</MockEnvironmentProvider>
            ),
        });
    };

    it("should call POST /simulate/cost-averaging successfully", async () => {
        mockPostCostAveragingSimulator.mockResolvedValue({
            data: {
                data: {
                    results: mockSimulationResults,
                    returns: mockReturns,
                },
            },
        });

        const { result } = renderCostAveragingSimulatorHook();

        expect(result.current.isPending).toBe(false);

        const requestBody = {
            assetId: 1,
            totalInvestment: 10000,
            contributionFrequency: "monthly",
            amountPerContribution: 500,
            timePeriodYears: 5,
        } satisfies CostAveragingSimulatorRequestSchema;

        result.current.mutate(requestBody);

        await waitFor(() => {
            expect(mockKyClient.POST).toHaveBeenCalledWith(
                "/simulate/cost-averaging",
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
