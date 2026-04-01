import { getFromStore } from "../../../../plugins/localStorage.js";
import { AssetType } from "../../../../schemas/common-schemas.js";
import { UserDetails } from "../../../../utils/decodeToken.js";
import { fetchCurrentPrice } from "../../../assets/fetch-current-price.js";
import { formatInvestmentDetails } from "./formatInvestmentDetails.js";
import { portfolioInvestmentsQuery } from "../portfolioInvestmentsQuery.js";
import { fetchStockDetails } from "../../../assets/[assetId]/details/yahoo-asset-details/fetchStockDetails.js";
import { fetchFundDetails } from "../../../assets/[assetId]/details/yahoo-asset-details/fetchFundDetails.js";

export interface GroupedInvestment {
    id: number;
    symbol: string;
    name: string;
    assetCurrency: string | null;
    countryId: number;
    type: AssetType;
    shares: number;
    currentAverageCost: number;
    totalBuyAmount: number;
    realisedReturn: number;
    portfolioName: string;
}

const retrieveSectorDetails = async (
    symbol: string,
    countryId: number,
    type: AssetType,
) => {
    if (type === "CRYPTOCURRENCY") {
        return [
            {
                sector: "cryptocurrency",
                weight: 1,
            },
        ];
    } else if (type === "STOCK") {
        const stockDetails = await fetchStockDetails(symbol, countryId);

        if (stockDetails?.industryDetails.sector) {
            return [
                {
                    sector: stockDetails.industryDetails.sector,
                    weight: 1,
                },
            ];
        }
    } else {
        const fundDetails = await fetchFundDetails(symbol, countryId);

        if (fundDetails?.sectorWeights) {
            return fundDetails.sectorWeights;
        }
    }

    return [];
};

export const retrieveInvestments = async (portfolioId: number) => {
    const { userId, userCurrency } = getFromStore("user") as UserDetails;

    const trades = await portfolioInvestmentsQuery(
        portfolioId,
        userId,
    ).execute();

    if (trades.length === 0) {
        return [];
    }

    const groupedInvestmentsMap = trades.reduce((acc, trade) => {
        const key = trade.assetId;

        if (acc.has(key)) {
            return acc;
        }

        const tradesForAsset = trades.filter(
            (t) => t.assetId === trade.assetId,
        );

        const {
            currentHoldingQuantity,
            totalBuyQuantity,
            totalBuyAmount,
            totalSellQuantity,
            totalSellAmount,
        } = tradesForAsset.reduce(
            (sum, t) => {
                const quantity = parseFloat(t.quantity);
                const totalAmount = parseFloat(t.totalAmount);

                return {
                    currentHoldingQuantity:
                        sum.currentHoldingQuantity +
                        (t.tradeAction === "BUY" ? quantity : -quantity),
                    totalBuyQuantity:
                        sum.totalBuyQuantity +
                        (t.tradeAction === "BUY" ? quantity : 0),
                    totalBuyAmount:
                        sum.totalBuyAmount +
                        (t.tradeAction === "BUY" ? totalAmount : 0),
                    totalSellQuantity:
                        sum.totalSellQuantity +
                        (t.tradeAction === "SELL" ? quantity : 0),
                    totalSellAmount:
                        sum.totalSellAmount +
                        (t.tradeAction === "SELL" ? totalAmount : 0),
                };
            },
            {
                currentHoldingQuantity: 0,
                totalBuyQuantity: 0,
                totalBuyAmount: 0,
                totalSellQuantity: 0,
                totalSellAmount: 0,
            },
        );

        const averageCost =
            totalBuyQuantity > 0 ? totalBuyAmount / totalBuyQuantity : 0;

        const currentAverageCost = averageCost * currentHoldingQuantity;

        const realisedReturn =
            totalSellAmount - averageCost * totalSellQuantity;

        if (currentHoldingQuantity > 0 || realisedReturn !== 0) {
            acc.set(key, {
                id: key,
                shares: currentHoldingQuantity,
                name: trade.assetName,
                type: trade.assetType as AssetType,
                assetCurrency: trade.assetCurrency,
                symbol: trade.assetSymbol,
                countryId: trade.assetCountryId,
                currentAverageCost,
                totalBuyAmount: parseFloat(totalBuyAmount.toFixed(2)),
                realisedReturn: parseFloat(realisedReturn.toFixed(2)),
                portfolioName: trade.portfolioName,
            });
        }

        return acc;
    }, new Map<number, GroupedInvestment>());

    const groupedInvestments = Array.from(groupedInvestmentsMap.values());

    const formattedInvestments = await Promise.all(
        groupedInvestments.map(async (investment) => {
            const { symbol, countryId, type } = investment;

            //? Get the current value of the asset and multiply it by the number of shares held to get the overall investment value
            //? The current price of the asset is in the asset's currency so it needs to be converted to the user's currency if they are different
            const currentInvestmentValue = await fetchCurrentPrice(
                symbol,
                countryId,
                type === "CRYPTOCURRENCY",
            ).then((priceDetails) => {
                const price = priceDetails?.currentPrice ?? 0;
                return price * investment.shares;
            });

            const sectorDetails = await retrieveSectorDetails(
                symbol,
                countryId,
                type,
            );

            //? Format the details of the investment, convert the monetary amounts by currency if needed and return it
            return await formatInvestmentDetails(
                investment,
                currentInvestmentValue,
                userCurrency,
                sectorDetails,
                portfolioId,
            );
        }),
    );

    //? Sort investments by highest current value first
    return formattedInvestments.sort((a, b) => b.currentValue - a.currentValue);
};
