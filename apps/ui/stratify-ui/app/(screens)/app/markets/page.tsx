"use client";

import { useState } from "react";
import MarketDataTabs, { MarketDataTab } from "./MarketDataTabs";
import MarketDataTable from "./MarketDataTable/MarketDataTable";

export default function MarketsPage() {
    const [selectedTab, setSelectedTab] = useState<MarketDataTab>("topGainers");

    return (
        <div className="items-center justify-items-center min-h-screen px-10">
            <div className="font-sans text-5xl text-primary-base font-semibold">
                Markets
            </div>

            <MarketDataTabs
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
            />
            <MarketDataTable selectedTab={selectedTab} />
        </div>
    );
}
