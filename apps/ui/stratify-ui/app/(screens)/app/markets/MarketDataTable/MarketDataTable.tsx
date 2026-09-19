"use client";

import { DataTable } from "@/app/components/ui/data-table";
import { useAutoRefetch } from "@/app/utils/auto-refetch";
import type { paths } from "@/openapi/types/stratify-api";
import { useMostActiveAssets } from "../hooks/useMostActiveAssets";
import { useTopGainers } from "../hooks/useTopGainers";
import { useTopLosers } from "../hooks/useTopLosers";
import type { MarketDataTab } from "../MarketDataTabs/MarketDataTabs";
import { columns } from "./marketDataTableColumns";

export type AssetType =
	paths["/data/market/top-gainers"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number]["assetType"];
export type MarketState =
	paths["/data/market/top-gainers"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number]["marketState"];

export type TopAsset =
	paths["/data/market/top-gainers"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number];

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

	return (
		<div className="mt-7">
			<DataTable
				columns={columns}
				data={data}
				isLoading={isLoading}
				key={selectedTab}
				initialPaginationState={{
					pageIndex: 0,
					pageSize: 10,
				}}
				isLoadingRowCount={10}
			/>
		</div>
	);
};

export default MarketDataTable;
