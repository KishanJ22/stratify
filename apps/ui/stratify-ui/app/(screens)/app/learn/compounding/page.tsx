"use client";

import LearnContent from "../components/LearnContent";
import CompoundingSimulator from "./CompoundingSimulator";

export default function CompoundingPage() {
    return (
        <div className="items-center justify-items-center font-sans min-h-screen px-10">
            <div className="text-5xl leading-14 text-primary-base font-semibold">
                Compounding
            </div>
            <div className="flex flex-col mt-4 gap-y-5">
                <LearnContent
                    title="What is compounding?"
                    textContent="Compounding is when you earn returns on your original investment and on the gains you have already made. Compounding can easily be achieved by reinvesting dividends earned from holding investments or by adding to the initial investment. Over time, your wealth grows exponentially rather than in a straight line."
                />
                <LearnContent
                    title="Why does compounding matter?"
                    textContent="The longer your money is invested, the greater the returns. Reinvesting dividends and making regular contributions accelerates this further. For younger investors, time is the biggest advantage. Even small amounts can grow significantly when given enough time to compound."
                />
                <CompoundingSimulator />
            </div>
        </div>
    );
}
