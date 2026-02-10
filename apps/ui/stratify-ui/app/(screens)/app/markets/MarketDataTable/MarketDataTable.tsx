"use client";

import { paths } from "@/openapi/types/stratify-api";
import { useTopGainers } from "../hooks/useTopGainers";
import { DataTable } from "@/app/components/ui/data-table";
import { columns } from "./marketDataTableColumns";
import { MarketDataTab } from "../MarketDataTabs";
import { useTopLosers } from "../hooks/useTopLosers";
import { useMostActiveAssets } from "../hooks/useMostActiveAssets";
import { useAutoRefetch } from "@/app/utils/auto-refetch";

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
    const {
        data: topGainersData,
        isLoading: isTopGainersLoading,
        fetchTopGainersList,
    } = useTopGainers();

    const {
        data: topLosersData,
        isLoading: isTopLosersLoading,
        fetchTopLosersList,
    } = useTopLosers();

    const {
        data: mostActiveAssetsData,
        isLoading: isMostActiveAssetsLoading,
        fetchMostActiveAssetsList,
    } = useMostActiveAssets();

    const intervalMs = 60 * 1000; // 1 minute

    //? Auto refetch the data for the selected tab every minute to keep data up-to-date
    useAutoRefetch(() => {
        if (selectedTab === "topGainers") {
            fetchTopGainersList();
        }

        if (selectedTab === "topLosers") {
            fetchTopLosersList();
        }

        if (selectedTab === "mostActive") {
            fetchMostActiveAssetsList();
        }
    }, intervalMs);

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
              ? isTopLosersLoading
              : isMostActiveAssetsLoading;

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
