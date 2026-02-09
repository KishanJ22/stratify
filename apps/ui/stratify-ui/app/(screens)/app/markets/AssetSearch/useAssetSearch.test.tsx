import { renderHook, waitFor } from "@testing-library/react";
import { describe, vi, beforeEach, it, expect } from "vitest";
import { useAssetSearch } from "./useAssetSearch";
import MockEnvironmentProvider from "@/app/tests/_mocks/MockEnvironmentProvider";

const mockSearchAsset = {
    name: "Apple Inc.",
    symbol: "AAPL",
    assetType: "STOCK",
    currentPrice: 150.25,
    priceChangePercent: 1.5,
    priceChange: 2.25,
    currency: "USD",
};

const mockPostSearchAssets = vi.fn();

const mockKyClient = {
    POST: mockPostSearchAssets,
};

vi.mock("@/lib/api/ky-client", () => ({
    useKyClient: () => mockKyClient,
}));

describe("useAssetSearch", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderAssetSearchHook = (searchValue: string) => {
        return renderHook(() => useAssetSearch(searchValue), {
            wrapper: ({ children }) => (
                <MockEnvironmentProvider>{children}</MockEnvironmentProvider>
            ),
        });
    };

    it("should call POST /assets/search with the search value successfully", async () => {
        mockPostSearchAssets.mockResolvedValue({
            data: {
                data: [mockSearchAsset],
            },
        });

        const { result } = renderAssetSearchHook("AAPL");

        expect(result.current.isSearching).toBe(false);

        result.current.search();

        await waitFor(() => {
            expect(mockKyClient.POST).toHaveBeenCalledWith("/assets/search", {
                body: { query: "AAPL" },
            });

            expect(result.current.searchStatus).toBe("success");
            expect(result.current.searchResults).toEqual([mockSearchAsset]);
        });
    });
});
