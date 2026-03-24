import * as zod from "zod";

export const compoundingSimulatorSchema = zod.object({
    assetName: zod.string().min(1, { error: "Asset should be selected" }),
    initialInvestment: zod
        .number({
            error: "Initial investment should be a number",
        })
        .min(0.01, { error: "Initial investment should be greater than 0" }),
    monthlyContribution: zod
        .number({
            error: "Monthly contribution should be a number",
        })
        .min(0, {
            error: "Monthly contribution should be greater than or equal to 0",
        }),
    timePeriodYears: zod
        .number({
            error: "Time period should be a number",
        })
        .min(1, { error: "Time period should be at least 1 year" }),
    dividendYield: zod.optional(
        zod
            .number({
                error: "Dividend yield should be a number",
            })
            .min(0, {
                error: "Dividend yield should be greater than or equal to 0",
            }),
    ),
});

export type CompoundingSimulatorSchema = zod.input<
    typeof compoundingSimulatorSchema
>;
