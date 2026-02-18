import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import MockEnvironmentProvider from "@/app/tests/_mocks/MockEnvironmentProvider";
import { useCurrencyList } from "./useCurrencyList";

const mockGetCurrencyList = vi.fn();

const mockKyClient = {
    GET: mockGetCurrencyList,
};

vi.mock("@/lib/api/ky-client", () => ({
    useKyClient: () => mockKyClient,
}));

describe("useCurrencyList", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderUseCurrencyListHook = () => {
        return renderHook(() => useCurrencyList(), {
            wrapper: ({ children }) => (
                <MockEnvironmentProvider>{children}</MockEnvironmentProvider>
            ),
        });
    };

    it("should call GET /currencies successfully", async () => {
        mockGetCurrencyList.mockResolvedValue({
            data: {
                data: [
                    { code: "USD", name: "US Dollar" },
                    { code: "GBP", name: "British Pound" },
                ],
            },
        });

        const { result } = renderUseCurrencyListHook();

        await waitFor(() => {
            expect(mockKyClient.GET).toHaveBeenCalledWith("/currencies");

            expect(result.current.data).toEqual([
                { code: "USD", name: "US Dollar" },
                { code: "GBP", name: "British Pound" },
            ]);
            expect(result.current.isLoading).toBe(false);
        });
    });
});
