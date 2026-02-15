"use client";

import CreatePortfolioButton from "./CreatePortfolio/CreatePortfolioButton";
import PortfolioSelector from "./SelectedPortfolio/PortfolioSelector";
import { usePortfolioList } from "./SelectedPortfolio/usePortfolioList";

export default function PortfoliosPage() {
    const { data, isLoading } = usePortfolioList();

    return (
        <div className="items-center justify-items-center min-h-screen px-10">
            <div className="font-sans text-5xl text-primary-base font-semibold">
                Portfolios
            </div>

            <div className="mt-4">
                <CreatePortfolioButton />
                <PortfolioSelector portfolioList={data} isLoading={isLoading} />
            </div>
            <div className="mt-8">
                <div className="font-sans text-3xl text-primary-base font-semibold">
                    Investments
                </div>
            </div>
        </div>
    );
}
