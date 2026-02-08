import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import MockEnvironmentProvider from "@/app/tests/_mocks/MockEnvironmentProvider";
import { useTopLosers } from "./useTopLosers";

const mockGetTopLosers = vi.fn();

const mockKyClient = {
    GET: mockGetTopLosers,
};

vi.mock("@/lib/api/ky-client", () => ({
    useKyClient: () => mockKyClient,
}));

describe("useTopLosers", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderGetTopLosersHook = () => {
        return renderHook(() => useTopLosers(), {
            wrapper: ({ children }) => (
                <MockEnvironmentProvider>{children}</MockEnvironmentProvider>
            ),
        });
    };

    it("should call GET /data/markets/top-losers successfully", async () => {
        mockGetTopLosers.mockResolvedValue({
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

        const { result } = renderGetTopLosersHook();

        result.current.fetchTopLosersList();

        await waitFor(() => {
            expect(mockKyClient.GET).toHaveBeenCalledWith(
                "/data/market/top-losers",
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
