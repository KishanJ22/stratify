import { describe, expect, it } from "vitest";
import { addTradeSchema } from "./add-trade-schema";

const mockSuccessValues = {
    assetName: "Apple Inc.",
    tradeDate: new Date().toISOString().split("T")[0],
    pricePerShare: "90.25",
    quantity: "10",
    tradeType: "BUY",
    currencyConversionRate: "0.75",
    fee: "0",
    total: 676.88,
    assetCurrencyTotal: 902.5,
};

describe("addTradeSchema", () => {
    it("should pass validation with valid data", () => {
        const result = addTradeSchema.safeParse(mockSuccessValues);

        expect(result.success).toBe(true);
        expect(result.error).toBeUndefined();
    });

    it("should fail validation when the trade type is empty", () => {
        const result = addTradeSchema.safeParse({
            ...mockSuccessValues,
            tradeType: null,
        });

        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(
            "Trade type should either be BUY or SELL",
        );
    });
});
