import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import MockEnvironmentProvider from "@/app/tests/_mocks/MockEnvironmentProvider";
import { usePortfolioMetrics } from "./usePortfolioMetrics";
import { mockMetricsData } from "./_mocks/mockMetricsData";

const mockGetPortfolioMetrics = vi.fn();

const mockKyClient = {
    GET: mockGetPortfolioMetrics,
};

vi.mock("@/lib/api/ky-client", () => ({
    useKyClient: () => mockKyClient,
}));

describe("usePortfolioMetrics", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderGetPortfolioMetricsHook = () => {
        return renderHook(() => usePortfolioMetrics(1), {
            wrapper: ({ children }) => (
                <MockEnvironmentProvider>{children}</MockEnvironmentProvider>
            ),
        });
    };

    it("should call GET /portfolios/{portfolioId}/metrics successfully", async () => {
        mockGetPortfolioMetrics.mockResolvedValue({
            data: {
                data: mockMetricsData,
            },
        });

        const { result } = renderGetPortfolioMetricsHook();

        await waitFor(() => {
            expect(mockKyClient.GET).toHaveBeenCalledWith(
                "/portfolios/{portfolioId}/metrics",
                {
                    params: {
                        path: { portfolioId: 1 },
                    },
                },
            );

            expect(result.current.data).toEqual(mockMetricsData);
            expect(result.current.isLoading).toBe(false);
        });
    });
});
