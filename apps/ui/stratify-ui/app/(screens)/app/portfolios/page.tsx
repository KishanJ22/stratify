"use client";

import { useEffect, useState } from "react";
import CreatePortfolioButton from "./CreatePortfolio/CreatePortfolioButton";
import PortfolioSelector from "./SelectedPortfolio/PortfolioSelector";
import { usePortfolioList } from "./SelectedPortfolio/usePortfolioList";
import InvestmentsTable from "./InvestmentsTable/InvestmentsTable";
import AddInvestmentButton from "./AddInvestment/AddInvestmentButton";

export default function PortfoliosPage() {
    const { data, isLoading } = usePortfolioList();

    const [selectedPortfolioId, setSelectedPortfolioId] = useState<
        number | null
    >(null);

    useEffect(() => {
        if (data && data.length > 0) {
            setSelectedPortfolioId(data[0].id);
        }
    }, [data]);

    return (
        <div className="items-center justify-items-center min-h-screen px-10">
            <div className="font-sans text-5xl text-primary-base font-semibold">
                Portfolios
            </div>

            <div className="mt-4">
                <CreatePortfolioButton />
                <PortfolioSelector
                    portfolioList={data}
                    isLoading={isLoading}
                    selectedPortfolioId={selectedPortfolioId}
                    setSelectedPortfolioId={setSelectedPortfolioId}
                />
            </div>
            <div className="mt-8">
                <div className="flex flex-row items-center justify-between">
                    <div className="font-sans text-3xl text-primary-base font-semibold">
                        Investments
                    </div>
                    <AddInvestmentButton portfolioId={selectedPortfolioId} />
                </div>
                <InvestmentsTable portfolioId={selectedPortfolioId} />
            </div>
        </div>
    );
}
