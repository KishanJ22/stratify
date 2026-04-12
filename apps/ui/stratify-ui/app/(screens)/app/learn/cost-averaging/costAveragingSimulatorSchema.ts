import * as zod from "zod";

export const costAveragingSimulatorSchema = zod.object({
    assetName: zod.string().min(1, { error: "Asset should be selected" }),
    totalInvestment: zod.string().refine(
        (value) => {
            const numberValue = parseFloat(value);
            return !isNaN(numberValue) && numberValue > 0;
        },
        { error: "Total investment should be greater than 0" },
    ),
    contributionFrequency: zod.enum(
        ["weekly", "monthly", "quarterly", "annually"],
        {
            error: "Contribution frequency should be selected",
        },
    ),
    timePeriodYears: zod.string().refine(
        (value) => {
            const numberValue = parseInt(value);
            return !isNaN(numberValue) && numberValue >= 1;
        },
        { error: "Time period should be at least 1 year" },
    ),
    amountPerContribution: zod.string().refine(
        (value) => {
            const numberValue = parseFloat(value);
            return !isNaN(numberValue) && numberValue > 0;
        },
        { error: "Amount per contribution should be greater than 0" },
    ),
});

export type CostAveragingSimulatorSchema = zod.input<
    typeof costAveragingSimulatorSchema
>;
