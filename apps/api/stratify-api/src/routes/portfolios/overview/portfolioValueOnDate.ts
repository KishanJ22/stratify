import { getFromStore } from "../../../plugins/localStorage.js";
import { adjustForWeekend } from "../../../utils/adjustForWeekend.js";
import { UserDetails } from "../../../utils/decodeToken.js";
import { UniqueAsset } from "../[portfolioId]/value-history/calculateValueHistory.js";
import { Trade } from "./allTradesQuery.js";

export const portfolioValueOnDate = (
    targetDate: Date,
    trades: Trade[],
    historicAssetPrices: Map<string, number>,
    currentAssetPrices: Map<number, number>,
    currencyRates: [
        {
            currencyPair: string;
            priceDate: string;
        },
        number,
    ][],
    uniqueAssets: Map<number, UniqueAsset>,
) => {
    const { userCurrency } = getFromStore("user") as UserDetails;
    const today = new Date();

    const adjustedTargetDate = adjustForWeekend(targetDate);
    const formattedTargetDate = adjustedTargetDate.toISOString().split("T")[0];
    const formattedToday = today.toISOString().split("T")[0];

    const netQuantity = new Map<number, number>();

    for (const trade of trades) {
        if (trade.tradeDate > adjustedTargetDate) continue;

        const tradeQuantity = parseFloat(trade.quantity);
        const currentQuantity = netQuantity.get(trade.assetId) ?? 0;

        netQuantity.set(
            trade.assetId,
            trade.tradeAction === "BUY"
                ? currentQuantity + tradeQuantity
                : currentQuantity - tradeQuantity,
        );
    }

    let totalValue = 0;

    for (const [assetId, quantity] of netQuantity) {
        if (quantity === 0) continue;

        const asset = uniqueAssets.get(assetId);

        const assetPrice =
            formattedTargetDate === formattedToday
                ? currentAssetPrices.get(assetId)
                : historicAssetPrices.get(`${assetId}-${formattedTargetDate}`);

        const currencyPair = `${asset?.assetCurrency === "GBX" ? "GBP" : asset?.assetCurrency}${userCurrency}`;

        let conversionRate = 1;

        if (asset?.assetCurrency === "GBX" && userCurrency === "GBP") {
            conversionRate = 0.01;
        } else if (asset?.assetCurrency !== userCurrency) {
            const filteredRates = currencyRates
                .filter((rate) => rate[0].currencyPair === currencyPair)
                .sort(
                    (a, b) =>
                        new Date(b[0].priceDate).getTime() -
                        new Date(a[0].priceDate).getTime(),
                );

            const latestConversionRate = filteredRates[0]?.[1];
            const historicConversionRate = filteredRates.find(
                (rate) => rate[0].priceDate === formattedTargetDate,
            )?.[1];

            const rate =
                (formattedTargetDate === formattedToday
                    ? latestConversionRate
                    : historicConversionRate) ??
                latestConversionRate ??
                1;

            conversionRate = asset?.assetCurrency === "GBX" ? rate / 100 : rate;
        }

        const amount = quantity * (assetPrice ?? 0);
        totalValue += amount * conversionRate;
    }

    return totalValue;
};
