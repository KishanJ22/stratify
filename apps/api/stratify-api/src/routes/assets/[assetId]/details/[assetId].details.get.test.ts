import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import loadMockApp from "../../../../__mocks__/mockApp.js";
import db from "../../../../database/db.js";
import { createUser } from "../../../../tests/create-user.js";
import { generateDevToken } from "../../../../utils/generateDevToken.js";
import { mockStockDetailsResponse } from "./_mocks/mockStockDetails.js";
import { mockFundDetailsResponse } from "./_mocks/mockFundDetails.js";
import { mockCryptocurrencyDetailsResponse } from "./_mocks/mockCryptocurrencyDetails.js";

const mockFetchStockDetails = vi
    .fn()
    .mockResolvedValue(mockStockDetailsResponse);

const mockFetchFundDetails = vi.fn().mockResolvedValue(mockFundDetailsResponse);

const mockFetchCryptocurrencyDetails = vi
    .fn()
    .mockResolvedValue(mockCryptocurrencyDetailsResponse);

const mockDataApiClient = {
    GET: (url: string) => {
        if (url.includes("/stocks")) {
            return mockFetchStockDetails();
        }

        if (url.includes("/funds")) {
            return mockFetchFundDetails();
        }

        if (url.includes("/cryptocurrencies")) {
            return mockFetchCryptocurrencyDetails();
        }
    },
};

vi.mock("../../../../lib/api/data-api-client", () => ({
    dataApiClient: () => mockDataApiClient,
}));

describe("GET /assets/:assetId/details", () => {
    let devToken = "";

    let app: any;

    beforeAll(async () => {
        devToken = await generateDevToken({ userId: "test-user" });
        app = await loadMockApp();
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return the details of a stock asset", async () => {
        await createUser("test-user").execute();

        await db
            .insertInto("stratify.assets")
            .values({
                id: 1,
                name: "Apple Inc.",
                symbol: "AAPL",
                countryId: 1,
                currency: "USD",
                type: "STOCK",
            })
            .execute();

        const response = await app.inject({
            method: "GET",
            url: "/assets/1/details",
            headers: {
                Authorization: devToken,
            },
        });

        expect(response.statusCode).toBe(200);

        const data = await response.json().data;

        expect(data).toEqual({
            id: 1,
            name: "Apple Inc.",
            symbol: "AAPL",
            countryId: 1,
            assetCurrency: "USD",
            assetType: "STOCK",
            marketState: "REGULAR",
            industry: "Consumer Electronics",
            sector: [
                {
                    sector: "technology",
                    weight: 1,
                },
            ],
            dayTradingActivity: {
                open: 149.0,
                close: 150.0,
                high: 151.0,
                low: 148.75,
                priceChange: 1.75,
                priceChangePercent: 1.18,
                tradingVolume: 75000000,
            },
        });
    });

    it("should return the details of a fund asset", async () => {
        await db
            .insertInto("stratify.assets")
            .values({
                id: 2,
                name: "A fund",
                symbol: "FUND",
                countryId: 1,
                currency: "USD",
                type: "ETF",
            })
            .execute();

        const response = await app.inject({
            method: "GET",
            url: "/assets/2/details",
            headers: {
                Authorization: devToken,
            },
        });

        expect(response.statusCode).toBe(200);

        const data = await response.json().data;

        expect(data).toEqual({
            id: 2,
            name: "A fund",
            symbol: "FUND",
            countryId: 1,
            assetCurrency: "USD",
            assetType: "ETF",
            marketState: "REGULAR",
            industry: null,
            sector: [
                {
                    sector: "technology",
                    weight: 0.95,
                },
                {
                    sector: "communications",
                    weight: 0.02,
                },
                {
                    sector: "energy",
                    weight: 0.02,
                },
                {
                    sector: "financial",
                    weight: 0.01,
                },
            ],
            dayTradingActivity: {
                open: 448.0,
                close: 449.0,
                high: 452.0,
                low: 447.5,
                priceChange: 1.25,
                priceChangePercent: 0.28,
                tradingVolume: 1200000,
            },
        });
    });

    it("should return the details of a cryptocurrency asset", async () => {
        await db
            .insertInto("stratify.assets")
            .values({
                id: 3,
                name: "Bitcoin",
                symbol: "BTC",
                countryId: 224,
                currency: "USD",
                type: "CRYPTOCURRENCY",
            })
            .execute();

        const response = await app.inject({
            method: "GET",
            url: "/assets/3/details",
            headers: {
                Authorization: devToken,
            },
        });

        expect(response.statusCode).toBe(200);

        const data = await response.json().data;

        expect(data).toEqual({
            id: 3,
            name: "Bitcoin",
            symbol: "BTC",
            countryId: 224,
            assetCurrency: "USD",
            assetType: "CRYPTOCURRENCY",
            marketState: "REGULAR",
            industry: null,
            sector: null,
            dayTradingActivity: {
                open: 44000,
                close: 44500,
                high: 46000,
                low: 43000,
                priceChange: 500,
                priceChangePercent: 1.12,
                tradingVolume: 35000,
            },
        });
    });

    it("should respond with a 404 not found error if the asset does not exist", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/assets/999/details",
            headers: {
                Authorization: devToken,
            },
        });

        expect(response.statusCode).toBe(404);

        const message = await response.json().message;

        expect(message).toBe("assetNotFound");
    });
});
