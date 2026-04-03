"use client";

import { useParams } from "next/navigation";
import { useAssetDetails } from "./hooks/useAssetDetails";
import { Skeleton } from "@/app/components/ui/skeleton";
import AssetPriceHistoryChart from "./components/AssetPriceHistoryChart";
import AssetDetailsCard from "./components/AssetDetailsCard";
import AssetActivityCard from "./components/AssetActivityCard";
import { useState } from "react";
import FundSectorsModal from "./components/FundSectorsModal";

export default function AssetPage() {
    const { assetId } = useParams<{ assetId: string }>();

    const { data: assetDetails, isLoading: isAssetDetailsLoading } =
        useAssetDetails(parseInt(assetId));

    const [isSectorsModalOpen, setIsSectorsModalOpen] = useState(false);

    return (
        <div className="items-center justify-items-center min-h-screen px-10 font-sans">
            {isAssetDetailsLoading ? (
                <div className="flex flex-col gap-y-1">
                    <Skeleton className="w-80 h-8" />
                    <Skeleton className="w-60 h-6" />
                </div>
            ) : (
                <div className="flex flex-col gap-y-1">
                    <div className="text-4xl leading-10 text-primary-base font-semibold">
                        {assetDetails?.name}
                    </div>
                    <div className="text-2xl leading-9 text-primary-dark font-medium">
                        {assetDetails?.symbol}
                    </div>
                </div>
            )}
            <div className="mt-5">
                <AssetPriceHistoryChart
                    assetId={parseInt(assetId)}
                    assetCurrency={assetDetails?.currency ?? ""}
                    isAssetDetailsLoading={isAssetDetailsLoading}
                />
                <div className="flex flex-row mt-5 w-full gap-x-5">
                    <AssetDetailsCard
                        asset={assetDetails}
                        isLoading={isAssetDetailsLoading}
                        setIsSectorsModalOpen={setIsSectorsModalOpen}
                    />
                    <AssetActivityCard
                        asset={assetDetails}
                        isLoading={isAssetDetailsLoading}
                    />
                    <FundSectorsModal
                        sectors={assetDetails?.sector ?? []}
                        isOpen={isSectorsModalOpen}
                        handleClose={() => setIsSectorsModalOpen(false)}
                    />
                </div>
            </div>
        </div>
    );
}
