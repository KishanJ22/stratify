"use client";

import { useState } from "react";
import MarketDataTabs, { MarketDataTab } from "./MarketDataTabs";
import MarketDataTable from "./MarketDataTable/MarketDataTable";
import AssetSearch from "./AssetSearch/AssetSearch";

export default function MarketsPage() {
    const [selectedTab, setSelectedTab] = useState<MarketDataTab>("topGainers");

    return (
        <div className="items-center justify-items-center h-full px-10">
            <div className="font-sans text-5xl text-primary-base font-semibold">
                Markets
            </div>

            <div className="flex items-center justify-between mt-4">
                <MarketDataTabs
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                />
                <AssetSearch />
            </div>
            <MarketDataTable selectedTab={selectedTab} />
        </div>
    );
}
