import { DataTable } from "@/app/components/ui/data-table";
import { AssetType } from "../../../markets/MarketDataTable/MarketDataTable";
import { useSessionContext } from "../../../SessionProvider";
import { columns } from "./topInvestmentsTableColumns";
import { Investment } from "../../../portfolios/components/InvestmentsTable/InvestmentsTable";
import { TopPerformersCardProps } from "./TopPerformersCard";

const noInvestmentsData = (label: string) =>
    Array.from({ length: 5 }, () => ({
        assetId: 0,
        symbol: "",
        assetCountryId: 0,
        assetCurrency: null,
        name: label,
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
    isPortfoliosNotFoundError,
    isInvestmentsNotFoundError,
}: TopPerformersCardProps) => {
    const investmentsWithPositiveReturn = investments
        .filter((investment) => investment.currentReturn > 0)
        .slice(0, 5);

    const hasNoPositiveReturns = investmentsWithPositiveReturn.length === 0;

    const { session } = useSessionContext();
    const userCurrency = session?.userDetails.currency as string;

    const data = isPortfoliosNotFoundError
        ? noInvestmentsData("No portfolios found")
        : isInvestmentsNotFoundError
          ? noInvestmentsData("No investments found")
          : hasNoPositiveReturns
            ? noInvestmentsData("No top performers found")
            : investmentsWithPositiveReturn;

    const isNotFoundError =
        isPortfoliosNotFoundError ||
        isInvestmentsNotFoundError ||
        hasNoPositiveReturns;

    return (
        <DataTable
            columns={columns(userCurrency, isNotFoundError)}
            data={data}
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
