import { useState } from "react";
import { Investment } from "../../portfolios/components/InvestmentsTable/InvestmentsTable";
import GroupBySelector, {
    GroupByOption,
} from "../../portfolios/components/AssetAllocationCard/GroupBySelector";
import AssetAllocationChart from "../../portfolios/components/AssetAllocationCard/AssetAllocationChart";

interface AssetDiversificationCardProps {
    investments?: Investment[];
    isLoading: boolean;
}

const AssetDiversificationCard = ({
    investments,
    isLoading,
}: AssetDiversificationCardProps) => {
    const [groupBy, setGroupBy] = useState<GroupByOption>("assetClass");

    const filteredData = investments?.filter(
        (investment) => investment.currentValue > 0,
    );

    return (
        <div className="flex flex-col h-full py-2.5 px-3 bg-primary-lightest rounded-xl shadow-lg font-sans">
            <div className="flex flex-col text-secondary-dark">
                <div className="text-2xl gap-x-1 leading-8 font-semibold items-center">
                    Asset diversification
                </div>
                <div className="font-medium text-sm leading-4">
                    See how diverse your holdings are based on the class, market
                    sector or country of each asset.
                </div>
            </div>
            <GroupBySelector
                groupBy={groupBy}
                setGroupBy={setGroupBy}
                disabled={
                    isLoading || !filteredData || filteredData.length === 0
                }
            />
            <AssetAllocationChart
                data={filteredData}
                groupBy={groupBy}
                isLoading={isLoading}
            />
        </div>
    );
};

export default AssetDiversificationCard;
