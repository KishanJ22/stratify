import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import MockEnvironmentProvider from "@/app/tests/_mocks/MockEnvironmentProvider";
import { useAssetHoldings } from "./useAssetHoldings";

const mockGetAssetHoldings = vi.fn();

const mockKyClient = {
    GET: mockGetAssetHoldings,
};

vi.mock("@/lib/api/ky-client", () => ({
    useKyClient: () => mockKyClient,
}));

describe("useAssetHoldings", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderAssetHoldingsHook = (assetId = 1) => {
        return renderHook(() => useAssetHoldings(assetId), {
            wrapper: ({ children }) => (
                <MockEnvironmentProvider>{children}</MockEnvironmentProvider>
            ),
        });
    };

    it("should call GET /assets/{assetId/holdings successfully", async () => {
        const mockHoldingsData = [
            {
                shares: 15,
                currentValue: 1664.4,
                currentValueAssetCurrency: 2280,
                averagePricePerShare: 100,
                averagePricePerShareAssetCurrency: 110,
                currentReturn: 164.4,
                currentReturnPercentage: 10.96,
                totalBuyAmount: 1500,
                totalBuyAmountAssetCurrency: 1650,
                portfolioId: 1,
            },
        ];

        mockGetAssetHoldings.mockResolvedValue({
            data: {
                data: mockHoldingsData,
            },
        });

        const { result } = renderAssetHoldingsHook();

        await waitFor(() => {
            expect(mockKyClient.GET).toHaveBeenCalledWith(
                "/assets/{assetId}/holdings",
                {
                    params: {
                        path: {
                            assetId: 1,
                        }
                    },
                },
            );
            
            expect(result.current.data).toEqual(mockHoldingsData);
            expect(result.current.isLoading).toBe(false);
        });
    });
});
