import { Skeleton } from "@/app/components/ui/skeleton";
import { AssetDetails } from "../hooks/useAssetDetails";
import { cn } from "@/lib/utils";
import {
    ChartColumn,
    ChartColumnDecreasing,
    ChartColumnIncreasing,
} from "lucide-react";

interface AssetActivityCardProps {
    asset?: AssetDetails;
    isLoading: boolean;
}

const AssetActivityCard = ({ asset, isLoading }: AssetActivityCardProps) => {
    const priceChangeSign =
        asset?.dayTradingActivity.priceChangePercent &&
        asset.dayTradingActivity.priceChangePercent > 0
            ? "+"
            : "";

    return (
        <div className="flex-1 py-2.5 px-3 bg-primary-lightest rounded-xl border border-primary-base font-sans">
            <div className="font-semibold text-2xl leading-6 text-secondary-dark">
                {"Asset Activity (last 24 hours)"}
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
                </div>
            ) : (
                <div className="flex flex-col gap-y-1 mt-2">
                    <div className="flex flex-row justify-between">
                        <div className="font-medium text-secondary-base text-lg leading-6">
                            {"Open"}
                        </div>
                        <div className="font-medium text-secondary-base text-lg leading-6">
                            {`${asset?.dayTradingActivity.open?.toLocaleString()} (${asset?.currency})`}
                        </div>
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="font-medium text-secondary-base text-lg leading-6">
                            {"Close"}
                        </div>
                        <div className="font-medium text-secondary-base text-lg leading-6">
                            {`${asset?.dayTradingActivity.close?.toLocaleString()} (${asset?.currency})`}
                        </div>
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="font-medium text-secondary-base text-lg leading-6">
                            {"High"}
                        </div>
                        <div className="font-medium text-secondary-base text-lg leading-6">
                            {`${asset?.dayTradingActivity.high?.toLocaleString()} (${asset?.currency})`}
                        </div>
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="font-medium text-secondary-base text-lg leading-6">
                            {"Low"}
                        </div>
                        <div className="font-medium text-secondary-base text-lg leading-6">
                            {`${asset?.dayTradingActivity.low?.toLocaleString()} (${asset?.currency})`}
                        </div>
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="font-medium text-secondary-base text-lg leading-6">
                            {"Change"}
                        </div>
                        {asset?.dayTradingActivity?.priceChangePercent ? (
                            <div
                                className={cn(
                                    "flex flex-row gap-x-1 font-medium text-lg leading-6",
                                    asset.dayTradingActivity
                                        .priceChangePercent > 0 &&
                                        "text-positive-base",
                                    asset.dayTradingActivity
                                        .priceChangePercent < 0 &&
                                        "text-negative-base",
                                    asset.dayTradingActivity
                                        .priceChangePercent === 0 &&
                                        "text-secondary-base",
                                )}
                            >
                                {asset.dayTradingActivity.priceChangePercent >
                                0 ? (
                                    <ChartColumnIncreasing />
                                ) : null}

                                {asset.dayTradingActivity.priceChangePercent <
                                0 ? (
                                    <ChartColumnDecreasing />
                                ) : null}

                                {asset.dayTradingActivity.priceChangePercent ===
                                0 ? (
                                    <ChartColumn />
                                ) : null}

                                <span>
                                    {priceChangeSign +
                                        asset?.dayTradingActivity.priceChangePercent.toLocaleString() +
                                        "%"}
                                </span>
                            </div>
                        ) : (
                            <div className="font-medium text-secondary-base text-lg leading-6">
                                {"---"}
                            </div>
                        )}
                    </div>
                    <div className="border-t border-t-secondary-light my-0.5" />
                    <div className="flex flex-row justify-between">
                        <div className="font-medium text-secondary-base text-lg leading-6">
                            {"Trading volume"}
                        </div>
                        <div className="font-medium text-secondary-base text-lg leading-6">
                            {asset?.dayTradingActivity.tradingVolume?.toLocaleString()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssetActivityCard;
