import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { useInvestmentsList } from "../InvestmentsTable/useInvestmentsList";
import { InfoIcon } from "lucide-react";
import { useState } from "react";
import GroupBySelector, { GroupByOption } from "./GroupBySelector";
import AssetAllocationChart from "./AssetAllocationChart";

interface AssetAllocationCardProps {
    portfolioId: number | null;
}

const AssetAllocationCard = ({ portfolioId }: AssetAllocationCardProps) => {
    const { data, isLoading } = useInvestmentsList(portfolioId);
    const [groupBy, setGroupBy] = useState<GroupByOption>("assetClass");

    const filteredData = data.filter(
        (investment) => investment.currentValue > 0,
    );

    return (
        <div className="flex flex-col h-full py-2.5 px-3 bg-secondary-lightest border border-primary-dark rounded-xl font-sans">
            <div className="flex flex-row gap-x-1 text-xl font-medium text-primary-darker">
                <div>Asset Allocation</div>
                <Tooltip>
                    <TooltipTrigger>
                        <InfoIcon size={20} className="text-primary-darker" />
                        <TooltipContent
                            className="bg-secondary-lighter text-secondary-dark text-sm font-medium w-52"
                            arrowClassName="bg-secondary-lighter fill-secondary-lighter"
                            side="bottom"
                        >
                            <div className="flex flex-col gap-y-2">
                                <span>
                                    How your investments are distributed across
                                    different asset classes, countries and
                                    sectors to understand how diversified your
                                    portfolio is.
                                </span>
                                <span>
                                    A portfolio with good diversification
                                    typically has investments spread across
                                    multiple asset classes, sectors and
                                    countries, which helps reduce risk.
                                </span>
                            </div>
                        </TooltipContent>
                    </TooltipTrigger>
                </Tooltip>
            </div>
            <GroupBySelector
                groupBy={groupBy}
                setGroupBy={setGroupBy}
                disabled={isLoading || filteredData.length === 0}
            />
            <AssetAllocationChart
                data={filteredData}
                groupBy={groupBy}
                isLoading={isLoading}
            />
        </div>
    );
};

export default AssetAllocationCard;
