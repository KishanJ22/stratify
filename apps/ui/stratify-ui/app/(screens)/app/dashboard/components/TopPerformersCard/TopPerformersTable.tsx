import { DataTable } from "@/app/components/ui/data-table";
import { AssetType } from "../../../markets/MarketDataTable/MarketDataTable";
import { useSessionContext } from "../../../SessionProvider";
import { columns } from "./topInvestmentsTableColumns";
import { Investment } from "../../../portfolios/components/InvestmentsTable/InvestmentsTable";
import { TopPerformersCardProps } from "./TopPerformersCard";

const noInvestmentsData = Array.from({ length: 5 }, () => ({
    assetId: 0,
    symbol: "",
    assetCountryId: 0,
    assetCurrency: null,
    name: "No investments found",
    type: "" as AssetType,
    shares: 0,
    currentValue: 0,
    currentReturn: 0,
    currentAssetCurrencyValue: null,
    currentReturnPercentage: 0,
})) as Investment[];

const TopPerformersTable = ({
    investments,
    isLoading,
}: TopPerformersCardProps) => {
    const filteredInvestments =
        investments?.filter((investment) => investment.currentReturn > 0) ?? [];

    const { session } = useSessionContext();
    const userCurrency = session?.userDetails.currency as string;

    return (
        <DataTable
            columns={columns(userCurrency)}
            data={
                filteredInvestments.length > 0
                    ? filteredInvestments
                    : noInvestmentsData
            }
            isLoading={isLoading}
            isPaginationEnabled={false}
            className="border-secondary-dark"
            headerClassName="bg-secondary-lightest border-secondary-light"
            rowClassName="border-secondary-light xl:h-16"
            loadingSkeletonClassName="h-16"
        />
    );
};

export default TopPerformersTable;
