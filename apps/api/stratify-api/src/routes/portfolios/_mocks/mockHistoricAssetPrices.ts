const startOfMonthDate = (monthsAgo: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo, 1);

    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    if (isWeekend) {
        date.setDate(date.getDay() === 0 ? 2 : 3);
    }

    return date;
};

const generateAssetPriceHistory = (
    assetId: number,
    startDate: Date,
    isCurrency = false,
) => {
    const prices = [];

    const currentDate = new Date(startDate);
    const now = new Date();

    while (currentDate <= now) {
        const day = currentDate.getDay();
        if (day !== 0 && day !== 6) {
            prices.push({
                assetId,
                priceDate: new Date(currentDate).toISOString().split("T")[0],
                lowPrice: 10,
                highPrice: 20,
                openPrice: 15,
                closePrice: isCurrency ? 1.5 : 20,
                volume: 1000,
            });
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return prices;
};

export const mockHistoricAssetPrices = [
    ...generateAssetPriceHistory(1, startOfMonthDate(7)),
    ...generateAssetPriceHistory(2, startOfMonthDate(7)),
    ...generateAssetPriceHistory(3, startOfMonthDate(7), true),
    ...generateAssetPriceHistory(4, startOfMonthDate(7)),
];
