import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import MockEnvironmentProvider from "@/app/tests/_mocks/MockEnvironmentProvider";
import { usePortfoliosOverview } from "./usePortfoliosOverview";

const mockGetPortfoliosOverview = vi.fn();

const mockKyClient = {
    GET: mockGetPortfoliosOverview,
};

vi.mock("@/lib/api/ky-client", () => ({
    useKyClient: () => mockKyClient,
}));

describe("usePortfoliosOverview", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderGetPortfoliosOverviewHook = () => {
        return renderHook(() => usePortfoliosOverview(), {
            wrapper: ({ children }) => (
                <MockEnvironmentProvider>{children}</MockEnvironmentProvider>
            ),
        });
    };

    it("should call GET /portfolios/overview successfully", async () => {
        mockGetPortfoliosOverview.mockResolvedValue({
            data: {
                data: mockGetPortfoliosOverview,
            },
        });

        const { result } = renderGetPortfoliosOverviewHook();

        await waitFor(() => {
            expect(mockKyClient.GET).toHaveBeenCalledWith(
                "/portfolios/overview",
            );

            expect(result.current.data).toEqual(mockGetPortfoliosOverview);
            expect(result.current.isLoading).toBe(false);
        });
    });
});
