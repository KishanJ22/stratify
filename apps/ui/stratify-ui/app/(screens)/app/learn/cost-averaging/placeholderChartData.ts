import type { CostAveragingSimulatorSuccessResponse } from "./useCostAveragingSimulator";

//? Data to show in the chart when no data is available
export const placeholderChartData = [
    {
        date: "",
        costAveragingValue: 500,
        lumpSumValue: 500,
    },
    {
        date: "",
        costAveragingValue: 400,
        lumpSumValue: 400,
    },
    {
        date: "",
        costAveragingValue: 800,
        lumpSumValue: 800,
    },
    {
        date: "",
        costAveragingValue: 200,
        lumpSumValue: 200,
    },
    {
        date: "",
        costAveragingValue: 750,
        lumpSumValue: 750,
    },
    {
        date: "",
        costAveragingValue: 1200,
        lumpSumValue: 1200,
    },
    {
        date: "",
        costAveragingValue: 600,
        lumpSumValue: 600,
    },
    {
        date: "",
        costAveragingValue: 1000,
        lumpSumValue: 1000,
    },
    {
        date: "",
        costAveragingValue: 1500,
        lumpSumValue: 1500,
    },
    {
        date: "",
        costAveragingValue: 900,
        lumpSumValue: 900,
    },
    {
        date: "",
        costAveragingValue: 200,
        lumpSumValue: 200,
    },
] satisfies CostAveragingSimulatorSuccessResponse["data"]["results"];
