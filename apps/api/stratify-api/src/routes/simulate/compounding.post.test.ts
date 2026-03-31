import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import loadMockApp from "../../__mocks__/mockApp.js";
import db from "../../database/db.js";
import { createUser } from "../../tests/create-user.js";
import { generateDevToken } from "../../utils/generateDevToken.js";
import { mockHistoricAssetPrices } from "./_mocks/mockHistoricAssetPrices.js";
import type { SimulationResponse } from "./compounding.post.js";

describe("POST /simulate/compounding", () => {
    let devToken = "";

    let app: any;

    beforeAll(async () => {
        app = await loadMockApp();

        devToken = await generateDevToken({ userId: "test-user" });
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should execute compounding simulation successfully", async () => {
        await createUser("test-user").execute();

        await db
            .insertInto("stratify.assets")
            .values({
                id: 1,
                name: "Apple Inc.",
                symbol: "AAPL",
                currency: "USD",
                type: "STOCK",
                countryId: 224, // Country ID for united states
            })
            .execute();

        await db
            .insertInto("stratify.assetPrices")
            .values(mockHistoricAssetPrices)
            .execute();

        const response = await app.inject({
            method: "POST",
            url: "/simulate/compounding",
            headers: {
                Authorization: devToken,
            },
            payload: {
                assetId: 1,
                initialInvestment: 10000,
                monthlyContribution: 500,
                timePeriodYears: 3,
                dividendYield: null,
            },
        });

        expect(response.statusCode).toBe(200);

        const data = (await response.json().data) as SimulationResponse;

        expect(data).toBeDefined();

        expect(data.results.length).toBeGreaterThan(0);

        expect(data.returns).toEqual({
            noCompounding: {
                absolute: 26904.76,
                percentage: 269.05,
            },
            compounding: {
                absolute: 42829.14,
                percentage: 155.74,
            },
            compoundingWithDividends: null,
        });
    });

    it("should include compounding with dividends when a dividend yield is provided", async () => {
        await createUser("test-user").execute();

        await db
            .insertInto("stratify.assets")
            .values({
                id: 1,
                name: "Apple Inc.",
                symbol: "AAPL",
                currency: "USD",
                type: "STOCK",
                countryId: 224, // Country ID for united states
            })
            .execute();

        await db
            .insertInto("stratify.assetPrices")
            .values(mockHistoricAssetPrices)
            .execute();

        const response = await app.inject({
            method: "POST",
            url: "/simulate/compounding",
            headers: {
                Authorization: devToken,
            },
            payload: {
                assetId: 1,
                initialInvestment: 10000,
                monthlyContribution: 500,
                timePeriodYears: 3,
                dividendYield: 1.5,
            },
        });

        expect(response.statusCode).toBe(200);

        const data = (await response.json().data) as SimulationResponse;

        expect(data).toBeDefined();

        expect(data.results.length).toBeGreaterThan(0);

        expect(data.returns).toEqual({
            noCompounding: {
                absolute: 26904.76,
                percentage: 269.05,
            },
            compounding: {
                absolute: 42829.14,
                percentage: 155.74,
            },
            compoundingWithDividends: {
                absolute: 45654.04,
                percentage: 166.01,
            },
        });
    });

    it("should return a 404 error if no historic price data is found for the asset", async () => {
        await createUser("test-user").execute();

        await db
            .insertInto("stratify.assets")
            .values({
                id: 1,
                name: "Apple Inc.",
                symbol: "AAPL",
                currency: "USD",
                type: "STOCK",
                countryId: 224, // Country ID for united states
            })
            .execute();

        const response = await app.inject({
            method: "POST",
            url: "/simulate/compounding",
            headers: {
                Authorization: devToken,
            },
            payload: {
                assetId: 1,
                initialInvestment: 10000,
                monthlyContribution: 500,
                timePeriodYears: 3,
                dividendYield: null,
            },
        });

        expect(response.statusCode).toBe(404);

        const json = await response.json();

        expect(json).toEqual({
            message: "noDataFound",
        });
    });

    it("should return a 400 error if the simulation is unsuccessful", async () => {
        await createUser("test-user").execute();

        await db
            .insertInto("stratify.assets")
            .values({
                id: 1,
                name: "Apple Inc.",
                symbol: "AAPL",
                currency: "USD",
                type: "STOCK",
                countryId: 224, // Country ID for united states
            })
            .execute();

        await db
            .insertInto("stratify.assetPrices")
            .values({
                assetId: 1,
                priceDate: new Date(),
                closePrice: 150,
                openPrice: 150,
                lowPrice: 150,
                highPrice: 150,
                volume: 1000,
            })
            .execute();

        const response = await app.inject({
            method: "POST",
            url: "/simulate/compounding",
            headers: {
                Authorization: devToken,
            },
            payload: {
                assetId: 1,
                initialInvestment: 10000,
                monthlyContribution: 500,
                timePeriodYears: 3,
                dividendYield: null,
            },
        });

        expect(response.statusCode).toBe(400);

        const json = await response.json();

        expect(json).toEqual({
            message: "cannotSimulate",
        });
    });
});
