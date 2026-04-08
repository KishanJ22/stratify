"use client";

export const formatNumericValue = (
    value: number,
    currency?: string,
    fracDigits = 2,
    locale = "en",
) => {
    const fractionDigits = Number.isInteger(value) ? 0 : fracDigits;
    const formattedValue = value.toLocaleString(locale, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    });

    return currency ? `${formattedValue} (${currency})` : formattedValue;
};
