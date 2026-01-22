"use client";

import CreatePortfolioButton from "./CreatePortfolio/CreatePortfolioButton";

export default function PortfoliosPage() {
    return (
        <div className="items-center justify-items-center min-h-screen px-10">
            <div className="font-sans text-5xl text-primary-base font-semibold">
                Portfolios
            </div>

            <div className="mt-4">
                <CreatePortfolioButton />
            </div>
        </div>
    );
}
