"use client";

export const formatNumericValue = (
    value: number,
    currency?: string,
    locale = "en",
) => {
    const formattedValue = value.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return currency ? `${formattedValue} (${currency})` : formattedValue;
};
