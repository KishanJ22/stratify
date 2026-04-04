import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import MockEnvironmentProvider from "@/app/tests/_mocks/MockEnvironmentProvider";
import { useAssetCurrentPrice } from "./useAssetCurrentPrice";

const mockGetAssetCurrentPrice = vi.fn();

const mockKyClient = {
    GET: mockGetAssetCurrentPrice,
};

vi.mock("@/lib/api/ky-client", () => ({
    useKyClient: () => mockKyClient,
}));

describe("useAssetCurrentPrice", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderAssetCurrentPriceHook = (assetId = 1) => {
        return renderHook(() => useAssetCurrentPrice(assetId), {
            wrapper: ({ children }) => (
                <MockEnvironmentProvider>{children}</MockEnvironmentProvider>
            ),
        });
    };

    it("should call GET /assets/{assetId}/current-price successfully", async () => {
        mockGetAssetCurrentPrice.mockResolvedValue({
            data: {
                data: {
                    currentPrice: 150,
                },
            },
        });

        const { result } = renderAssetCurrentPriceHook();

        await waitFor(() => {
            expect(mockKyClient.GET).toHaveBeenCalledWith(
                "/assets/{assetId}/current-price",
                {
                    params: {
                        path: {
                            assetId: 1,
                        },
                    },
                },
            );

            expect(result.current.data).toEqual({ currentPrice: 150 });
            expect(result.current.isLoading).toBe(false);
        });
    });
});
