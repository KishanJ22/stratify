"use client";

import LearnCard from "./components/LearnCard";

export default function LearnPage() {
    return (
        <div className="items-center justify-items-center h-full px-10">
            <div className="font-sans text-5xl text-primary-base font-semibold leading-14">
                Learn
            </div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-5 mt-4 w-full">
                <LearnCard
                    title="Compounding"
                    description="Understand how returns grow on top of returns and the power of keeping money invested for longer."
                    linkToPage="/app/learn/compounding"
                />
                <LearnCard
                    title="Cost Averaging"
                    description="Learn how investing a fixed amount of money helps build your portfolio while taking out the emotion."
                    linkToPage="/app/learn/cost-averaging"
                />
                <LearnCard
                    title="Diversification"
                    description="Learn why putting your eggs in many baskets supports and protects your portfolio. "
                    isComingSoon
                />
                <LearnCard
                    title="Trading Simulator"
                    description="Learn how to trade by doing, get instant feedback and build the confidence to invest for real."
                    isComingSoon
                />
            </div>
        </div>
    );
}
