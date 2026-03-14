"use client";

import {
    ChartColumn,
    ChartColumnDecreasing,
    ChartColumnIncreasing,
} from "lucide-react";

interface ValueChangeLabelProps {
    valueChangePercent: number;
}

const ValueChangeLabel = ({ valueChangePercent }: ValueChangeLabelProps) => {
    const isPositive = valueChangePercent > 0.01;
    const isNegative = valueChangePercent < 0;

    const sign = isPositive ? "+" : "";

    if (isPositive) {
        return (
            <div className="flex flex-row font-sans items-center text-lg gap-x-1 mt-1.5 leading-5 text-positive-base">
                <ChartColumnIncreasing className="w-5 h-5" />
                {`${sign}${valueChangePercent}%`}
            </div>
        );
    }

    if (isNegative) {
        return (
            <div className="flex flex-row font-sans items-center text-lg gap-x-1 mt-1.5 leading-5 text-negative-base">
                <ChartColumnDecreasing className="w-5 h-5" />
                {`${valueChangePercent}%`}
            </div>
        );
    }

    return (
        <div className="flex flex-row font-sans items-center text-lg gap-x-1 mt-1.5 leading-5 text-muted-dark">
            <ChartColumn className="w-5 h-5" />
            {"0%"}
        </div>
    );
};

export default ValueChangeLabel;
