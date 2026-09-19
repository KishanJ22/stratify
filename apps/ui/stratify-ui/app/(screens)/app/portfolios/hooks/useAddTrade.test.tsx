import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MockEnvironmentProvider from "@/app/tests/_mocks/MockEnvironmentProvider";
import { type AddTradeRequestSchema, useAddTrade } from "./useAddTrade";

const mockPostAddTrade = vi.fn();

const mockKyClient = {
	POST: mockPostAddTrade,
};

vi.mock("@/lib/api/ky-client", () => ({
	useKyClient: () => mockKyClient,
}));

describe("useAddTrade", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const renderAddTradeHook = (portfolioId = 1) => {
		return renderHook(() => useAddTrade(portfolioId), {
			wrapper: ({ children }) => (
				<MockEnvironmentProvider>{children}</MockEnvironmentProvider>
			),
		});
	};

	it("should call POST /portfolios/{portfolioId}/add-trade successfully", async () => {
		mockPostAddTrade.mockResolvedValue({
			data: {
				success: true,
			},
		});

		const { result } = renderAddTradeHook();

		expect(result.current.isPending).toBe(false);

		const tradeData = {
			assetId: 1,
			quantity: 10,
			pricePerShare: 90.5,
			tradeDate: "2026-02-12",
			tradeAction: "BUY",
			fee: 0,
			totalAmount: 905,
			assetCurrencyTotalAmount: 905,
			currencyConversionRate: 1,
		} satisfies AddTradeRequestSchema;

		result.current.mutate(tradeData);

		await waitFor(() => {
			expect(mockKyClient.POST).toHaveBeenCalledWith(
				"/portfolios/{portfolioId}/add-trade",
				{
					body: tradeData,
					params: {
						path: {
							portfolioId: 1,
						},
					},
				},
			);

			expect(result.current.isSuccess).toBe(true);
		});
	});
});
