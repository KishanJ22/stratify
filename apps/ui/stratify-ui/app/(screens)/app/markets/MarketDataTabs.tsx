import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Dispatch, SetStateAction } from "react";

export type MarketDataTab = "topGainers" | "topLosers" | "mostActive";

interface MarketDataTabsProps {
    selectedTab: MarketDataTab;
    setSelectedTab: Dispatch<SetStateAction<MarketDataTab>>;
}

const MarketDataTabs = ({
    selectedTab,
    setSelectedTab,
}: MarketDataTabsProps) => {
    return (
        <div className="mt-4">
            <Tabs
                defaultValue={selectedTab}
                onValueChange={(value) =>
                    setSelectedTab(value as MarketDataTab)
                }
            >
                <TabsList>
                    <TabsTrigger value="topGainers">Top Gainers</TabsTrigger>
                    <TabsTrigger value="topLosers">Top Losers</TabsTrigger>
                    <TabsTrigger value="mostActive">Most Active</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
};

export default MarketDataTabs;
