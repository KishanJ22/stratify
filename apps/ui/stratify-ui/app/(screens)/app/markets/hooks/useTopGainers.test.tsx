import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import MockEnvironmentProvider from "@/app/tests/_mocks/MockEnvironmentProvider";
import { useTopGainers } from "./useTopGainers";

const mockGetTopGainers = vi.fn();

const mockKyClient = {
    GET: mockGetTopGainers,
};

vi.mock("@/lib/api/ky-client", () => ({
    useKyClient: () => mockKyClient,
}));

describe("useTopGainers", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderGetTopGainersHook = () => {
        return renderHook(() => useTopGainers(), {
            wrapper: ({ children }) => (
                <MockEnvironmentProvider>{children}</MockEnvironmentProvider>
            ),
        });
    };

    it("should call GET /data/markets/top-gainers successfully", async () => {
        mockGetTopGainers.mockResolvedValue({
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

        const { result } = renderGetTopGainersHook();

        result.current.fetchTopGainersList();

        await waitFor(() => {
            expect(mockKyClient.GET).toHaveBeenCalledWith(
                "/data/market/top-gainers",
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
