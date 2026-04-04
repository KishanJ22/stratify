import db from "../../../../database/db.js";
import { getFromStore } from "../../../../plugins/localStorage.js";
import { AssetType } from "../../../../schemas/common-schemas.js";
import { UserDetails } from "../../../../utils/decodeToken.js";
import { latestCurrencyConversionRateQuery } from "../../../../utils/latestCurrencyRateQuery.js";
import { fetchCurrentPrice } from "../../../assets/fetchCurrentPrice.js";
import { portfolioInvestmentsQuery } from "../portfolioInvestmentsQuery.js";
import type { ValueHistory } from "./[portfolioId].value-history.get.js";

const bulkHistoricAssetPriceQuery = (
    assetIds: number[],
    startDate: Date,
    endDate: Date,
) =>
    db
        .selectFrom("stratify.assetPrices as assetPrices")
        .where("assetPrices.assetId", "in", assetIds)
        .where("assetPrices.priceDate", ">=", startDate)
        .where("assetPrices.priceDate", "<=", endDate)
        .select([
            "assetPrices.assetId as assetId",
            "assetPrices.priceDate as priceDate",
            "assetPrices.closePrice as price",
        ]);

const bulkHistoricCurrencyConversionQuery = (
    currencyPairs: string[],
    startDate: Date,
    endDate: Date,
) =>
    db
        .selectFrom("stratify.assetPrices as assetPrices")
        .innerJoin(
            "stratify.assets as assets",
            "assets.id",
            "assetPrices.assetId",
        )
        .where("assets.symbol", "in", currencyPairs)
        .where("assetPrices.priceDate", ">=", startDate)
        .where("assetPrices.priceDate", "<=", endDate)
        .select([
            "assetPrices.assetId as assetId",
            "assets.symbol as currencyPair",
            "assetPrices.priceDate as priceDate",
            "assetPrices.closePrice as price",
        ]);

interface UniqueAsset {
    assetId: number;
    assetSymbol: string;
    assetCountryId: number;
    assetType: AssetType;
    assetCurrency: string | null;
}

export const calculatePortfolioValueHistory = async (portfolioId: number) => {
    const { userId, userCurrency } = getFromStore("user") as UserDetails;

    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];

    const trades = await portfolioInvestmentsQuery(
        portfolioId,
        userId,
    ).execute();

    if (trades.length === 0) {
        return [];
    }

    const uniqueAssetsMap = new Map<number, UniqueAsset>();

    trades.map((trade) => {
        if (!uniqueAssetsMap.has(trade.assetId)) {
            uniqueAssetsMap.set(trade.assetId, {
                assetId: trade.assetId,
                assetSymbol: trade.assetSymbol,
                assetCountryId: trade.assetCountryId,
                assetType: trade.assetType as AssetType,
                assetCurrency: trade.assetCurrency,
            });
        }
    });

    const uniqueAssets = Array.from(uniqueAssetsMap.values());

    const uniqueAssetIds = uniqueAssets.map((asset) => asset.assetId);

    const currencyConversionsRequired = new Set<string>();

    uniqueAssets.forEach(({ assetCurrency }) => {
        if (assetCurrency === "GBX" && userCurrency === "GBP") {
            return;
        }

        const key = `${assetCurrency === "GBX" ? "GBP" : assetCurrency}${userCurrency}`;

        if (assetCurrency) {
            if (
                assetCurrency !== userCurrency &&
                !currencyConversionsRequired.has(key)
            ) {
                currencyConversionsRequired.add(key);
            }
        }
    });

    const currencyPairs = Array.from(currencyConversionsRequired);

    const oldestTradeDate = trades.reduce((oldest, trade) => {
        return trade.tradeDate.getTime() < oldest.getTime()
            ? trade.tradeDate
            : oldest;
    }, new Date());

    const isOldestTradeDateWeekend =
        oldestTradeDate.getDay() === 0 || oldestTradeDate.getDay() === 6;

    if (isOldestTradeDateWeekend) {
        oldestTradeDate.setDate(
            oldestTradeDate.getDate() -
                (oldestTradeDate.getDay() === 0 ? 2 : 1),
        );
    }

    //? Get historic prices for all assets in the portfolio and currency conversion rates
    const historicAssetPrices = await bulkHistoricAssetPriceQuery(
        uniqueAssetIds,
        oldestTradeDate,
        today,
    ).execute();

    const historicCurrencyRates =
        currencyPairs.length > 0
            ? await bulkHistoricCurrencyConversionQuery(
                  currencyPairs,
                  oldestTradeDate,
                  today,
              ).execute()
            : [];

    //? Add the historic asset prices and currency conversion rates to a map so that the prices can be accessed by asset ID and price date
    //? This allows for a much quicker lookup as it avoids having to query the database for each day and each trade in the portfolio
    const assetPriceMap = new Map<string, number>();

    historicAssetPrices.forEach((price) => {
        const key = `${price.assetId}-${price.priceDate.toISOString().split("T")[0]}`;
        assetPriceMap.set(key, parseFloat(price.price));
    });

    const historicCurrencyRatesMap = new Map<string, number>();
    const latestCurrencyRatesMap = new Map<string, number>();

    historicCurrencyRates.forEach((rate) => {
        const key = `${rate.currencyPair}-${
            rate.priceDate.toISOString().split("T")[0]
        }`;
        historicCurrencyRatesMap.set(key, parseFloat(rate.price));
    });

    await Promise.all(
        currencyPairs.map(async (currencyPair) => {
            const { price } =
                await latestCurrencyConversionRateQuery(
                    currencyPair,
                ).executeTakeFirstOrThrow();

            if (price) {
                latestCurrencyRatesMap.set(currencyPair, parseFloat(price));
            }
        }),
    );

    //? Fetch the current prices for all assets in the portfolio and add them to a map similar to the historic prices above
    const currentAssetPricesMap = new Map<number, number>();

    await Promise.all(
        uniqueAssets.map(async (asset) => {
            const currentPrice = await fetchCurrentPrice(
                asset.assetSymbol,
                asset.assetCountryId,
                asset.assetType === "CRYPTOCURRENCY",
            ).then((price) => price?.currentPrice || 0);

            currentAssetPricesMap.set(asset.assetId, currentPrice ?? 0);
        }),
    );

    const valueHistory: ValueHistory[] = [];

    for (
        let date = new Date(oldestTradeDate);
        date <= today;
        date.setDate(date.getDate() + 1)
    ) {
        const formattedDate = date.toISOString().split("T")[0];

        //? If the current date is a weekend, then the conversion rate and/or asset price from Friday should be used as markets are closed on weekends (except for cryptocurrencies)
        const isWeekend =
            new Date(date).getDay() === 0 || new Date(date).getDay() === 6;

        const fridayDate = new Date(
            new Date(date).setDate(
                date.getDate() - (date.getDay() === 0 ? 2 : 1),
            ),
        );

        const formattedFridayDate = fridayDate.toISOString().split("T")[0];

        let totalValue = 0;

        //? Map storing a running quantity for each asset by asset ID up to the current date
        const netAssetQuantity = new Map<number, number>();

        for (const trade of trades) {
            const formattedTradeDate = trade.tradeDate
                .toISOString()
                .split("T")[0];

            //? Skip trades that were made after the current date to avoid making redundant calculations
            if (formattedTradeDate > formattedDate) {
                break;
            }

            const currentQuantity = netAssetQuantity.get(trade.assetId) || 0;
            const tradeQuantity = parseFloat(trade.quantity);

            //? Update the running quantity for the asset based on whether the trade was a buy or sell
            netAssetQuantity.set(
                trade.assetId,
                trade.tradeAction === "BUY"
                    ? currentQuantity + tradeQuantity
                    : currentQuantity - tradeQuantity,
            );
        }

        //? Iterate through map of running quantities for each asset in the portfolio and split the mapping into asset ID and quantity
        for (const [assetId, quantity] of netAssetQuantity) {
            if (quantity === 0) continue;

            const asset = uniqueAssetsMap.get(assetId);

            const fridayPricePerShare = assetPriceMap.get(
                `${assetId}-${formattedFridayDate}`,
            );

            const historicPricePerShare =
                isWeekend && asset?.assetType !== "CRYPTOCURRENCY"
                    ? fridayPricePerShare
                    : assetPriceMap.get(`${assetId}-${formattedDate}`);

            const currentPricePerShare = currentAssetPricesMap.get(assetId);

            const pricePerShare =
                formattedDate === formattedToday
                    ? currentPricePerShare
                    : historicPricePerShare;

            const investmentAmount = quantity * (pricePerShare || 0);

            const assetCurrency =
                asset?.assetCurrency === "GBX"
                    ? "GBP"
                    : (asset?.assetCurrency as string);

            const currencyPair = `${assetCurrency}${userCurrency}`;

            //? If the asset currency is different from the user's currency, then convert the price per share to the user's currency
            if (currencyConversionsRequired.has(currencyPair)) {
                const fridayConversionRate = historicCurrencyRatesMap.get(
                    `${currencyPair}-${formattedFridayDate}`,
                );

                const historicConversionRate = isWeekend
                    ? fridayConversionRate
                    : historicCurrencyRatesMap.get(
                          `${currencyPair}-${formattedDate}`,
                      );

                const latestConversionRate =
                    latestCurrencyRatesMap.get(currencyPair);

                const conversionRate =
                    formattedDate === formattedToday
                        ? latestConversionRate
                        : historicConversionRate;

                if (conversionRate) {
                    const convertedInvestmentAmount =
                        investmentAmount * conversionRate;
                    totalValue +=
                        asset?.assetCurrency === "GBX"
                            ? convertedInvestmentAmount * 0.01
                            : convertedInvestmentAmount;
                } else {
                    if (latestConversionRate) {
                        const convertedAmount =
                            investmentAmount * latestConversionRate;

                        totalValue +=
                            asset?.assetCurrency === "GBX"
                                ? convertedAmount * 0.01
                                : convertedAmount;
                    }
                }
            } else {
                totalValue +=
                    asset?.assetCurrency === "GBX"
                        ? investmentAmount * 0.01
                        : investmentAmount;
            }
        }

        valueHistory.push({
            portfolioValue: parseFloat(totalValue.toFixed(2)),
            date: formattedDate,
        });
    }

    return valueHistory;
};
