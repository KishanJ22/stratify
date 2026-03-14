import * as zod from "zod";

const endOfDayToday = new Date(new Date().setHours(23, 59, 59, 999));

export const addInvestmentSchema = zod.object({
    assetName: zod.string().min(1, { error: "Asset should be selected" }),
    tradeDate: zod.string().refine(
        (date) => {
            const parsedDate = Date.parse(date);
            return parsedDate <= endOfDayToday.getTime();
        },
        {
            error: "Trade date should not in the future",
        },
    ),
    pricePerShare: zod.string().refine(
        (value) => {
            const numberValue = parseFloat(value);
            return !isNaN(numberValue) && numberValue > 0;
        },
        {
            error: "Price per share should be a number greater than 0",
        },
    ),
    quantity: zod.string().refine(
        (value) => {
            const numberValue = parseFloat(value);

            return !isNaN(numberValue) && numberValue > 0;
        },
        { error: "Quantity should be a number greater than 0" },
    ),
    currencyConversionRate: zod.string().refine(
        (value) => {
            const numberValue = parseFloat(value);

            return !isNaN(numberValue) && numberValue > 0;
        },
        {
            error: "Currency conversion rate should be greater than 0",
        },
    ),
    fee: zod.string().refine(
        (value) => {
            const numberValue = parseFloat(value);

            return !isNaN(numberValue) && numberValue >= 0;
        },
        { error: "Fee should be a number greater than or equal to 0" },
    ),
    total: zod
        .number({ error: "Total should be a number" })
        .min(0.01, { error: "Total should be greater than 0" }),
    assetCurrencyTotal: zod.optional(
        zod.number().min(0, { error: "Total should be greater than 0" }),
    ),
});

export type AddInvestmentSchema = zod.input<typeof addInvestmentSchema>;
