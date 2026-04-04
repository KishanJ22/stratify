"use client";

export const formatNumericValue = (
    value: number,
    currency?: string,
    locale = "en",
) => {
    const fractionDigits = Number.isInteger(value) ? 0 : 2;
    const formattedValue = value.toLocaleString(locale, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: 2,
    });

    return currency ? `${formattedValue} (${currency})` : formattedValue;
};
