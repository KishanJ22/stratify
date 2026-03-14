"use client";

import {
    ChartColumn,
    ChartColumnDecreasing,
    ChartColumnIncreasing,
} from "lucide-react";

interface ValueChangeLabelProps {
    valueChangePercent?: number;
    isInvestmentsNotFoundError: boolean;
}

const ValueChangeLabel = ({
    valueChangePercent,
    isInvestmentsNotFoundError,
}: ValueChangeLabelProps) => {
    const baseClassName =
        "flex flex-row font-sans items-center text-lg gap-x-1 mt-1.5 leading-5";

    if (!valueChangePercent || isInvestmentsNotFoundError) {
        return (
            <div className={`${baseClassName} text-secondary-light`}>
                <ChartColumn className="w-5 h-5" />
                {"---"}
            </div>
        );
    }

    const isPositive = valueChangePercent > 0.01;
    const isNegative = valueChangePercent < 0;

    const sign = isPositive ? "+" : "";

    if (isPositive) {
        return (
            <div className={`${baseClassName} text-positive-base`}>
                <ChartColumnIncreasing className="w-5 h-5" />
                {`${sign}${valueChangePercent}%`}
            </div>
        );
    }

    if (isNegative) {
        return (
            <div className={`${baseClassName} text-negative-base`}>
                <ChartColumnDecreasing className="w-5 h-5" />
                {`${valueChangePercent}%`}
            </div>
        );
    }

    return (
        <div className={`${baseClassName} text-muted-dark`}>
            <ChartColumn className="w-5 h-5" />
            {"0%"}
        </div>
    );
};

export default ValueChangeLabel;
