import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import MockEnvironmentProvider from "@/app/tests/_mocks/MockEnvironmentProvider";
import { useAssetDetails } from "./useAssetDetails";
import { mockStockAssetDetails } from "../_mocks/mockStockAssetDetails";

const mockGetAssetDetails = vi.fn();

const mockKyClient = {
    GET: mockGetAssetDetails,
};

vi.mock("@/lib/api/ky-client", () => ({
    useKyClient: () => mockKyClient,
}));

describe("useAssetDetails", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderAssetDetailsHook = (assetId = 1) => {
        return renderHook(() => useAssetDetails(assetId), {
            wrapper: ({ children }) => (
                <MockEnvironmentProvider>{children}</MockEnvironmentProvider>
            ),
        });
    };

    it("should call GET /asset/{assetId}/details successfully", async () => {
        mockGetAssetDetails.mockResolvedValue({
            data: {
                data: mockStockAssetDetails,
            },
        });

        const { result } = renderAssetDetailsHook();

        await waitFor(() => {
            expect(mockKyClient.GET).toHaveBeenCalledWith(
                "/assets/{assetId}/details",
                {
                    params: {
                        path: {
                            assetId: 1,
                        },
                    },
                },
            );

            expect(result.current.data).toEqual(mockStockAssetDetails);
            expect(result.current.isLoading).toBe(false);
        });
    });
});
