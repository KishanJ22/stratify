import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import MockEnvironmentProvider from "@/app/tests/_mocks/MockEnvironmentProvider";
import { useHistoricAssetPrice } from "./useHistoricAssetPrice";

const mockGetHistoricAssetPrice = vi.fn();

const mockKyClient = {
    GET: mockGetHistoricAssetPrice,
};

vi.mock("@/lib/api/ky-client", () => ({
    useKyClient: () => mockKyClient,
}));

describe("useHistoricAssetPrice", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderGetHistoricAssetPriceHook = () => {
        return renderHook(() => useHistoricAssetPrice(), {
            wrapper: ({ children }) => (
                <MockEnvironmentProvider>{children}</MockEnvironmentProvider>
            ),
        });
    };

    it("should call GET /assets/{assetId}/historic-price successfully", async () => {
        mockGetHistoricAssetPrice.mockResolvedValue({
            data: {
                data: { price: 100 },
            },
        });

        const { result } = renderGetHistoricAssetPriceHook();

        expect(result.current.isPending).toBe(false);
        result.current.mutate({ assetId: 1, tradeDate: "2026-02-15" });

        await waitFor(() => {
            expect(mockKyClient.GET).toHaveBeenCalledWith(
                "/assets/{assetId}/historic-price",
                {
                    params: {
                        path: {
                            assetId: 1,
                        },
                        query: {
                            tradeDate: "2026-02-15",
                        },
                    },
                },
            );

            expect(result.current.data).toEqual({ price: 100 });
            expect(result.current.isPending).toBe(false);
            expect(result.current.isSuccess).toBe(true);
        });
    });
});
