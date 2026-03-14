import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import MockEnvironmentProvider from "@/app/tests/_mocks/MockEnvironmentProvider";
import { usePortfolioList } from "./usePortfolioList";

const mockGetPortfolioList = vi.fn();

const mockKyClient = {
    GET: mockGetPortfolioList,
};

vi.mock("@/lib/api/ky-client", () => ({
    useKyClient: () => mockKyClient,
}));

describe("usePortfolioList", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderGetPortfolioListHook = () => {
        return renderHook(() => usePortfolioList(), {
            wrapper: ({ children }) => (
                <MockEnvironmentProvider>{children}</MockEnvironmentProvider>
            ),
        });
    };

    it("should call GET /portfolios successfully", async () => {
        mockGetPortfolioList.mockResolvedValue({
            data: {
                data: [
                    { id: 1, name: "Portfolio 1" },
                    { id: 2, name: "Portfolio 2" },
                ],
            },
        });

        const { result } = renderGetPortfolioListHook();

        await waitFor(() => {
            expect(mockKyClient.GET).toHaveBeenCalledWith("/portfolios");

            expect(result.current.data).toEqual([
                { id: 1, name: "Portfolio 1" },
                { id: 2, name: "Portfolio 2" },
            ]);

            expect(result.current.isLoading).toBe(false);
        });
    });
});
