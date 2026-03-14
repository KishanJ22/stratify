const startOfMonthDate = (monthsAgo: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo, 1);

    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    if (isWeekend) {
        date.setDate(date.getDay() === 0 ? 2 : 3);
    }

    return date;
};

const endOfMonthDate = (monthsAgo: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo + 1, 0);

    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    if (isWeekend) {
        date.setDate(date.getDate() - (date.getDay() === 0 ? 2 : 1));
    }

    return date;
};

export const mockHistoricAssetPrices = [
    {
        assetId: 3,
        priceDate: new Date(),
        lowPrice: 0.75,
        highPrice: 0.77,
        openPrice: 0.76,
        closePrice: 0.73,
        volume: 0,
    },
    {
        assetId: 1,
        priceDate: startOfMonthDate(1),
        lowPrice: 10,
        highPrice: 20,
        openPrice: 15,
        closePrice: 15,
        volume: 1000,
    },
    {
        assetId: 2,
        priceDate: startOfMonthDate(1),
        lowPrice: 10,
        highPrice: 20,
        openPrice: 15,
        closePrice: 25,
        volume: 1000,
    },
    {
        assetId: 1,
        priceDate: endOfMonthDate(1),
        lowPrice: 10,
        highPrice: 20,
        openPrice: 15,
        closePrice: 17,
        volume: 1000,
    },
    {
        assetId: 2,
        priceDate: endOfMonthDate(1),
        lowPrice: 10,
        highPrice: 20,
        openPrice: 15,
        closePrice: 22,
        volume: 1000,
    },
    {
        assetId: 1,
        priceDate: startOfMonthDate(2),
        lowPrice: 10,
        highPrice: 20,
        openPrice: 15,
        closePrice: 17,
        volume: 1000,
    },
    {
        assetId: 2,
        priceDate: startOfMonthDate(2),
        lowPrice: 10,
        highPrice: 20,
        openPrice: 15,
        closePrice: 22,
        volume: 1000,
    },
    {
        assetId: 1,
        priceDate: endOfMonthDate(2),
        lowPrice: 10,
        highPrice: 20,
        openPrice: 15,
        closePrice: 16,
        volume: 1000,
    },
    {
        assetId: 2,
        priceDate: endOfMonthDate(2),
        lowPrice: 10,
        highPrice: 20,
        openPrice: 15,
        closePrice: 21,
        volume: 1000,
    },
    {
        assetId: 1,
        priceDate: startOfMonthDate(3),
        lowPrice: 10,
        highPrice: 20,
        openPrice: 15,
        closePrice: 16,
        volume: 1000,
    },
    {
        assetId: 2,
        priceDate: startOfMonthDate(3),
        lowPrice: 10,
        highPrice: 20,
        openPrice: 15,
        closePrice: 21,
        volume: 1000,
    },
    {
        assetId: 1,
        priceDate: endOfMonthDate(3),
        lowPrice: 10,
        highPrice: 20,
        openPrice: 15,
        closePrice: 18,
        volume: 1000,
    },
    {
        assetId: 2,
        priceDate: endOfMonthDate(3),
        lowPrice: 10,
        highPrice: 20,
        openPrice: 15,
        closePrice: 23,
        volume: 1000,
    },
    {
        assetId: 4,
        priceDate: startOfMonthDate(1),
        lowPrice: 10,
        highPrice: 20,
        openPrice: 15,
        closePrice: 18,
        volume: 1000,
    },
    {
        assetId: 4,
        priceDate: endOfMonthDate(1),
        lowPrice: 10,
        highPrice: 20,
        openPrice: 15,
        closePrice: 21,
        volume: 1000,
    },
    {
        assetId: 4,
        priceDate: startOfMonthDate(2),
        lowPrice: 10,
        highPrice: 20,
        openPrice: 13,
        closePrice: 17,
        volume: 1000,
    },
    {
        assetId: 4,
        priceDate: endOfMonthDate(2),
        lowPrice: 10,
        highPrice: 20,
        openPrice: 12,
        closePrice: 20,
        volume: 1000,
    },
];
