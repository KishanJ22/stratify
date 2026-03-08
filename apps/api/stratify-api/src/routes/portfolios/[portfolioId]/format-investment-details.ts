import { AssetType } from "../../../schemas/common-schemas.js";
import { latestCurrencyConversionRateQuery } from "../../../utils/latestCurrencyRateQuery.js";
import type { Investment } from "./investments.schema.js";
import { GroupedInvestment } from "./retrievePortfolioInvestments.js";

export const formatInvestmentDetails = async (
    investment: GroupedInvestment,
    currentInvestmentValue: number,
    userCurrency: string | null,
) => {
    const {
        symbol,
        name,
        type,
        assetCurrency,
        countryId,
        shares,
        totalPurchaseValue,
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

    const currentReturn = convertedCurrentInvestmentValue - totalPurchaseValue;

    const currentReturnPercentage =
        totalPurchaseValue > 0
            ? parseFloat(
                  ((currentReturn / totalPurchaseValue) * 100).toFixed(2),
              )
            : 0;

    return {
        assetId: investment.id,
        symbol,
        assetCountryId: countryId,
        name,
        type: type as AssetType,
        assetCurrency,
        shares,
        totalPurchaseValue: parseFloat(totalPurchaseValue.toFixed(2)),
        currentValue: parseFloat(convertedCurrentInvestmentValue.toFixed(2)),
        currentAssetCurrencyValue: isCurrencyConversionRequired
            ? parseFloat(currentInvestmentValue.toFixed(2))
            : null,
        currentReturn: parseFloat(currentReturn.toFixed(2)),
        currentReturnPercentage,
    } satisfies Investment;
};
