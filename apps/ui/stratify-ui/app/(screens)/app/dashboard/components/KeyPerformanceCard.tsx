"use client";

import { ReactNode } from "react";

interface KeyPerformanceCardProps {
    children: ReactNode;
    title: string;
}

const KeyPerformanceCard = ({ title, children }: KeyPerformanceCardProps) => {
    return (
        <div className="flex flex-col h-[115px] w-full shadow-lg bg-primary-lightest rounded-xl py-2.5 px-3 font-sans">
            <div className="text-3xl leading-10 font-semibold text-secondary-base">
                {title}
            </div>
            <div className="mt-2.5">{children}</div>
        </div>
    );
};

export default KeyPerformanceCard;
