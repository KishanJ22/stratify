import { useCreatePortfolio } from "./useCreatePortfolio";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import MockEnvironmentProvider from "@/app/tests/_mocks/MockEnvironmentProvider";

const mockPostCreatePortfolio = vi.fn();

const mockKyClient = {
    POST: mockPostCreatePortfolio,
};

vi.mock("@/lib/api/ky-client", () => ({
    useKyClient: () => mockKyClient,
}));

describe("useCreatePortfolio", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderCreatePortfolioHook = () => {
        return renderHook(() => useCreatePortfolio(), {
            wrapper: ({ children }) => (
                <MockEnvironmentProvider>{children}</MockEnvironmentProvider>
            ),
        });
    };

    it("should call POST /portfolios successfully", async () => {
        mockPostCreatePortfolio.mockResolvedValue({
            data: {
                portfolioId: 1,
            },
        });

        const { result } = renderCreatePortfolioHook();

        expect(result.current.isPending).toBe(false);
        result.current.mutate({ name: "New Portfolio" });

        await waitFor(() => {
            expect(mockKyClient.POST).toHaveBeenCalledWith("/portfolios", {
                body: { name: "New Portfolio" },
            });

            expect(result.current.isSuccess).toBe(true);
        });
    });
});
