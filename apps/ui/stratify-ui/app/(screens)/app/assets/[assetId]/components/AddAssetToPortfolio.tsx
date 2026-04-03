import { Skeleton } from "@/app/components/ui/skeleton";
import type { PortfolioList } from "../../../portfolios/components/SelectedPortfolio/usePortfolioList";
import type { AssetHolding } from "../hooks/useAssetHoldings";
import PortfolioSelector from "../../../portfolios/components/SelectedPortfolio/PortfolioSelector";
import { Dispatch, SetStateAction } from "react";
import { useSessionContext } from "../../../SessionProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import { formatNumericValue } from "@/app/utils/formatNumericValue";

interface AddAssetToPortfolioProps {
    assetHoldings: AssetHolding[];
    portfolioList: PortfolioList;
    assetCurrency: string;
    isLoading: boolean;
    selectedPortfolioId: number | null;
    setSelectedPortfolioId: Dispatch<SetStateAction<number | null>>;
    setIsAddInvestmentModalOpen: Dispatch<SetStateAction<boolean>>;
    setIsAddTradeModalOpen: Dispatch<SetStateAction<boolean>>;
}

const AddAssetToPortfolio = ({
    assetHoldings,
    portfolioList,
    assetCurrency,
    isLoading,
    selectedPortfolioId,
    setSelectedPortfolioId,
    setIsAddInvestmentModalOpen,
    setIsAddTradeModalOpen,
}: AddAssetToPortfolioProps) => {
    const { session } = useSessionContext();
    const userCurrency = session?.userDetails.currency || "---";

    const assetHoldingForPortfolio = assetHoldings.find(
        (holding) => holding.portfolioId === selectedPortfolioId,
    );

    const overallReturnSign =
        assetHoldingForPortfolio?.currentReturn &&
        assetHoldingForPortfolio.currentReturn > 0
            ? "+"
            : "";

    return (
        <div className="flex flex-col py-2.5 px-3 bg-primary-lightest rounded-xl border border-primary-base font-sans min-h-60">
            <div className="font-semibold text-2xl leading-6 text-secondary-dark">
                {"Add to a portfolio"}
            </div>
            {isLoading ? (
                <div className="flex flex-col gap-y-1 mt-2">
                    <div className="flex flex-row justify-between">
                        <Skeleton className="h-4 w-25" />
                        <Skeleton className="h-4 w-25" />
                    </div>
                    <div className="flex flex-row justify-between">
                        <Skeleton className="h-4 w-25" />
                        <Skeleton className="h-4 w-25" />
                    </div>
                    <div className="flex flex-row justify-between">
                        <Skeleton className="h-4 w-25" />
                        <Skeleton className="h-4 w-25" />
                    </div>
                    <div className="flex flex-row justify-between">
                        <Skeleton className="h-4 w-25" />
                        <Skeleton className="h-4 w-25" />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col flex-1">
                    <div className="flex flex-col gap-y-1 mt-2 flex-1">
                        <div className="flex flex-row justify-between items-center">
                            <div className="font-medium text-secondary-base text-lg leading-6">
                                {"Portfolio"}
                            </div>
                            <div className="flex w-50 min-w-10">
                                <PortfolioSelector
                                    variant="secondary"
                                    portfolioList={portfolioList}
                                    isLoading={isLoading}
                                    selectedPortfolioId={selectedPortfolioId}
                                    setSelectedPortfolioId={
                                        setSelectedPortfolioId
                                    }
                                />
                            </div>
                        </div>
                        {assetHoldingForPortfolio ? (
                            <>
                                <div className="flex flex-row justify-between">
                                    <div className="font-medium text-secondary-base text-lg leading-6">
                                        {"Current value"}
                                    </div>
                                    <div className="flex flex-col font-medium text-right">
                                        <div className="text-secondary-base text-lg leading-6">
                                            {formatNumericValue(
                                                assetHoldingForPortfolio.currentValue,
                                                userCurrency,
                                            )}
                                        </div>
                                        {assetCurrency !== userCurrency &&
                                        assetHoldingForPortfolio.currentValueAssetCurrency &&
                                        assetHoldingForPortfolio.currentValueAssetCurrency >
                                            0 ? (
                                            <div className="text-secondary-light text-sm leading-5">
                                                {formatNumericValue(
                                                    assetHoldingForPortfolio.currentValueAssetCurrency,
                                                    assetCurrency,
                                                )}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="flex flex-row justify-between">
                                    <div className="font-medium text-secondary-base text-lg leading-6">
                                        {"Shares held"}
                                    </div>
                                    <div className="font-medium text-secondary-base text-lg leading-6">
                                        {assetHoldingForPortfolio.shares}
                                    </div>
                                </div>
                                <div className="flex flex-row justify-between">
                                    <div className="font-medium text-secondary-base text-lg leading-6">
                                        {"Current return"}
                                    </div>
                                    <div className="flex flex-col font-medium text-right">
                                        <div
                                            className={cn(
                                                "text-secondary-base text-lg leading-6",
                                                assetHoldingForPortfolio.currentReturn >
                                                    0 && "text-positive-base",
                                                assetHoldingForPortfolio.currentReturn <
                                                    0 && "text-negative-base",
                                                assetHoldingForPortfolio.currentReturn ===
                                                    0 && "text-secondary-base",
                                            )}
                                        >
                                            {formatNumericValue(
                                                assetHoldingForPortfolio.currentReturn,
                                                userCurrency,
                                            )}
                                        </div>
                                        <div
                                            className={cn(
                                                "text-secondary-base text-sm leading-5",
                                                assetHoldingForPortfolio.currentReturn >
                                                    0 && "text-positive-base",
                                                assetHoldingForPortfolio.currentReturn <
                                                    0 && "text-negative-base",
                                                assetHoldingForPortfolio.currentReturn ===
                                                    0 && "text-secondary-base",
                                            )}
                                        >
                                            {`${overallReturnSign} ${assetHoldingForPortfolio.currentReturnPercentage.toFixed(2)}%`}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center font-semibold text-secondary-light text-center text-lg leading-6">
                                {"Asset currently not in portfolio"}
                            </div>
                        )}
                        <Button
                            variant="secondary"
                            className="mt-2.5 w-full"
                            onClick={() => {
                                return assetHoldingForPortfolio
                                    ? setIsAddTradeModalOpen(true)
                                    : setIsAddInvestmentModalOpen(true);
                            }}
                        >
                            {assetHoldingForPortfolio
                                ? "Add trade to portfolio"
                                : "Add investment to portfolio"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddAssetToPortfolio;
