import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import MockEnvironmentProvider from "@/app/tests/_mocks/MockEnvironmentProvider";
import { useHistoricCurrencyPairPrice } from "./useHistoricConversionRate";

const mockGetHistoricCurrencyPairPrice = vi.fn();

const mockKyClient = {
    GET: mockGetHistoricCurrencyPairPrice,
};

vi.mock("@/lib/api/ky-client", () => ({
    useKyClient: () => mockKyClient,
}));

describe("useHistoricCurrencyPairPrice", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderGetHistoricCurrencyPairPriceHook = () => {
        return renderHook(() => useHistoricCurrencyPairPrice(), {
            wrapper: ({ children }) => (
                <MockEnvironmentProvider>{children}</MockEnvironmentProvider>
            ),
        });
    };

    it("should call GET /currencies/{currencyPair}/historic-price successfully", async () => {
        mockGetHistoricCurrencyPairPrice.mockResolvedValue({
            data: {
                data: { price: 1.5 },
            },
        });

        const { result } = renderGetHistoricCurrencyPairPriceHook();

        expect(result.current.isPending).toBe(false);

        result.current.mutate({
            currencyPair: "USDGBP",
            tradeDate: "2026-02-15",
        });

        await waitFor(() => {
            expect(mockKyClient.GET).toHaveBeenCalledWith(
                "/currencies/{currencyPair}/historic-price",
                {
                    params: {
                        path: {
                            currencyPair: "USDGBP",
                        },
                        query: {
                            tradeDate: "2026-02-15",
                        },
                    },
                },
            );

            expect(result.current.data).toEqual({ price: 1.5 });
            expect(result.current.isPending).toBe(false);
            expect(result.current.isSuccess).toBe(true);
        });
    });
});
