import { CompoundingSimulatorSuccessResponse } from "../useCompoundingSimulator";

export const mockSimulationResults = [
    {
        date: new Date("2025-01-01").toISOString().split("T")[0],
        noCompoundingValue: 1000,
        compoundingValue: 1000,
        compoundingWithDividendsValue: 1000,
    },
    {
        date: new Date("2025-02-01").toISOString().split("T")[0],
        noCompoundingValue: 1010,
        compoundingValue: 1015,
        compoundingWithDividendsValue: 1015,
    },
    {
        date: new Date("2025-03-01").toISOString().split("T")[0],
        noCompoundingValue: 1020,
        compoundingValue: 1030,
        compoundingWithDividendsValue: 1030,
    },
    {
        date: new Date("2025-04-01").toISOString().split("T")[0],
        noCompoundingValue: 1030,
        compoundingValue: 1050,
        compoundingWithDividendsValue: 1050,
    },
    {
        date: new Date("2025-05-01").toISOString().split("T")[0],
        noCompoundingValue: 1040,
        compoundingValue: 1075,
        compoundingWithDividendsValue: 1075,
    },
    {
        date: new Date("2025-06-01").toISOString().split("T")[0],
        noCompoundingValue: 1050,
        compoundingValue: 1100,
        compoundingWithDividendsValue: 1100,
    },
    {
        date: new Date("2025-07-01").toISOString().split("T")[0],
        noCompoundingValue: 1060,
        compoundingValue: 1125,
        compoundingWithDividendsValue: 1125,
    },
    {
        date: new Date("2025-08-01").toISOString().split("T")[0],
        noCompoundingValue: 1070,
        compoundingValue: 1150,
        compoundingWithDividendsValue: 1150,
    },
    {
        date: new Date("2025-09-01").toISOString().split("T")[0],
        noCompoundingValue: 1080,
        compoundingValue: 1175,
        compoundingWithDividendsValue: 1175,
    },
    {
        date: new Date("2025-10-01").toISOString().split("T")[0],
        noCompoundingValue: 1090,
        compoundingValue: 1200,
        compoundingWithDividendsValue: 1200,
    },
    {
        date: new Date("2025-11-01").toISOString().split("T")[0],
        noCompoundingValue: 1100,
        compoundingValue: 1225,
        compoundingWithDividendsValue: 1225,
    },
    {
        date: new Date("2025-12-01").toISOString().split("T")[0],
        noCompoundingValue: 1110,
        compoundingValue: 1250,
        compoundingWithDividendsValue: 1250,
    },
    {
        date: new Date("2026-01-01").toISOString().split("T")[0],
        noCompoundingValue: 1120,
        compoundingValue: 1275,
        compoundingWithDividendsValue: 1300,
    },
    {
        date: new Date("2026-02-01").toISOString().split("T")[0],
        noCompoundingValue: 1130,
        compoundingValue: 1300,
        compoundingWithDividendsValue: 1350,
    },
    {
        date: new Date("2026-03-01").toISOString().split("T")[0],
        noCompoundingValue: 1140,
        compoundingValue: 1325,
        compoundingWithDividendsValue: 1400,
    },
    {
        date: new Date("2026-04-01").toISOString().split("T")[0],
        noCompoundingValue: 1150,
        compoundingValue: 1350,
        compoundingWithDividendsValue: 1450,
    },
    {
        date: new Date("2026-05-01").toISOString().split("T")[0],
        noCompoundingValue: 1160,
        compoundingValue: 1375,
        compoundingWithDividendsValue: 1500,
    },
    {
        date: new Date("2026-06-01").toISOString().split("T")[0],
        noCompoundingValue: 1170,
        compoundingValue: 1400,
        compoundingWithDividendsValue: 1550,
    },
    {
        date: new Date("2026-07-01").toISOString().split("T")[0],
        noCompoundingValue: 1180,
        compoundingValue: 1425,
        compoundingWithDividendsValue: 1600,
    },
    {
        date: new Date("2026-08-01").toISOString().split("T")[0],
        noCompoundingValue: 1190,
        compoundingValue: 1450,
        compoundingWithDividendsValue: 1650,
    },
    {
        date: new Date("2026-09-01").toISOString().split("T")[0],
        noCompoundingValue: 1200,
        compoundingValue: 1475,
        compoundingWithDividendsValue: 1700,
    },
    {
        date: new Date("2026-10-01").toISOString().split("T")[0],
        noCompoundingValue: 1210,
        compoundingValue: 1500,
        compoundingWithDividendsValue: 1750,
    },
    {
        date: new Date("2026-11-01").toISOString().split("T")[0],
        noCompoundingValue: 1220,
        compoundingValue: 1525,
        compoundingWithDividendsValue: 1800,
    },
    {
        date: new Date("2026-12-01").toISOString().split("T")[0],
        noCompoundingValue: 1230,
        compoundingValue: 1550,
        compoundingWithDividendsValue: 1850,
    },
    {
        date: new Date("2027-01-01").toISOString().split("T")[0],
        noCompoundingValue: 1240,
        compoundingValue: 1575,
        compoundingWithDividendsValue: 1900,
    },
] satisfies CompoundingSimulatorSuccessResponse["data"]["results"];

export const mockReturns = {
    noCompounding: {
        absolute: 0,
        percentage: 0,
    },
    compounding: {
        absolute: 575,
        percentage: 57.5,
    },
    compoundingWithDividends: {
        absolute: 900,
        percentage: 90,
    },
} satisfies CompoundingSimulatorSuccessResponse["data"]["returns"];
