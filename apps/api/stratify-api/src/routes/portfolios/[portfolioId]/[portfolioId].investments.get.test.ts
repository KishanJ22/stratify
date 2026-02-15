import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import loadMockApp from "../../../__mocks__/mockApp.js";
import db from "../../../database/db.js";
import { createUser } from "../../../tests/create-user.js";

const mockAssetPriceResponse = {
    data: {
        data: {
            currentPrice: 152,
            change: 2.5,
            changePercent: 1.69,
        },
    },
};

const mockGetCurrentPrice = vi.fn();

const mockDataApiClient = {
    GET: mockGetCurrentPrice,
};

vi.mock("../../../lib/api/data-api-client", () => ({
    dataApiClient: () => mockDataApiClient,
}));

describe("GET /portfolios/:portfolioId/investments", () => {
    const devToken =
        "Bearer Dev-eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjkwMzQ3NTgsIm5hbWUiOiJ0ZXN0LXVzZXIiLCJlbWFpbCI6InRlc3QtdXNlckB0ZXN0LmNvbSIsImVtYWlsVmVyaWZpZWQiOmZhbHNlLCJpbWFnZSI6bnVsbCwiY3JlYXRlZEF0IjoiMjAyNi0wMS0yMVQyMDo1MjoxMC45MTFaIiwidXBkYXRlZEF0IjoiMjAyNi0wMS0yMVQyMDo1MjoxMC45MTFaIiwidXNlcm5hbWUiOiJ0ZXN0LXVzZXIiLCJkaXNwbGF5VXNlcm5hbWUiOiJ0ZXN0LXVzZXIiLCJ0d29GYWN0b3JFbmFibGVkIjpmYWxzZSwiaWQiOiJ0ZXN0LXVzZXIiLCJzdWIiOiJ0ZXN0LXVzZXIiLCJleHAiOjE3NjkwMzgzNTgsImlzcyI6Imh0dHA6Ly8xMjcuMC4wLjE6MjAwMCIsImF1ZCI6Imh0dHA6Ly8xMjcuMC4wLjE6MjAwMCJ9.4h0c9ETlknvzcvHhQULDfCx5OF0_nlo-S_j0BbXqrdQbkzigNUqeU2E3EC-2YeSBMwJk6ERGar_LJ-sBAtK9DQ";

    const secondDevToken =
        "Bearer Dev-eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjkwMzQ3NTgsIm5hbWUiOiJhbm90aGVyLXRlc3QtdXNlciIsImVtYWlsIjoiYW5vdGhlci10ZXN0LXVzZXJAdGVzdC5jb20iLCJlbWFpbFZlcmlmaWVkIjpmYWxzZSwiaW1hZ2UiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjYtMDEtMjFUMjA6NTI6MTAuOTExWiIsInVwZGF0ZWRBdCI6IjIwMjYtMDEtMjFUMjA6NTI6MTAuOTExWiIsInVzZXJuYW1lIjoiYW5vdGhlci10ZXN0LXVzZXIiLCJkaXNwbGF5VXNlcm5hbWUiOiJhbm90aGVyLXRlc3QtdXNlciIsInR3b0ZhY3RvckVuYWJsZWQiOmZhbHNlLCJpZCI6ImFub3RoZXItdGVzdC11c2VyIiwic3ViIjoiYW5vdGhlci10ZXN0LXVzZXIiLCJleHAiOjE3NjkwMzgzNTgsImlzcyI6Imh0dHA6Ly8xMjcuMC4wLjE6MjAwMCIsImF1ZCI6Imh0dHA6Ly8xMjcuMC4wLjE6MjAwMCJ9.loa5vJNiu9uwpmSTilPMCDI4NF2e0GP6ATO7fmQNuRjg-ByCgmJTcAUd-jNY4A2Lkls_VTED07WYEe8SelVRCA";

    let app: any;

    beforeAll(async () => {
        app = await loadMockApp();
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return a list of investments for a portfolio successfully", async () => {
        mockGetCurrentPrice.mockResolvedValue(mockAssetPriceResponse);

        await createUser("test-user").execute();

        await db
            .insertInto("stratify.assets")
            .values([
                {
                    name: "Apple Inc.",
                    symbol: "AAPL",
                    currency: "USD",
                    type: "STOCK",
                    countryId: 224, // Country ID for united states
                },
                {
                    name: "Leonida Inc.",
                    symbol: "LEON",
                    currency: "USD",
                    type: "STOCK",
                    countryId: 224, // Country ID for united states
                },
            ])
            .execute();

        await db
            .insertInto("stratify.assetPrices")
            .values([
                {
                    assetId: "USDGBP",
                    countryId: 224,
                    priceDate: new Date(),
                    lowPrice: 0.75,
                    highPrice: 0.77,
                    openPrice: 0.76,
                    closePrice: 0.73,
                    volume: 0,
                },
            ])
            .execute();

        const portfolio = await db
            .insertInto("stratify.portfolios")
            .values({
                name: "Test Portfolio",
                userId: "test-user",
            })
            .returning("stratify.portfolios.id as id")
            .executeTakeFirstOrThrow();

        await db
            .insertInto("stratify.trades")
            .values([
                {
                    portfolioId: portfolio.id,
                    assetId: "AAPL",
                    assetCountryId: 224,
                    quantity: 5,
                    pricePerShare: 150,
                    totalAmount: 750,
                    assetCurrencyTotalAmount: 800,
                    tradeAction: "BUY",
                    tradeDate: new Date("2026-02-02"),
                },
                {
                    portfolioId: portfolio.id,
                    assetId: "AAPL",
                    assetCountryId: 224,
                    quantity: 10,
                    pricePerShare: 150,
                    totalAmount: 1500,
                    assetCurrencyTotalAmount: 1600,
                    tradeAction: "BUY",
                    tradeDate: new Date("2026-02-03"),
                },
                {
                    portfolioId: portfolio.id,
                    assetId: "LEON",
                    assetCountryId: 224,
                    quantity: 20,
                    pricePerShare: 50,
                    totalAmount: 1000,
                    assetCurrencyTotalAmount: 1100,
                    tradeAction: "BUY",
                    tradeDate: new Date("2026-02-04"),
                },
            ])
            .execute();

        const response = await app.inject({
            method: "GET",
            url: `/portfolios/${portfolio.id}/investments`,
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(200);

        const json = await response.json();

        expect(json).toEqual({
            data: [
                {
                    symbol: "LEON",
                    assetCountryId: 224,
                    name: "Leonida Inc.",
                    shares: 20,
                    type: "STOCK",
                    currentValue: 2219.2,
                    currentAssetCurrencyValue: 3040,
                    currentReturn: 1489.2,
                    currentReturnPercentage: 204,
                },
                {
                    symbol: "AAPL",
                    assetCountryId: 224,
                    name: "Apple Inc.",
                    shares: 15,
                    type: "STOCK",
                    currentValue: 1664.4,
                    currentAssetCurrencyValue: 2280,
                    currentReturn: 21.9,
                    currentReturnPercentage: 1.33,
                },
            ],
        });
    });

    it("should return a list of investments where the asset currency is the same as the user's currency without performing currency conversion", async () => {
        mockGetCurrentPrice.mockResolvedValue(mockAssetPriceResponse);

        await createUser("test-user").execute();

        await db
            .insertInto("stratify.assets")
            .values([
                {
                    name: "British Company",
                    symbol: "BRIT",
                    currency: "GBP",
                    type: "STOCK",
                    countryId: 223, // Country ID for united states
                },
                {
                    name: "Cheese Company",
                    symbol: "CHEESE",
                    currency: "GBP",
                    type: "STOCK",
                    countryId: 223, // Country ID for united states
                },
            ])
            .execute();

        const portfolio = await db
            .insertInto("stratify.portfolios")
            .values({
                name: "British Stocks",
                userId: "test-user",
            })
            .returning("stratify.portfolios.id as id")
            .executeTakeFirstOrThrow();

        await db
            .insertInto("stratify.trades")
            .values([
                {
                    portfolioId: portfolio.id,
                    assetId: "BRIT",
                    assetCountryId: 223,
                    quantity: 5,
                    pricePerShare: 150,
                    totalAmount: 750,
                    tradeAction: "BUY",
                    tradeDate: new Date("2026-02-02"),
                },
                {
                    portfolioId: portfolio.id,
                    assetId: "BRIT",
                    assetCountryId: 223,
                    quantity: 10,
                    pricePerShare: 150,
                    totalAmount: 1500,
                    tradeAction: "BUY",
                    tradeDate: new Date("2026-02-03"),
                },
                {
                    portfolioId: portfolio.id,
                    assetId: "CHEESE",
                    assetCountryId: 223,
                    quantity: 5,
                    pricePerShare: 100,
                    totalAmount: 500,
                    tradeAction: "BUY",
                    tradeDate: new Date("2026-02-05"),
                },
            ])
            .execute();

        const response = await app.inject({
            method: "GET",
            url: `/portfolios/${portfolio.id}/investments`,
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(200);

        const json = await response.json();

        expect(json).toEqual({
            data: [
                {
                    symbol: "BRIT",
                    assetCountryId: 223,
                    name: "British Company",
                    shares: 15,
                    type: "STOCK",
                    currentValue: 2280,
                    currentAssetCurrencyValue: null,
                    currentReturn: 30,
                    currentReturnPercentage: 1.33,
                },
                {
                    symbol: "CHEESE",
                    assetCountryId: 223,
                    name: "Cheese Company",
                    shares: 5,
                    type: "STOCK",
                    currentValue: 760,
                    currentAssetCurrencyValue: null,
                    currentReturn: 260,
                    currentReturnPercentage: 52,
                },
            ],
        });
    });

    it("should not count SELL trades towards the total shares and returns of an investment", async () => {
        mockGetCurrentPrice.mockResolvedValue(mockAssetPriceResponse);

        await createUser("test-user").execute();

        await db
            .insertInto("stratify.assets")
            .values([
                {
                    name: "British Company",
                    symbol: "BRIT",
                    currency: "GBP",
                    type: "STOCK",
                    countryId: 223, // Country ID for united states
                },
                {
                    name: "Cheese Company",
                    symbol: "CHEESE",
                    currency: "GBP",
                    type: "STOCK",
                    countryId: 223, // Country ID for united states
                },
            ])
            .execute();

        const portfolio = await db
            .insertInto("stratify.portfolios")
            .values({
                name: "British Stocks",
                userId: "test-user",
            })
            .returning("stratify.portfolios.id as id")
            .executeTakeFirstOrThrow();

        await db
            .insertInto("stratify.trades")
            .values([
                {
                    portfolioId: portfolio.id,
                    assetId: "BRIT",
                    assetCountryId: 223,
                    quantity: 15,
                    pricePerShare: 150,
                    totalAmount: 2250,
                    tradeAction: "BUY",
                    tradeDate: new Date("2026-02-02"),
                },
                {
                    portfolioId: portfolio.id,
                    assetId: "BRIT",
                    assetCountryId: 223,
                    quantity: 5,
                    pricePerShare: 170,
                    totalAmount: 850,
                    tradeAction: "SELL",
                    tradeDate: new Date("2026-02-03"),
                },
            ])
            .execute();

        const response = await app.inject({
            method: "GET",
            url: `/portfolios/${portfolio.id}/investments`,
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(200);

        const json = await response.json();

        expect(json).toEqual({
            data: [
                {
                    symbol: "BRIT",
                    assetCountryId: 223,
                    name: "British Company",
                    shares: 10,
                    type: "STOCK",
                    currentValue: 1520,
                    currentAssetCurrencyValue: null,
                    currentReturn: 120,
                    currentReturnPercentage: 8.57,
                },
            ],
        });
    });

    it("should return a 404 error if there are no investments in the portfolio", async () => {
        await createUser("test-user").execute();

        const portfolio = await db
            .insertInto("stratify.portfolios")
            .values({
                name: "Empty Portfolio",
                userId: "test-user",
            })
            .returning("stratify.portfolios.id as id")
            .executeTakeFirstOrThrow();

        const response = await app.inject({
            method: "GET",
            url: `/portfolios/${portfolio.id}/investments`,
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(404);

        const json = await response.json();

        expect(json).toEqual({
            message: "investmentsNotFound",
        });
    });

    it("should return a 404 error if portfolio doesn't exist", async () => {
        await createUser("test-user").execute();

        const response = await app.inject({
            method: "GET",
            url: `/portfolios/9999/investments`,
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(404);
    });

    it("should not allow a user to get the investments of another user's portfolio", async () => {
        mockGetCurrentPrice.mockResolvedValue(mockAssetPriceResponse);

        await createUser("test-user").execute();
        await createUser("another-test-user").execute();

        await db
            .insertInto("stratify.assets")
            .values({
                name: "Apple Inc.",
                symbol: "AAPL",
                currency: "USD",
                type: "STOCK",
                countryId: 224, // Country ID for united states
            })
            .execute();

        await db
            .insertInto("stratify.assetPrices")
            .values([
                {
                    assetId: "USDGBP",
                    countryId: 224,
                    priceDate: new Date(),
                    lowPrice: 0.75,
                    highPrice: 0.77,
                    openPrice: 0.76,
                    closePrice: 0.73,
                    volume: 0,
                },
            ])
            .execute();

        const portfolio = await db
            .insertInto("stratify.portfolios")
            .values({
                name: "Another User's Portfolio",
                userId: "test-user",
            })
            .returning("stratify.portfolios.id as id")
            .executeTakeFirstOrThrow();

        const response = await app.inject({
            method: "GET",
            url: `/portfolios/${portfolio.id}/investments`,
            headers: {
                Authorization: secondDevToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(404);
    });
});
