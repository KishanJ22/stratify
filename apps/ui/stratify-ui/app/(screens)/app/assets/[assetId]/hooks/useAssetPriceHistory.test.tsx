import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import MockEnvironmentProvider from "@/app/tests/_mocks/MockEnvironmentProvider";
import {
    AssetPriceHistory,
    useAssetPriceHistory,
} from "./useAssetPriceHistory";

const mockGetAssetPriceHistory = vi.fn();

const mockKyClient = {
    GET: mockGetAssetPriceHistory,
};

vi.mock("@/lib/api/ky-client", () => ({
    useKyClient: () => mockKyClient,
}));

describe("useAssetPriceHistory", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderAssetPriceHistoryHook = (assetId = 1) => {
        return renderHook(() => useAssetPriceHistory(assetId), {
            wrapper: ({ children }) => (
                <MockEnvironmentProvider>{children}</MockEnvironmentProvider>
            ),
        });
    };

    it("should call GET /assets/{assetId}/price-history successfully", async () => {
        const mockPriceHistoryData = [
            {
                date: "2026-01-01",
                priceDetails: {
                    open: 100,
                    close: 110,
                    high: 115,
                    low: 95,
                },
            },
        ] satisfies AssetPriceHistory[];

        mockGetAssetPriceHistory.mockResolvedValue({
            data: {
                data: mockPriceHistoryData,
            },
        });

        const { result } = renderAssetPriceHistoryHook();

        await waitFor(() => {
            expect(mockKyClient.GET).toHaveBeenCalledWith(
                "/assets/{assetId}/price-history",
                {
                    params: {
                        path: {
                            assetId: 1,
                        },
                    },
                },
            );

            expect(result.current.data).toEqual(mockPriceHistoryData);
            expect(result.current.isLoading).toBe(false);
        });
    });
});
