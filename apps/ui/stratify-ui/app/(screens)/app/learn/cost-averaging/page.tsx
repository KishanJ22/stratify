"use client";

import LearnContent from "../components/LearnContent";
import CostAveragingSimulator from "./CostAveragingSimulator";

export default function CostAveragingPage() {
    return (
        <div className="items-center justify-items-center font-sans h-full px-10">
            <div className="text-5xl leading-14 text-primary-base font-semibold">
                Cost Averaging
            </div>
            <div className="flex flex-col mt-4 gap-y-5">
                <LearnContent
                    title="What is cost averaging?"
                    textContent="Cost averaging means investing equal amounts at regular intervals, regardless of the asset price. Instead of putting everything in at once, you spread your investment over time."
                />
                <LearnContent
                    title="Why does cost averaging matter?"
                    textContent="Regular and fixed contributions build your portfolio gradually without the pressure or stress that comes with timing the market. It suits investors with a low risk tolerance or those who make emotional decisions when prices move. Lump sum investing generally produces higher returns, since all of the money is put into the market at once. The trade-off with cost averaging is that there is more consistency and less stress for the investor at the expense of less money being invested at a given time."
                />
                <CostAveragingSimulator />
            </div>
        </div>
    );
}
