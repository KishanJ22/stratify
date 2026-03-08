import { getFromStore } from "../../../plugins/localStorage.js";
import { AssetType } from "../../../schemas/common-schemas.js";
import { UserDetails } from "../../../utils/decodeToken.js";
import { fetchCurrentPrice } from "../../assets/fetch-current-price.js";
import { formatInvestmentDetails } from "./format-investment-details.js";
import { portfolioInvestmentsQuery } from "./portfolioInvestmentsQuery.js";

export interface GroupedInvestment {
    id: number;
    symbol: string;
    name: string;
    assetCurrency: string | null;
    countryId: number;
    type: AssetType;
    shares: number;
    totalPurchaseValue: number;
}

export const retrieveInvestments = async (portfolioId: number) => {
    const { userId, userCurrency } = getFromStore("user") as UserDetails;

    const trades = await portfolioInvestmentsQuery(
        portfolioId,
        userId,
    ).execute();

    if (trades.length === 0) {
        return [];
    }

    // TODO: Add calculation of realised gains/losses for sold shares, only unrealised returns for currently held shares are calculated
    const groupedInvestmentsMap = trades.reduce((acc, trade) => {
        const key = trade.assetId;

        if (acc.has(key)) {
            return acc;
        }

        const tradesForAsset = trades.filter(
            (t) => t.assetId === trade.assetId,
        );

        //? How many shares of this asset are currently held?
        const currentHoldingQuantity = tradesForAsset.reduce((sum, t) => {
            const quantity = parseFloat(t.quantity);
            return t.tradeAction === "BUY" ? sum + quantity : sum - quantity;
        }, 0);

        //? What is the total cost for the currently held shares of this asset (in the user's currency)?
        const totalPurchaseValue = tradesForAsset.reduce((sum, t) => {
            const tradeAmount = parseFloat(t.totalAmount);

            return t.tradeAction === "BUY"
                ? sum + tradeAmount
                : sum - tradeAmount;
        }, 0);

        //? Only return the asset if the user is holding shares of it. If the quantity currently held is 0, then the investment has been fully sold
        if (currentHoldingQuantity > 0) {
            acc.set(key, {
                id: key,
                shares: currentHoldingQuantity,
                name: trade.assetName,
                type: trade.assetType as AssetType,
                assetCurrency: trade.assetCurrency,
                symbol: trade.assetSymbol,
                countryId: trade.assetCountryId,
                totalPurchaseValue,
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

            //? Format the details of the investment, convert the monetary amounts by currency if needed and return it
            return await formatInvestmentDetails(
                investment,
                currentInvestmentValue,
                userCurrency,
            );
        }),
    );

    //? Sort investments by highest current value first
    return formattedInvestments.sort((a, b) => b.currentValue - a.currentValue);
};
