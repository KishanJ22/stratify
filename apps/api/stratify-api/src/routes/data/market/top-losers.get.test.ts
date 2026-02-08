import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import loadMockApp from "../../../__mocks__/mockApp.js";
import { mockDataResponse } from "./_mocks/mock-data-response.js";
import db from "../../../database/db.js";
import { createUser } from "../../../tests/create-user.js";
import type { TopAsset } from "./top-assets-schema.js";

const mockTopLosersDataGet = vi.fn();

const mockDataApiClient = {
    GET: mockTopLosersDataGet,
};

vi.mock("../../../lib/api/data-api-client.js", () => ({
    dataApiClient: () => mockDataApiClient,
}));

describe("GET /data/market/top-losers", () => {
    const devToken =
        "Bearer Dev-eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjkwMzQ3NTgsIm5hbWUiOiJ0ZXN0LXVzZXIiLCJlbWFpbCI6InRlc3QtdXNlckB0ZXN0LmNvbSIsImVtYWlsVmVyaWZpZWQiOmZhbHNlLCJpbWFnZSI6bnVsbCwiY3JlYXRlZEF0IjoiMjAyNi0wMS0yMVQyMDo1MjoxMC45MTFaIiwidXBkYXRlZEF0IjoiMjAyNi0wMS0yMVQyMDo1MjoxMC45MTFaIiwidXNlcm5hbWUiOiJ0ZXN0LXVzZXIiLCJkaXNwbGF5VXNlcm5hbWUiOiJ0ZXN0LXVzZXIiLCJ0d29GYWN0b3JFbmFibGVkIjpmYWxzZSwiaWQiOiJ0ZXN0LXVzZXIiLCJzdWIiOiJ0ZXN0LXVzZXIiLCJleHAiOjE3NjkwMzgzNTgsImlzcyI6Imh0dHA6Ly8xMjcuMC4wLjE6MjAwMCIsImF1ZCI6Imh0dHA6Ly8xMjcuMC4wLjE6MjAwMCJ9.4h0c9ETlknvzcvHhQULDfCx5OF0_nlo-S_j0BbXqrdQbkzigNUqeU2E3EC-2YeSBMwJk6ERGar_LJ-sBAtK9DQ";

    let app: any;

    beforeAll(async () => {
        app = await loadMockApp();
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return the top losers in the market and a 200 status", async () => {
        await createUser("test-user").execute();

        mockTopLosersDataGet.mockResolvedValue(mockDataResponse);

        await db
            .insertInto("stratify.assets")
            .values([
                {
                    symbol: "ABC",
                    name: "ABC company",
                    type: "STOCK",
                    countryId: 223,
                    currency: "GBP",
                },
                {
                    symbol: "DEF",
                    name: "DEF company",
                    type: "STOCK",
                    countryId: 223,
                    currency: "GBP",
                },
                {
                    symbol: "ABCD",
                    name: "ABCD company",
                    type: "STOCK",
                    countryId: 224,
                    currency: "USD",
                },
            ])
            .execute();

        const response = await app.inject({
            method: "GET",
            url: "/data/market/top-losers",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(200);

        const json = await response.json();
        const data = json.data as TopAsset[];

        expect(data).toHaveLength(3);
        expect(data[0]).toMatchObject({
            symbol: "ABC",
            name: "ABC company",
            currency: "GBP",
            assetType: "STOCK",
            marketState: "POSTPOST",
            priceDetails: {
                currentPrice: 46.55,
                volume: 40,
                priceChange: 26.9614,
                priceChangePercent: 137.63821,
            },
        });
    });

    it("should return a 404 status if there are no top losers", async () => {
        await createUser("test-user").execute();

        mockTopLosersDataGet.mockResolvedValue({ data: { data: [] } });

        const response = await app.inject({
            method: "GET",
            url: "/data/market/top-losers",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(404);

        const json = await response.json();
        expect(json).toMatchObject({ message: "noTopLosersData" });
    });

    it("should not return assets for which details cannot be found in the db", async () => {
        await createUser("test-user").execute();

        mockTopLosersDataGet.mockResolvedValue(mockDataResponse);

        await db
            .insertInto("stratify.assets")
            .values([
                {
                    symbol: "ABC",
                    name: "ABC company",
                    type: "STOCK",
                    countryId: 223,
                    currency: "GBP",
                },
                {
                    symbol: "DEF",
                    name: "DEF company",
                    type: "STOCK",
                    countryId: 223,
                    currency: "GBP",
                },
            ])
            .execute();

        const response = await app.inject({
            method: "GET",
            url: "/data/market/top-losers",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(200);

        const json = await response.json();
        const data = json.data as TopAsset[];

        expect(data).toHaveLength(2);

        data.forEach((asset) => {
            expect("ABCD").not.toBe(asset.symbol);
        });
    });
});
