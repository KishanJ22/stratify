import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import loadMockApp from "../../../__mocks__/mockApp.js";
import { createUser } from "../../../tests/create-user.js";
import db from "../../../database/db.js";
import { generateDevToken } from "../../../utils/generateDevToken.js";

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

vi.mock("../../../lib/api/data-api-client.js", () => ({
    dataApiClient: () => mockDataApiClient,
}));

describe("POST /assets/search", () => {
    let devToken = "";

    let app: any;

    beforeAll(async () => {
        devToken = await generateDevToken({ userId: "test-user" });

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
