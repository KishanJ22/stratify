import { paths } from "@/openapi/types/stratify-api";
import useInvestmentsList from "./useInvestmentsList";
import { useAutoRefetch } from "@/app/utils/auto-refetch";
import { DataTable } from "@/app/components/ui/data-table";
import { columns } from "./investmentsTableColumns";
import { AssetType } from "../../markets/MarketDataTable/MarketDataTable";
import { Pagination } from "@/app/components/ui/pagination";

export type Investment =
    paths["/portfolios/{portfolioId}/investments"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number];

interface InvestmentsTableProps {
    portfolioId: number | null;
}

const noPortfolioSelectedData: Investment[] = Array.from({ length: 5 }, () => ({
    symbol: "",
    assetCountryId: 0,
    assetCurrency: null,
    name: "No portfolio selected",
    type: "" as AssetType,
    shares: 0,
    currentValue: 0,
    currentReturn: 0,
    currentAssetCurrencyValue: null,
    currentReturnPercentage: 0,
}));

const NoInvestmentsComponent = () => (
    <div className="flex h-24 items-center justify-center text-sm text-primary-dark">
        No investments found for this portfolio.
    </div>
);

const InvestmentsTable = ({ portfolioId }: InvestmentsTableProps) => {
    const { data, isLoading, refetch } = useInvestmentsList(portfolioId);

    const intervalMs = 60 * 1000; // 1 minute

    useAutoRefetch(() => refetch(), intervalMs);

    const isPortfolioSelected = portfolioId !== null;

    return (
        <div className="mt-2">
            <DataTable
                columns={columns}
                data={isPortfolioSelected ? data : noPortfolioSelectedData}
                isLoading={isLoading}
                noResultsComponent={
                    isPortfolioSelected && <NoInvestmentsComponent />
                }
            />
        </div>
    );
};

export default InvestmentsTable;
