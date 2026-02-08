import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTopGainers } from "./hooks/useTopGainers";
import { useTopLosers } from "./hooks/useTopLosers";
import { useMostActiveAssets } from "./hooks/useMostActiveAssets";

export type MarketDataTab = "topGainers" | "topLosers" | "mostActive";

export interface MarketDataTabsProps {
    selectedTab: MarketDataTab;
    setSelectedTab: Dispatch<SetStateAction<MarketDataTab>>;
}

const MarketDataTabs = ({
    selectedTab,
    setSelectedTab,
}: MarketDataTabsProps) => {
    //? Fetch the data for the default selected tab when the component loads for the first time
    //? To avoid the "No results found" message appearing in the table
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const { fetchTopGainersList } = useTopGainers();
    const { fetchTopLosersList } = useTopLosers();
    const { fetchMostActiveAssetsList } = useMostActiveAssets();

    useEffect(() => {
        if (isInitialLoad) {
            fetchTopGainersList();
            setIsInitialLoad(false);
        }
    }, [fetchTopGainersList, isInitialLoad]);

    return (
        <div className="mt-4">
            <Tabs
                defaultValue={selectedTab}
                onValueChange={(value) =>
                    setSelectedTab(value as MarketDataTab)
                }
            >
                <TabsList>
                    <TabsTrigger
                        value="topGainers"
                        onClick={() => fetchTopGainersList()}
                    >
                        Top Gainers
                    </TabsTrigger>
                    <TabsTrigger
                        value="topLosers"
                        onClick={() => fetchTopLosersList()}
                    >
                        Top Losers
                    </TabsTrigger>
                    <TabsTrigger
                        value="mostActive"
                        onClick={() => fetchMostActiveAssetsList()}
                    >
                        Most Active
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
};

export default MarketDataTabs;
