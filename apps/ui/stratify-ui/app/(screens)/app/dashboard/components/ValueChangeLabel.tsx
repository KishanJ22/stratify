"use client";

import {
    ChartColumn,
    ChartColumnDecreasing,
    ChartColumnIncreasing,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface ValueChangeLabelProps {
    valueChangePercent: number | null;
    isNotFoundError: boolean;
}

const ValueChangeLabel = ({
    valueChangePercent,
    isNotFoundError,
}: ValueChangeLabelProps) => {
    const translate = useTranslations("Generic");
    const baseClassName =
        "flex flex-row font-sans items-center text-lg gap-x-1 mt-1.5 leading-5";

    if (isNotFoundError || valueChangePercent == null) {
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

    return valueChangePercent === 0 ? (
        <div className={`${baseClassName} text-secondary-light`}>
            <ChartColumn className="w-5 h-5" data-testid="chart-column" />
            {translate("percentage", {
                percentage: 0,
            })}
        </div>
    ) : valueChangePercent > 0 ? (
        <div className={`${baseClassName} text-positive-base`}>
            <ChartColumnIncreasing
                className="w-5 h-5"
                data-testid="chart-column-increasing-positive"
            />
            {translate("positivePercentage", {
                percentage: valueChangePercent,
            })}
        </div>
    ) : (
        <div className={`${baseClassName} text-negative-base`}>
            <ChartColumnDecreasing
                className="w-5 h-5"
                data-testid="chart-column-decreasing-negative"
            />
            {translate("percentage", {
                percentage: valueChangePercent,
            })}
        </div>
    );
};

export default ValueChangeLabel;
