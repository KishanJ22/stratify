"use client";

import { useParams } from "next/navigation";
import { useAssetDetails } from "./hooks/useAssetDetails";
import { Skeleton } from "@/app/components/ui/skeleton";
import AssetPriceHistoryChart from "./components/AssetPriceHistoryChart";
import AssetDetailsCard from "./components/AssetDetailsCard";
import AssetActivityCard from "./components/AssetActivityCard";
import { useEffect, useState } from "react";
import FundSectorsModal from "./components/FundSectorsModal";
import CurrentHoldingsCard from "./components/CurrentHoldingsCard";
import { useAssetHoldings } from "./hooks/useAssetHoldings";
import AddAssetToPortfolio from "./components/AddAssetToPortfolio";
import AddInvestmentModal from "../../portfolios/components/AddInvestment/AddInvestmentModal";
import { usePortfolioList } from "../../portfolios/components/SelectedPortfolio/usePortfolioList";
import AddTradeModal from "../../portfolios/components/AddTrade/AddTradeModal";

export default function AssetPage() {
    const { assetId } = useParams<{ assetId: string }>();

    const {
        data: assetDetails,
        isLoading: isAssetDetailsLoading,
        error: assetDetailsError,
    } = useAssetDetails(parseInt(assetId));

    const { data: assetHoldings, isLoading: isAssetHoldingsLoading } =
        useAssetHoldings(parseInt(assetId));

    const { data: portfolioList, isLoading: isPortfolioListLoading } =
        usePortfolioList();

    const [isSectorsModalOpen, setIsSectorsModalOpen] = useState(false);
    const [isAddInvestmentModalOpen, setIsAddInvestmentModalOpen] =
        useState(false);
    const [isAddTradeModalOpen, setIsAddTradeModalOpen] = useState(false);

    const [selectedPortfolioId, setSelectedPortfolioId] = useState<
        number | null
    >(null);

    useEffect(() => {
        if (portfolioList && portfolioList.length > 0 && !selectedPortfolioId) {
            setSelectedPortfolioId(portfolioList[0].id);
        }
    }, [portfolioList, selectedPortfolioId]);

    return (
        <div className="min-h-screen px-10 font-sans">
            {isAssetDetailsLoading ? (
                <div className="flex flex-col gap-y-1">
                    <Skeleton className="w-80 h-8" />
                    <Skeleton className="w-60 h-6" />
                </div>
            ) : (
                <div className="flex flex-col gap-y-1">
                    <div className="text-4xl leading-10 text-primary-base font-semibold">
                        {assetDetails?.name ?? "---"}
                    </div>
                    <div className="text-2xl leading-9 text-primary-dark font-medium">
                        {assetDetails?.symbol ?? "---"}
                    </div>
                </div>
            )}
            <div className="mt-5 flex flex-row w-full">
                <div className="flex flex-col w-3/4">
                    <AssetPriceHistoryChart
                        assetId={parseInt(assetId)}
                        assetCurrency={assetDetails?.assetCurrency ?? ""}
                        isAssetDetailsLoading={isAssetDetailsLoading}
                    />
                    <div className="flex flex-row mt-5 w-full gap-x-5">
                        <AssetDetailsCard
                            asset={assetDetails}
                            isLoading={isAssetDetailsLoading}
                            setIsSectorsModalOpen={setIsSectorsModalOpen}
                        />
                        <AssetActivityCard
                            asset={assetDetails}
                            isLoading={isAssetDetailsLoading}
                            assetDetailsError={assetDetailsError}
                        />
                    </div>
                </div>
                <div className="flex flex-col justify-between ml-10 w-1/4">
                    <CurrentHoldingsCard
                        assetHoldings={assetHoldings ?? []}
                        assetCurrency={assetDetails?.assetCurrency ?? ""}
                        isLoading={isAssetHoldingsLoading}
                    />
                    <AddAssetToPortfolio
                        assetHoldings={assetHoldings ?? []}
                        isAssetHoldingsLoading={isAssetHoldingsLoading}
                        portfolioList={portfolioList ?? []}
                        isPortfolioListLoading={isPortfolioListLoading}
                        assetCurrency={assetDetails?.assetCurrency ?? ""}
                        isAssetDetailsLoading={isAssetDetailsLoading}
                        selectedPortfolioId={selectedPortfolioId}
                        setSelectedPortfolioId={setSelectedPortfolioId}
                        setIsAddInvestmentModalOpen={
                            setIsAddInvestmentModalOpen
                        }
                        setIsAddTradeModalOpen={setIsAddTradeModalOpen}
                    />
                </div>
            </div>
            <FundSectorsModal
                sectors={assetDetails?.sector ?? []}
                isOpen={isSectorsModalOpen}
                handleClose={() => setIsSectorsModalOpen(false)}
            />
            {assetDetails ? (
                <>
                    <AddInvestmentModal
                        preselectedAsset={assetDetails}
                        portfolioId={selectedPortfolioId!}
                        isOpen={isAddInvestmentModalOpen}
                        handleClose={() => setIsAddInvestmentModalOpen(false)}
                    />
                    <AddTradeModal
                        asset={assetDetails}
                        portfolioId={selectedPortfolioId!}
                        isOpen={isAddTradeModalOpen}
                        handleClose={() => setIsAddTradeModalOpen(false)}
                        navigateToPortfolioPage
                    />
                </>
            ) : null}
        </div>
    );
}
