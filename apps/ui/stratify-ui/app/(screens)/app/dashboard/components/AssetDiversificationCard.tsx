import { useTranslations } from "next-intl";
import { useState } from "react";
import AssetAllocationChart from "../../portfolios/components/AssetAllocationCard/AssetAllocationChart";
import GroupBySelector, {
	type GroupByOption,
} from "../../portfolios/components/AssetAllocationCard/GroupBySelector";
import type { Investment } from "../../portfolios/components/InvestmentsTable/InvestmentsTable";

interface AssetDiversificationCardProps {
	investments: Investment[];
	isLoading: boolean;
}

const AssetDiversificationCard = ({
	investments,
	isLoading,
}: AssetDiversificationCardProps) => {
	const [groupBy, setGroupBy] = useState<GroupByOption>("assetClass");
	const translate = useTranslations("Dashboard");

	const filteredData = investments?.filter(
		(investment) => investment.currentValue > 0,
	);

	return (
		<div className="flex flex-col h-full py-2.5 px-3 bg-primary-lightest rounded-xl shadow-lg font-sans">
			<div className="flex flex-col text-secondary-dark">
				<div className="text-2xl gap-x-1 leading-8 font-semibold items-center">
					{translate("assetDiversification")}
				</div>
				<div className="font-medium text-sm leading-4">
					{translate("assetDiversificationDescription")}
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
