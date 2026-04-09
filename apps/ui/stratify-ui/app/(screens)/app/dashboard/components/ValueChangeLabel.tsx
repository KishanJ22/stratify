"use client";

import {
    ChartColumn,
    ChartColumnDecreasing,
    ChartColumnIncreasing,
} from "lucide-react";

interface ValueChangeLabelProps {
    valueChangePercent?: number;
    isNotFoundError: boolean;
}

const ValueChangeLabel = ({
    valueChangePercent,
    isNotFoundError,
}: ValueChangeLabelProps) => {
    const baseClassName =
        "flex flex-row font-sans items-center text-lg gap-x-1 mt-1.5 leading-5";

    if (isNotFoundError) {
        return (
            <div className={`${baseClassName} text-secondary-light`}>
                <ChartColumn
                    className="w-5 h-5"
                    data-testid="chart-column-not-found"
                />
                {"---"}
            </div>
        );
    }

    const isPositive = valueChangePercent && valueChangePercent > 0.01;
    const isNegative = valueChangePercent && valueChangePercent < 0;

    const sign = isPositive ? "+" : "";

    if (isPositive) {
        return (
            <div className={`${baseClassName} text-positive-base`}>
                <ChartColumnIncreasing
                    className="w-5 h-5"
                    data-testid="chart-column-increasing-positive"
                />
                {`${sign}${valueChangePercent}%`}
            </div>
        );
    }

    if (isNegative) {
        return (
            <div className={`${baseClassName} text-negative-base`}>
                <ChartColumnDecreasing
                    className="w-5 h-5"
                    data-testid="chart-column-decreasing-negative"
                />
                {`${valueChangePercent}%`}
            </div>
        );
    }

    return (
        <div className={`${baseClassName} text-muted-dark`}>
            <ChartColumn className="w-5 h-5" data-testid="chart-column" />
            {"0%"}
        </div>
    );
};

export default ValueChangeLabel;
