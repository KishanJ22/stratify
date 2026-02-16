import { AssetType } from "../../../schemas/common-schemas.js";
import { currencyConversionRateQuery } from "../../../utils/currency-conversion-rate-query.js";
import {
    AssetDetails,
    GroupedInvestment,
} from "./[portfolioId].investments.get.js";
import { Investment } from "./investments.schema.js";

export const formatInvestmentDetails = async (
    investment: GroupedInvestment,
    assetDetails: AssetDetails,
    currentInvestmentValue: number,
    userCurrency: string | null,
) => {
    const { name, type, assetCurrency } = assetDetails;
    const { symbol, assetCountryId, shares, totalPurchaseValue } = investment;

    const currentReturn = currentInvestmentValue - totalPurchaseValue;

    const isCurrencyConversionRequired =
        assetCurrency && userCurrency !== assetCurrency ? true : false;

    let conversionRate = 1;

    //? If the asset currency is different to the user's currency, then the current value and investment return need to be converted
    if (isCurrencyConversionRequired && assetCurrency && userCurrency) {
        const { price } = await currencyConversionRateQuery(
            assetCurrency,
            userCurrency,
            new Date(),
        ).executeTakeFirstOrThrow();

        conversionRate = parseFloat(price);
    }

    const currentReturnPercentage =
        totalPurchaseValue > 0
            ? parseFloat(
                  ((currentReturn / totalPurchaseValue) * 100).toFixed(2),
              )
            : 0;

    return {
        symbol,
        assetCountryId,
        name,
        type: type as AssetType,
        assetCurrency,
        shares,
        currentValue: isCurrencyConversionRequired
            ? parseFloat((currentInvestmentValue * conversionRate).toFixed(2))
            : parseFloat(currentInvestmentValue.toFixed(2)),
        currentAssetCurrencyValue: isCurrencyConversionRequired
            ? parseFloat(currentInvestmentValue.toFixed(2))
            : null,
        currentReturn: isCurrencyConversionRequired
            ? parseFloat((currentReturn * conversionRate).toFixed(2))
            : parseFloat(currentReturn.toFixed(2)),
        currentReturnPercentage,
    } satisfies Investment;
};
