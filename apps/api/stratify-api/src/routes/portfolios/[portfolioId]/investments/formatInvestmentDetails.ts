import { latestCurrencyConversionRateQuery } from "../../../../utils/latestCurrencyRateQuery.js";
import type { AssetType } from "../../../../schemas/common-schemas.js";
import type { Investment, SectorDetails } from "./investmentSchema.js";
import type { GroupedInvestment } from "./retrievePortfolioInvestments.js";
import { toTwoDecimalPoints } from "../../../../utils/toTwoDecimalPoints.js";

export const formatInvestmentDetails = async (
    investment: GroupedInvestment,
    currentInvestmentValue: number,
    userCurrency: string | null,
    sectorDetails: SectorDetails[],
    portfolioId: number,
) => {
    const {
        symbol,
        name,
        type,
        assetCurrency,
        countryId,
        shares,
        currentAverageCost,
        totalBuyAmount,
        realisedReturn,
        portfolioName,
    } = investment;

    const isCurrencyConversionRequired =
        assetCurrency && userCurrency !== assetCurrency ? true : false;

    let conversionRate = 1;

    //? If the asset currency is different to the user's currency, then the current value and investment return need to be converted
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
        assetId: investment.assetId,
        symbol,
        assetCountryId: countryId,
        name,
        type: type as AssetType,
        assetCurrency,
        shares,
        totalBuyAmount: toTwoDecimalPoints(totalBuyAmount),
        currentValue: toTwoDecimalPoints(convertedCurrentInvestmentValue),
        currentAssetCurrencyValue: isCurrencyConversionRequired
            ? toTwoDecimalPoints(currentInvestmentValue)
            : null,
        currentReturn: toTwoDecimalPoints(currentReturn),
        currentReturnPercentage: toTwoDecimalPoints(currentReturnPercentage),
        sectorDetails,
        portfolioId,
        portfolioName,
    } satisfies Investment;
};
