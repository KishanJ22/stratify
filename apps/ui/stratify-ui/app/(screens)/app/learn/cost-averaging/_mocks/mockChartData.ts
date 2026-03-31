import type { CostAveragingSimulatorSuccessResponse } from "../useCostAveragingSimulator";

export const mockSimulationResults = [
    {
        date: new Date("2025-01-01").toISOString().split("T")[0],
        costAveragingValue: 1000,
        lumpSumValue: 1000,
    },
    {
        date: new Date("2025-02-01").toISOString().split("T")[0],
        costAveragingValue: 1010,
        lumpSumValue: 1015,
    },
    {
        date: new Date("2025-03-01").toISOString().split("T")[0],
        costAveragingValue: 1020,
        lumpSumValue: 1030,
    },
    {
        date: new Date("2025-04-01").toISOString().split("T")[0],
        costAveragingValue: 1030,
        lumpSumValue: 1050,
    },
    {
        date: new Date("2025-05-01").toISOString().split("T")[0],
        costAveragingValue: 1040,
        lumpSumValue: 1075,
    },
    {
        date: new Date("2025-06-01").toISOString().split("T")[0],
        costAveragingValue: 1050,
        lumpSumValue: 1100,
    },
    {
        date: new Date("2025-07-01").toISOString().split("T")[0],
        costAveragingValue: 1060,
        lumpSumValue: 1125,
    },
    {
        date: new Date("2025-08-01").toISOString().split("T")[0],
        costAveragingValue: 1070,
        lumpSumValue: 1150,
    },
    {
        date: new Date("2025-09-01").toISOString().split("T")[0],
        costAveragingValue: 1080,
        lumpSumValue: 1175,
    },
    {
        date: new Date("2025-10-01").toISOString().split("T")[0],
        costAveragingValue: 1090,
        lumpSumValue: 1200,
    },
    {
        date: new Date("2025-11-01").toISOString().split("T")[0],
        costAveragingValue: 1100,
        lumpSumValue: 1225,
    },
    {
        date: new Date("2025-12-01").toISOString().split("T")[0],
        costAveragingValue: 1110,
        lumpSumValue: 1250,
    },
    {
        date: new Date("2026-01-01").toISOString().split("T")[0],
        costAveragingValue: 1120,
        lumpSumValue: 1275,
    },
    {
        date: new Date("2026-02-01").toISOString().split("T")[0],
        costAveragingValue: 1130,
        lumpSumValue: 1300,
    },
    {
        date: new Date("2026-03-01").toISOString().split("T")[0],
        costAveragingValue: 1140,
        lumpSumValue: 1325,
    },
    {
        date: new Date("2026-04-01").toISOString().split("T")[0],
        costAveragingValue: 1150,
        lumpSumValue: 1350,
    },
    {
        date: new Date("2026-05-01").toISOString().split("T")[0],
        costAveragingValue: 1160,
        lumpSumValue: 1375,
    },
    {
        date: new Date("2026-06-01").toISOString().split("T")[0],
        costAveragingValue: 1170,
        lumpSumValue: 1400,
    },
    {
        date: new Date("2026-07-01").toISOString().split("T")[0],
        costAveragingValue: 1180,
        lumpSumValue: 1425,
    },
    {
        date: new Date("2026-08-01").toISOString().split("T")[0],
        costAveragingValue: 1190,
        lumpSumValue: 1450,
    },
    {
        date: new Date("2026-09-01").toISOString().split("T")[0],
        costAveragingValue: 1200,
        lumpSumValue: 1475,
    },
    {
        date: new Date("2026-10-01").toISOString().split("T")[0],
        costAveragingValue: 1210,
        lumpSumValue: 1500,
    },
    {
        date: new Date("2026-11-01").toISOString().split("T")[0],
        costAveragingValue: 1220,
        lumpSumValue: 1525,
    },
    {
        date: new Date("2026-12-01").toISOString().split("T")[0],
        costAveragingValue: 1230,
        lumpSumValue: 1550,
    },
    {
        date: new Date("2027-01-01").toISOString().split("T")[0],
        costAveragingValue: 1240,
        lumpSumValue: 1575,
    },
] satisfies CostAveragingSimulatorSuccessResponse["data"]["results"];

export const mockReturns = {
    costAveraging: {
        absolute: 575,
        percentage: 57.5,
    },
    lumpSum: {
        absolute: 900,
        percentage: 90,
    },
} satisfies CostAveragingSimulatorSuccessResponse["data"]["returns"];
