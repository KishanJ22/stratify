
import * as zod from "zod";

export const costAveragingSimulatorSchema = zod.object({
    assetName: zod.string().min(1, { error: "Asset should be selected" }),
    totalInvestment: zod
        .number({
            error: "Total investment should be a number",
        })
        .min(0.01, { error: "Total investment should be greater than 0" }),
    contributionFrequency: zod.enum(
        ["weekly", "monthly", "quarterly", "annually"],
        {
            error: "Contribution frequency should be selected",
        },
    ),
    timePeriodYears: zod
        .number({
            error: "Time period should be a number",
        })
        .min(1, { error: "Time period should be at least 1 year" }),
    amountPerContribution: zod
        .number({
            error: "Amount per contribution should be a number",
        })
        .min(0.01, {
            error: "Amount per contribution should be greater than 0",
        }),
});

export type CostAveragingSimulatorSchema = zod.input<
    typeof costAveragingSimulatorSchema
>;
