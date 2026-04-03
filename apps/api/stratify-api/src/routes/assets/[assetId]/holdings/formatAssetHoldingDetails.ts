import { latestCurrencyConversionRateQuery } from "../../../../utils/latestCurrencyRateQuery.js";
import { toTwoDecimalPoints } from "../../../../utils/toTwoDecimalPoints.js";
import type { AssetHolding } from "./assetHoldingsSchema.js";
import { GroupedAssetInvestment } from "./retrieveAssetHoldings.js";

export const formatAssetHoldingDetails = async (
    investment: GroupedAssetInvestment,
    currentInvestmentValue: number,
    userCurrency: string | null,
) => {
    const {
        assetCurrency,
        shares,
        currentAverageCost,
        currentAverageCostAssetCurrency,
        totalBuyAmount,
        totalBuyAmountAssetCurrency,
        realisedReturn,
    } = investment;

    const isCurrencyConversionRequired =
        assetCurrency && userCurrency !== assetCurrency ? true : false;

    let conversionRate = 1;

    //? If the asset currency is different to the user's currency, then the current value needs to be converted
    if (isCurrencyConversionRequired && assetCurrency && userCurrency) {
        if (assetCurrency === "GBX" && userCurrency === "GBP") {
            conversionRate = 0.01;
        } else {
            const currencyPair = `${assetCurrency === "GBX" ? "GBP" : assetCurrency}${userCurrency}`;
            const { price } =
                await latestCurrencyConversionRateQuery(
                    currencyPair,
                ).executeTakeFirstOrThrow();

            if (price) {
                conversionRate =
                    assetCurrency === "GBX"
                        ? parseFloat(price) * 0.01
                        : parseFloat(price);
            }
        }
    }

    const convertedCurrentInvestmentValue = isCurrencyConversionRequired
        ? currentInvestmentValue * conversionRate
        : currentInvestmentValue;

    const currentReturn =
        convertedCurrentInvestmentValue - currentAverageCost + realisedReturn;

    const currentReturnPercentage =
        totalBuyAmount > 0 ? (currentReturn / totalBuyAmount) * 100 : 0;

    return {
        portfolioId: investment.portfolioId,
        shares,
        totalBuyAmount: toTwoDecimalPoints(totalBuyAmount),
        totalBuyAmountAssetCurrency: totalBuyAmountAssetCurrency
            ? toTwoDecimalPoints(totalBuyAmountAssetCurrency)
            : null,
        averagePricePerShare: toTwoDecimalPoints(currentAverageCost),
        averagePricePerShareAssetCurrency: currentAverageCostAssetCurrency
            ? toTwoDecimalPoints(currentAverageCostAssetCurrency)
            : null,
        currentValue: toTwoDecimalPoints(convertedCurrentInvestmentValue),
        currentValueAssetCurrency: isCurrencyConversionRequired
            ? toTwoDecimalPoints(currentInvestmentValue)
            : null,
        currentReturn: toTwoDecimalPoints(currentReturn),
        currentReturnPercentage: toTwoDecimalPoints(currentReturnPercentage),
    } satisfies AssetHolding;
};
