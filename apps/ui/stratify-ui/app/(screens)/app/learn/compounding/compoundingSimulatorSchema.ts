import * as zod from "zod";

export const compoundingSimulatorSchema = zod.object({
    assetName: zod.string().min(1, { error: "Asset should be selected" }),
    initialInvestment: zod.string().refine(
        (value) => {
            const numberValue = parseFloat(value);
            return !isNaN(numberValue) && numberValue > 0;
        },
        {
            error: "Initial investment should be greater than 0",
        },
    ),
    monthlyContribution: zod.string().refine(
        (value) => {
            const numberValue = parseFloat(value);
            return !isNaN(numberValue) && numberValue >= 0;
        },
        { error: "Monthly contribution should be greater than or equal to 0" },
    ),
    timePeriodYears: zod.string().refine(
        (value) => {
            const numberValue = parseInt(value);
            return !isNaN(numberValue) && numberValue >= 1;
        },
        { error: "Time period should be at least 1 year" },
    ),
    dividendYield: zod
        .string()
        .optional()
        .refine(
            (value) => {
                if (value === undefined || value === "") return true;

                const numberValue = parseFloat(value);
                return (
                    !isNaN(numberValue) &&
                    numberValue >= 0 &&
                    numberValue <= 100
                );
            },
            {
                error: "Dividend yield should be a number between 0 and 100",
            },
        ),
});

export type CompoundingSimulatorSchema = zod.input<
    typeof compoundingSimulatorSchema
>;
