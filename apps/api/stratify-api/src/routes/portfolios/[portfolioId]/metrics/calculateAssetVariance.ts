import db from "../../../../database/db.js";

export const calculateAssetVariance = async (assetId: number) => {
    //? Calculate the variance and downside variance based on monthly returns over the last 5 years
    const startDate = new Date(
        new Date().setFullYear(new Date().getFullYear() - 5),
    );

    const dailyAssetPrices = await assetPricesQuery(
        assetId,
        startDate,
    ).execute();

    const monthlyReturns: number[] = [];

    for (
        let date = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        date < new Date();
        date.setMonth(date.getMonth() + 1)
    ) {
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const isStartOfMonthOnWeekend =
            startOfMonth.getDay() === 0 || startOfMonth.getDay() === 6;

        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const isEndOfMonthOnWeekend =
            endOfMonth.getDay() === 0 || endOfMonth.getDay() === 6;

        //? Set start and end of month to nearest weekday if they are on a weekend
        if (isStartOfMonthOnWeekend) {
            startOfMonth.setDate(
                startOfMonth.getDate() + (startOfMonth.getDay() === 0 ? 1 : 2),
            );
        }

        if (isEndOfMonthOnWeekend) {
            endOfMonth.setDate(
                endOfMonth.getDate() - (endOfMonth.getDay() === 0 ? 2 : 1),
            );
        }

        const formattedStartMonthDate = startOfMonth
            .toISOString()
            .split("T")[0];

        const formattedEndMonthDate = endOfMonth.toISOString().split("T")[0];

        const startMonthPrice = dailyAssetPrices.find(
            (price) =>
                price.priceDate.toISOString().split("T")[0] ===
                formattedStartMonthDate,
        )?.assetPrice;

        const endMonthPrice = dailyAssetPrices.find(
            (price) =>
                price.priceDate.toISOString().split("T")[0] ===
                formattedEndMonthDate,
        )?.assetPrice;

        if (startMonthPrice && endMonthPrice) {
            const monthlyReturn =
                (parseFloat(endMonthPrice) - parseFloat(startMonthPrice)) /
                parseFloat(startMonthPrice);

            monthlyReturns.push(monthlyReturn);
        }
    }

    const meanReturn =
        monthlyReturns.reduce((acc, ret) => acc + ret, 0) /
        monthlyReturns.length;

    const minimumAcceptableReturn = 0;

    //? Go through the monthly returns and calculate the variance and downside variance
    const { variance, downsideVariance } = monthlyReturns.reduce(
        (acc, ret) => {
            const isDownside = ret < minimumAcceptableReturn;

            return {
                variance: acc.variance + Math.pow(ret - meanReturn, 2),
                downsideVariance:
                    acc.downsideVariance +
                    (isDownside
                        ? Math.pow(ret - minimumAcceptableReturn, 2)
                        : 0),
            };
        },
        {
            variance: 0,
            downsideVariance: 0,
        },
    );

    return {
        assetId,
        variance: variance / (monthlyReturns.length - 1),
        downsideVariance: downsideVariance / (monthlyReturns.length - 1),
        meanReturn,
    };
};

const assetPricesQuery = (assetId: number, startDate: Date) =>
    db
        .selectFrom("stratify.assetPrices as assetPrices")
        .where("assetPrices.assetId", "=", assetId)
        .where("assetPrices.priceDate", ">", startDate)
        .select([
            "assetPrices.assetId as assetId",
            "assetPrices.closePrice as assetPrice",
            "assetPrices.priceDate as priceDate",
        ])
        .orderBy("assetPrices.priceDate", "asc");
