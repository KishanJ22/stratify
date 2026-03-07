import { Convert } from "easy-currencies";

export const getConvertedAmount = async (
    fromCurrency: string,
    toCurrency: string,
    amount: number,
) => {
    const conversionRate = await Convert(amount)
        .from(fromCurrency)
        .to(toCurrency);

    return conversionRate;
};
