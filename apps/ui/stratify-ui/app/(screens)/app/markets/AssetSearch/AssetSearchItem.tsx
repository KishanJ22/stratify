import { cn } from "@/lib/utils";
import { ChartColumnIncreasing, ChartColumnDecreasing } from "lucide-react";
import { SearchAsset } from "./useAssetSearch";
import AssetBadge, { assetTypeMap } from "@/app/components/(app)/AssetBadge";
import Link from "next/link";

export interface AssetSearchItemProps {
    asset: SearchAsset;
}

const AssetSearchItem = ({ asset }: AssetSearchItemProps) => {
    return (
        <Link
            href={`/app/assets/${asset.id}`}
            className="w-full flex flex-row justify-between p-1.5 font-sans transition-colors rounded-lg hover:bg-primary-lighter/70 hover:cursor-pointer"
        >
            <div className="flex flex-col items-start gap-1">
                <span className="text-base font-semibold text-primary-dark">
                    {asset.name}
                </span>
                <span className="text-sm text-muted-dark">{asset.symbol}</span>
                <AssetBadge {...assetTypeMap[asset.assetType]} />
            </div>
            <div className="flex flex-col items-end gap-1">
                {asset.currentPrice ? (
                    <div className="flex flex-row text-base font-semibold text-primary-base gap-x-0.5">
                        {asset.currentPrice.toFixed(2).toLocaleString()}
                        <span className="text-xs text-primary-base content-center">
                            {asset?.currency ? `(${asset.currency})` : ""}
                        </span>
                    </div>
                ) : null}

                {asset.priceChangePercent ? (
                    <div
                        className={cn(
                            "flex flex-row gap-1 text-sm items-center",
                            asset.priceChangePercent > 0
                                ? "text-positive-base"
                                : "text-negative-base",
                        )}
                    >
                        {asset.priceChangePercent > 0 ? (
                            <ChartColumnIncreasing size={16} />
                        ) : (
                            <ChartColumnDecreasing size={16} />
                        )}
                        {asset.priceChangePercent.toFixed(2)}%
                    </div>
                ) : null}
            </div>
        </Link>
    );
};

export default AssetSearchItem;
