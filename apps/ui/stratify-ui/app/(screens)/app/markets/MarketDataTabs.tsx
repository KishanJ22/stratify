import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Dispatch, SetStateAction } from "react";

interface MarketDataTabsProps {
    selectedTab: string;
    setSelectedTab: Dispatch<SetStateAction<string>>;
}

const MarketDataTabs = ({
    selectedTab,
    setSelectedTab,
}: MarketDataTabsProps) => {
    return (
        <div className="mt-4">
            <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
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
