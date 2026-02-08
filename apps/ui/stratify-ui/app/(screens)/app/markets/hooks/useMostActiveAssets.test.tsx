import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import MockEnvironmentProvider from "@/app/tests/_mocks/MockEnvironmentProvider";
import { useMostActiveAssets } from "./useMostActiveAssets";

const mockGetMostActiveAssets = vi.fn();

const mockKyClient = {
    GET: mockGetMostActiveAssets,
};

vi.mock("@/lib/api/ky-client", () => ({
    useKyClient: () => mockKyClient,
}));

describe("useMostActiveAssets", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderGetMostActiveAssetsHook = () => {
        return renderHook(() => useMostActiveAssets(), {
            wrapper: ({ children }) => (
                <MockEnvironmentProvider>{children}</MockEnvironmentProvider>
            ),
        });
    };

    it("should call GET /data/markets/most-active successfully", async () => {
        mockGetMostActiveAssets.mockResolvedValue({
            data: {
                data: [
                    {
                        name: "Apple Inc.",
                        symbol: "AAPL",
                        assetType: "STOCK",
                        marketState: "REGULAR",
                        currency: "USD",
                        priceDetails: {
                            currentPrice: 150.25,
                            volume: 1000000,
                            priceChange: 2.5,
                            priceChangePercent: 1.69,
                        },
                    },
                ],
            },
        });

        const { result } = renderGetMostActiveAssetsHook();

        result.current.fetchMostActiveAssetsList();

        await waitFor(() => {
            expect(mockKyClient.GET).toHaveBeenCalledWith(
                "/data/market/most-active",
            );

            expect(result.current.data).toEqual([
                {
                    name: "Apple Inc.",
                    symbol: "AAPL",
                    assetType: "STOCK",
                    marketState: "REGULAR",
                    currency: "USD",
                    priceDetails: {
                        currentPrice: 150.25,
                        volume: 1000000,
                        priceChange: 2.5,
                        priceChangePercent: 1.69,
                    },
                },
            ]);

            expect(result.current.isLoading).toBe(false);
        });
    });
});
