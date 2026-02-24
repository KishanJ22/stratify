import { describe, expect, it } from "vitest";
import { addInvestmentSchema } from "./add-investment-schema";

const mockSuccessValues = {
    assetName: "Apple Inc.",
    tradeDate: new Date().toISOString().split("T")[0],
    pricePerShare: "90.25",
    quantity: "10",
    currencyConversionRate: "0.75",
    fee: "0",
    total: 676.88,
    assetCurrencyTotal: 902.5,
};

describe("addInvestmentSchema", () => {
    it("should pass validation with valid data", () => {
        const result = addInvestmentSchema.safeParse(mockSuccessValues);

        expect(result.success).toBe(true);
        expect(result.error).toBeUndefined();
    });

    it("should fail validation when the asset name is empty", () => {
        const result = addInvestmentSchema.safeParse({
            ...mockSuccessValues,
            assetName: "",
        });

        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(
            "Asset should be selected",
        );
    });

    it("should fail validation when the trade date is in the future", () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);

        const result = addInvestmentSchema.safeParse({
            ...mockSuccessValues,
            tradeDate: futureDate.toISOString().split("T")[0],
        });

        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(
            "Trade date should not in the future",
        );
    });

    it("should fail validation when the price per share is zero", () => {
        const result = addInvestmentSchema.safeParse({
            ...mockSuccessValues,
            pricePerShare: "0",
        });

        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(
            "Price per share should be a number greater than 0",
        );
    });

    it("should fail validation when the quantity is zero", () => {
        const result = addInvestmentSchema.safeParse({
            ...mockSuccessValues,
            quantity: "0",
        });

        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(
            "Quantity should be a number greater than 0",
        );
    });

    it("should fail validation when the currency conversion rate is zero", () => {
        const result = addInvestmentSchema.safeParse({
            ...mockSuccessValues,
            currencyConversionRate: "0",
        });

        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(
            "Currency conversion rate should be greater than 0",
        );
    });

    it("should fail validation when the fee is negative", () => {
        const result = addInvestmentSchema.safeParse({
            ...mockSuccessValues,
            fee: "-1",
        });

        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(
            "Fee should be a number greater than or equal to 0",
        );
    });

    it("should fail validation when the total is zero", () => {
        const result = addInvestmentSchema.safeParse({
            ...mockSuccessValues,
            total: 0,
        });

        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(
            "Total should be greater than 0",
        );
    });

    it("should pass validation even if the asset currency total is not provided", () => {
        const { assetCurrencyTotal, ...valuesWithoutAssetCurrencyTotal } =
            mockSuccessValues;

        const result = addInvestmentSchema.safeParse(
            valuesWithoutAssetCurrencyTotal,
        );

        expect(result.success).toBe(true);
        expect(result.error).toBeUndefined();
    });
});
