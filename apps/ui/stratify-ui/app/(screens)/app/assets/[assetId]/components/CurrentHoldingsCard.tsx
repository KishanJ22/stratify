import { Skeleton } from "@/app/components/ui/skeleton";
import type { AssetHolding } from "../hooks/useAssetHoldings";
import { useSessionContext } from "../../../SessionProvider";
import { cn } from "@/lib/utils";
import { formatNumericValue } from "@/app/utils/formatNumericValue";

interface CurrentHoldingsCardProps {
    assetHoldings: AssetHolding[];
    assetCurrency: string;
    isLoading: boolean;
}

const CurrentHoldingsCard = ({
    assetHoldings,
    assetCurrency,
    isLoading,
}: CurrentHoldingsCardProps) => {
    const { session } = useSessionContext();
    const userCurrency = session?.userDetails.currency || "---";

    const {
        portfoliosHeldIn,
        amountBought,
        amountBoughtAssetCurrency,
        sharesHeld,
        averagePricePerShare,
        averagePricePerShareAssetCurrency,
        currentValue,
        currentValueAssetCurrency,
        overallReturn,
    } = assetHoldings.reduce(
        (acc, holding) => {
            acc.portfoliosHeldIn += 1;
            acc.amountBought += holding.totalBuyAmount;
            acc.amountBoughtAssetCurrency +=
                holding.totalBuyAmountAssetCurrency || 0;
            acc.sharesHeld += holding.shares;
            acc.averagePricePerShare += holding.averagePricePerShare;
            acc.averagePricePerShareAssetCurrency +=
                holding.averagePricePerShareAssetCurrency || 0;
            acc.currentValue += holding.currentValue;
            acc.currentValueAssetCurrency +=
                holding.currentValueAssetCurrency || 0;
            acc.overallReturn += holding.currentReturn;

            return acc;
        },
        {
            portfoliosHeldIn: 0,
            amountBought: 0,
            amountBoughtAssetCurrency: 0,
            sharesHeld: 0,
            averagePricePerShare: 0,
            averagePricePerShareAssetCurrency: 0,
            currentValue: 0,
            currentValueAssetCurrency: 0,
            overallReturn: 0,
        },
    );

    const overallReturnPercent =
        amountBought > 0 ? (overallReturn / amountBought) * 100 : 0;
    const overallReturnSign = overallReturn > 0 ? "+" : "";

    return (
        <div className="py-2.5 px-3 bg-primary-lightest rounded-xl border border-primary-base font-sans">
            <div className="font-semibold text-2xl leading-6 text-secondary-dark">
                {"Current holdings"}
            </div>
            {isLoading ? (
                <div className="flex flex-col gap-y-1 mt-2">
                    <div className="flex flex-row justify-between">
                        <Skeleton className="h-4 w-25" />
                        <Skeleton className="h-4 w-25" />
                    </div>
                    <div className="flex flex-row justify-between">
                        <Skeleton className="h-4 w-25" />
                        <Skeleton className="h-4 w-25" />
                    </div>
                    <div className="flex flex-row justify-between">
                        <Skeleton className="h-4 w-25" />
                        <Skeleton className="h-4 w-25" />
                    </div>
                    <div className="flex flex-row justify-between">
                        <Skeleton className="h-4 w-25" />
                        <Skeleton className="h-4 w-25" />
                    </div>
                    <div className="border-t border-t-secondary-light my-1" />
                    <div className="flex flex-row justify-between">
                        <Skeleton className="h-4 w-25" />
                        <Skeleton className="h-4 w-25" />
                    </div>
                    <div className="flex flex-row justify-between">
                        <Skeleton className="h-4 w-25" />
                        <Skeleton className="h-4 w-25" />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-y-2 mt-2">
                    <div className="flex flex-row justify-between">
                        <div className="font-medium text-secondary-base text-lg leading-6">
                            {"Portfolios held in"}
                        </div>
                        <div className="font-medium text-secondary-base text-lg leading-6">
                            {portfoliosHeldIn}
                        </div>
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="font-medium text-secondary-base text-lg leading-6">
                            {"Amount bought"}
                        </div>
                        <div className="flex flex-col font-medium text-right">
                            <div className="text-secondary-base text-lg leading-6">
                                {formatNumericValue(amountBought, userCurrency)}
                            </div>
                            {assetCurrency !== userCurrency &&
                            amountBoughtAssetCurrency > 0 ? (
                                <div className="text-secondary-light text-sm leading-5">
                                    {formatNumericValue(
                                        amountBoughtAssetCurrency,
                                        assetCurrency,
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="font-medium text-secondary-base text-lg leading-6">
                            {"Shares held"}
                        </div>
                        <div className="font-medium text-secondary-base text-lg leading-6 text-right">
                            {sharesHeld}
                        </div>
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="font-medium text-secondary-base text-lg leading-6">
                            {"Average price per share"}
                        </div>
                        <div className="flex flex-col font-medium text-right">
                            <div className="text-secondary-base text-lg leading-6">
                                {formatNumericValue(
                                    averagePricePerShare,
                                    userCurrency,
                                )}
                            </div>
                            {assetCurrency !== userCurrency &&
                            averagePricePerShareAssetCurrency > 0 ? (
                                <div className="text-secondary-light text-sm leading-5">
                                    {formatNumericValue(
                                        averagePricePerShareAssetCurrency,
                                        assetCurrency,
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="border-t border-t-secondary-light my-1" />
                    <div className="flex flex-row justify-between">
                        <div className="font-medium text-secondary-base text-lg leading-6">
                            {"Current value"}
                        </div>
                        <div className="flex flex-col font-medium text-right">
                            <div className="text-secondary-base text-lg leading-6">
                                {formatNumericValue(currentValue, userCurrency)}
                            </div>
                            {assetCurrency !== userCurrency &&
                            currentValueAssetCurrency > 0 ? (
                                <div className="text-secondary-light text-sm leading-5">
                                    {formatNumericValue(
                                        currentValueAssetCurrency,
                                        assetCurrency,
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="font-medium text-secondary-base text-lg leading-6">
                            {"Overall return"}
                        </div>
                        <div className="flex flex-col font-medium text-right">
                            <div
                                className={cn(
                                    "text-secondary-base text-lg leading-6",
                                    overallReturn > 0 && "text-positive-base",
                                    overallReturn < 0 && "text-negative-base",
                                    overallReturn === 0 &&
                                        "text-secondary-base",
                                )}
                            >
                                {overallReturnSign}
                                {formatNumericValue(
                                    overallReturn,
                                    userCurrency,
                                )}
                            </div>
                            <div
                                className={cn(
                                    "font-medium text-secondary-base text-sm leading-5",
                                    overallReturn > 0 && "text-positive-base",
                                    overallReturn < 0 && "text-negative-base",
                                    overallReturn === 0 &&
                                        "text-secondary-base",
                                )}
                            >
                                {overallReturnSign}
                                {overallReturnPercent.toFixed(2)}%
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrentHoldingsCard;
