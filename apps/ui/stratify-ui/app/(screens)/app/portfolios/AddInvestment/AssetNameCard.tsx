"use client";

import AssetBadge, { assetTypeMap } from "@/app/components/(app)/AssetBadge";
import { SearchAsset } from "../../markets/AssetSearch/useAssetSearch";

interface AssetNameCardProps {
    asset: SearchAsset;
    onSelect: () => void;
}

const AssetNameCard = ({ asset, onSelect }: AssetNameCardProps) => {
    return (
        <div
            className="w-full flex flex-row justify-between items-center py-1.5 px-2 font-sans transition-colors rounded-md hover:bg-secondary-lighter text-secondary-darker hover:cursor-pointer"
            onClick={() => onSelect()}
        >
            {asset.name} ({asset.symbol})
            <AssetBadge {...assetTypeMap[asset.assetType]} />
        </div>
    );
};

export default AssetNameCard;
