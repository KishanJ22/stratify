import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import loadMockApp from "../../__mocks__/mockApp.js";
import { createUser } from "../../tests/create-user.js";
import db from "../../database/db.js";

const mockAssetPriceResponse = {
    data: {
        data: {
            currentPrice: 150.25,
            change: 2.5,
            changePercent: 1.69,
        },
    },
};

const mockGetCurrentPrice = vi.fn();

const mockDataApiClient = {
    GET: mockGetCurrentPrice,
};

vi.mock("../../lib/api/data-api-client.js", () => ({
    dataApiClient: () => mockDataApiClient,
}));

describe("POST /assets/search", () => {
    const devToken =
        "Bearer Dev-eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjkwMzQ3NTgsIm5hbWUiOiJ0ZXN0LXVzZXIiLCJlbWFpbCI6InRlc3QtdXNlckB0ZXN0LmNvbSIsImVtYWlsVmVyaWZpZWQiOmZhbHNlLCJpbWFnZSI6bnVsbCwiY3JlYXRlZEF0IjoiMjAyNi0wMS0yMVQyMDo1MjoxMC45MTFaIiwidXBkYXRlZEF0IjoiMjAyNi0wMS0yMVQyMDo1MjoxMC45MTFaIiwidXNlcm5hbWUiOiJ0ZXN0LXVzZXIiLCJkaXNwbGF5VXNlcm5hbWUiOiJ0ZXN0LXVzZXIiLCJ0d29GYWN0b3JFbmFibGVkIjpmYWxzZSwiaWQiOiJ0ZXN0LXVzZXIiLCJzdWIiOiJ0ZXN0LXVzZXIiLCJleHAiOjE3NjkwMzgzNTgsImlzcyI6Imh0dHA6Ly8xMjcuMC4wLjE6MjAwMCIsImF1ZCI6Imh0dHA6Ly8xMjcuMC4wLjE6MjAwMCJ9.4h0c9ETlknvzcvHhQULDfCx5OF0_nlo-S_j0BbXqrdQbkzigNUqeU2E3EC-2YeSBMwJk6ERGar_LJ-sBAtK9DQ";

    let app: any;

    beforeAll(async () => {
        app = await loadMockApp();
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return a list of assets when searching by name", async () => {
        mockGetCurrentPrice.mockResolvedValue(mockAssetPriceResponse);

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
            url: "/assets/search",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
            body: {
                query: "apple",
            },
        });

        const json = await response.json();

        expect(response.statusCode).toBe(200);

        expect(json).toEqual({
            data: [
                {
                    id: 1,
                    name: "Apple Inc.",
                    symbol: "AAPL",
                    currency: "USD",
                    assetType: "STOCK",
                    currentPrice: 150.25,
                    priceChange: 2.5,
                    priceChangePercent: 1.69,
                },
            ],
        });
    });

    it("should return a list of assets when searching by symbol", async () => {
        mockGetCurrentPrice.mockResolvedValue(mockAssetPriceResponse);

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
            url: "/assets/search",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
            body: {
                query: "AAPL",
            },
        });

        const json = await response.json();

        expect(response.statusCode).toBe(200);

        expect(json).toEqual({
            data: [
                {
                    id: 1,
                    name: "Apple Inc.",
                    symbol: "AAPL",
                    currency: "USD",
                    assetType: "STOCK",
                    currentPrice: 150.25,
                    priceChange: 2.5,
                    priceChangePercent: 1.69,
                },
            ],
        });
    });

    it("should return a 404 not found response if no assets match the query", async () => {
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
            url: "/assets/search",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
            body: {
                query: "microsoft",
            },
        });

        const json = await response.json();

        expect(response.statusCode).toBe(404);

        expect(json).toEqual({
            message: "noAssetsFound",
        });
    });

    it("should return a 400 bad request if the query is empty", async () => {
        await createUser("test-user").execute();

        const response = await app.inject({
            method: "POST",
            url: "/assets/search",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
            body: {
                query: "",
            },
        });

        const json = await response.json();

        expect(response.statusCode).toBe(400);

        expect(json).toEqual({
            message: "invalidSearchQuery",
        });
    });

    it("should return a list of assets even if fetching the current price fails", async () => {
        mockGetCurrentPrice.mockRejectedValue(
            new Error("Failed to fetch price"),
        );

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
            url: "/assets/search",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
            body: {
                query: "AAPL",
            },
        });

        const json = await response.json();

        expect(response.statusCode).toBe(200);

        expect(json).toEqual({
            data: [
                {
                    id: 1,
                    name: "Apple Inc.",
                    symbol: "AAPL",
                    currency: "USD",
                    assetType: "STOCK",
                    currentPrice: null,
                    priceChange: null,
                    priceChangePercent: null,
                },
            ],
        });
    });
});
