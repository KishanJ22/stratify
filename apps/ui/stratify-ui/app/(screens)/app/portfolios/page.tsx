"use client";

import { useEffect, useState } from "react";
import CreatePortfolioButton from "./components/CreatePortfolio/CreatePortfolioButton";
import PortfolioSelector from "./components/SelectedPortfolio/PortfolioSelector";
import { usePortfolioList } from "./components/SelectedPortfolio/usePortfolioList";
import InvestmentsTable from "./components/InvestmentsTable/InvestmentsTable";
import AddInvestmentButton from "./components/AddInvestment/AddInvestmentButton";
import PortfolioValueChart from "./components/PortfolioValueChart/PortfolioValueChart";
import PortfolioMetrics from "./components/PortfolioMetrics/PortfolioMetrics";
import AssetAllocationCard from "./components/AssetAllocationCard/AssetAllocationCard";
import CreatePortfolioModal from "./components/CreatePortfolio/CreatePortfolioModal";
import { useSearchParams } from "next/navigation";

export default function PortfoliosPage() {
    const [selectedPortfolioId, setSelectedPortfolioId] = useState<
        number | null
    >(null);

    const searchParams = useSearchParams();
    const createPortfolioParam = searchParams.get("createPortfolio");
    const portfolioIdParam = searchParams.get("portfolioId");

    const [isCreatePortfolioModalOpen, setIsCreatePortfolioModalOpen] =
        useState(createPortfolioParam === "true");

    const { data, isLoading } = usePortfolioList();

    useEffect(() => {
        if (data && data.length > 0) {
            setSelectedPortfolioId(data[0].id);
        }
    }, [data]);

    useEffect(() => {
        if (portfolioIdParam) {
            setSelectedPortfolioId(parseInt(portfolioIdParam));
        }
    }, [portfolioIdParam]);

    return (
        <div className="items-center justify-items-center min-h-screen px-10">
            <div className="font-sans text-5xl text-primary-base font-semibold">
                Portfolios
            </div>
            <div className="flex flex-row w-full">
                <div className="flex flex-col w-full">
                    <div className="flex flex-row mt-4">
                        <div className="flex flex-col">
                            <CreatePortfolioButton
                                setIsCreatePortfolioModalOpen={
                                    setIsCreatePortfolioModalOpen
                                }
                            />
                            <PortfolioSelector
                                portfolioList={data}
                                isLoading={isLoading}
                                selectedPortfolioId={selectedPortfolioId}
                                setSelectedPortfolioId={setSelectedPortfolioId}
                            />
                        </div>
                        <div className="ml-4 w-full">
                            <PortfolioValueChart
                                portfolioId={selectedPortfolioId}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col mt-4">
                        <div className="flex flex-row items-center justify-between">
                            <div className="font-sans text-3xl text-primary-base font-semibold">
                                Investments
                            </div>
                            <AddInvestmentButton
                                portfolioId={selectedPortfolioId}
                            />
                        </div>
                        <InvestmentsTable portfolioId={selectedPortfolioId} />
                    </div>
                </div>
                <div className="flex flex-col ml-10 mt-4 gap-y-5">
                    <PortfolioMetrics portfolioId={selectedPortfolioId} />
                    <AssetAllocationCard portfolioId={selectedPortfolioId} />
                </div>
                <CreatePortfolioModal
                    isOpen={isCreatePortfolioModalOpen}
                    handleClose={() => setIsCreatePortfolioModalOpen(false)}
                />
            </div>
        </div>
    );
}
