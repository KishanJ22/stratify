"use client";

import { paths } from "@/openapi/types/stratify-api";
import { useTopGainers } from "../hooks/useTopGainers";
import { DataTable } from "@/app/components/ui/data-table";
import { columns } from "./marketDataTableColumns";
import { MarketDataTab } from "../MarketDataTabs";
import { useTopLosers } from "../hooks/useTopLosers";
import { useMostActiveAssets } from "../hooks/useMostActiveAssets";

export type AssetType =
    paths["/data/market/top-gainers"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number]["assetType"];
export type MarketState =
    paths["/data/market/top-gainers"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number]["marketState"];

export interface Asset {
    name: string;
    symbol: string;
    assetType: AssetType;
    marketState: MarketState;
    currentPrice: number | null;
    currency: string | null;
    volume: number | null;
    priceChange: number | null;
    priceChangePercentage: number | null;
}

interface MarketDataTableProps {
    selectedTab: MarketDataTab;
}

const MarketDataTable = ({ selectedTab }: MarketDataTableProps) => {
    const { data: topGainersData, isLoading: isTopGainersLoading } =
        useTopGainers(selectedTab === "topGainers");

    const { data: topLosersData, isLoading: isLoadingLosers } = useTopLosers(
        selectedTab === "topLosers",
    );

    const { data: mostActiveAssetsData, isLoading: isLoadingMostActiveAssets } =
        useMostActiveAssets(selectedTab === "mostActive");

    const data =
        selectedTab === "topGainers"
            ? topGainersData
            : selectedTab === "topLosers"
              ? topLosersData
              : mostActiveAssetsData;

    const isLoading =
        selectedTab === "topGainers"
            ? isTopGainersLoading
            : selectedTab === "topLosers"
              ? isLoadingLosers
              : isLoadingMostActiveAssets;

    const assets = data.reduce((acc, asset) => {
        acc.push({
            name: asset.name,
            symbol: asset.symbol,
            assetType: asset.assetType,
            marketState: asset.marketState,
            currency: asset.currency,
            currentPrice: asset.priceDetails.currentPrice,
            volume: asset.priceDetails.volume,
            priceChange: asset.priceDetails.priceChange,
            priceChangePercentage: asset.priceDetails.priceChangePercent,
        });

        return acc;
    }, [] as Asset[]);

    return (
        <div className="mt-7">
            <DataTable columns={columns} data={assets} isLoading={isLoading} />
        </div>
    );
};

export default MarketDataTable;
