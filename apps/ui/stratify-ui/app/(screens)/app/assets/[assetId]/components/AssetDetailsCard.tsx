import { Skeleton } from "@/app/components/ui/skeleton";
import { AssetDetails } from "../hooks/useAssetDetails";
import AssetBadge, {
    assetTypeMap,
    marketStateMap,
} from "@/app/components/(app)/AssetBadge";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/app/components/ui/button";
import { useTranslations } from "next-intl";

export interface AssetDetailsCardProps {
    asset?: AssetDetails;
    setIsSectorsModalOpen: Dispatch<SetStateAction<boolean>>;
    isLoading: boolean;
}

const AssetDetailsCard = ({
    asset,
    isLoading,
    setIsSectorsModalOpen,
}: AssetDetailsCardProps) => {
    const sectorName = asset?.sector ? asset?.sector?.[0]?.sector : "---";
    const translate = useTranslations();

    return (
        <div className="flex-1 py-2.5 px-3 bg-primary-lightest rounded-xl border border-primary-base font-sans">
            <div className="font-semibold text-2xl leading-6 text-secondary-dark">
                {"Asset Details"}
            </div>
            {isLoading ? (
                <div
                    className="flex flex-col gap-y-1 mt-2"
                    data-testid="loading-skeletons"
                >
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
                            {"Asset type"}
                        </div>
                        {asset?.assetType ? (
                            <AssetBadge
                                {...assetTypeMap[asset?.assetType]}
                                data-testid="asset-type-badge"
                            />
                        ) : null}
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="font-medium text-secondary-base text-lg leading-6">
                            {"Market state"}
                        </div>
                        {asset?.marketState ? (
                            <AssetBadge
                                {...marketStateMap[asset?.marketState]}
                                data-testid="market-state-badge"
                            />
                        ) : null}
                    </div>
                    {asset?.assetType !== "CRYPTOCURRENCY" ? (
                        <div className="flex flex-row justify-between">
                            <div className="font-medium text-secondary-base text-lg leading-6">
                                {"Country"}
                            </div>
                            <div className="font-medium text-secondary-base text-lg leading-6">
                                {asset?.countryId
                                    ? translate(
                                          `countries.${asset.countryId}` as any,
                                      )
                                    : "---"}
                            </div>
                        </div>
                    ) : null}
                    {asset?.assetType !== "CRYPTOCURRENCY" ? (
                        <div className="flex flex-row justify-between">
                            <div className="font-medium text-secondary-base text-lg leading-6">
                                {asset?.assetType === "ETF"
                                    ? "Sectors"
                                    : "Sector"}
                            </div>
                            {asset?.assetType === "ETF" ? (
                                <Button
                                    variant="link"
                                    className="text-secondary-base hover:text-secondary-darker transition-colors text-lg leading-6 p-0"
                                    onClick={() => setIsSectorsModalOpen(true)}
                                    size="sm"
                                    data-testid="view-sectors-button"
                                >
                                    View Sectors
                                </Button>
                            ) : (
                                <div className="font-medium text-secondary-base text-lg leading-6">
                                    {translate(
                                        `Sectors.${sectorName}` as any,
                                    ) ?? "---"}
                                </div>
                            )}
                        </div>
                    ) : null}
                    {asset?.assetType === "STOCK" ? (
                        <div className="flex flex-row justify-between">
                            <div className="font-medium text-secondary-base text-lg leading-6">
                                {"Industry"}
                            </div>
                            <div className="font-medium text-secondary-base text-lg leading-6">
                                {asset?.industry ?? "---"}
                            </div>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default AssetDetailsCard;
