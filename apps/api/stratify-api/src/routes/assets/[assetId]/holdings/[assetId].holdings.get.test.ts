import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import loadMockApp from "../../../../__mocks__/mockApp.js";
import db from "../../../../database/db.js";
import { createUser } from "../../../../tests/create-user.js";
import { generateDevToken } from "../../../../utils/generateDevToken.js";

const mockAssetPriceResponse = {
    data: {
        data: {
            currentPrice: 152,
        },
    },
};

const mockGetCurrentPrice = vi.fn().mockResolvedValue(mockAssetPriceResponse);

const mockDataApiClient = {
    GET: mockGetCurrentPrice,
};

vi.mock("../../../../lib/api/data-api-client", () => ({
    dataApiClient: () => mockDataApiClient,
}));

describe("GET /assets/:assetId/holdings", () => {
    let devToken = "";

    let secondDevToken = "";

    let app: any;

    beforeAll(async () => {
        devToken = await generateDevToken({ userId: "test-user" });
        secondDevToken = await generateDevToken({
            userId: "another-test-user",
        });

        app = await loadMockApp();
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return the holdings for an asset successfully", async () => {
        await createUser("test-user").execute();

        await db
            .insertInto("stratify.assets")
            .values([
                {
                    id: 1,
                    name: "Apple Inc.",
                    symbol: "AAPL",
                    currency: "USD",
                    type: "STOCK",
                    countryId: 224, // Country ID for united states
                },
                {
                    id: 3,
                    name: "USD/GBP",
                    symbol: "USDGBP",
                    currency: "USD",
                    type: "CURRENCY",
                    countryId: 224, // Country ID for united states
                },
            ])
            .execute();

        await db
            .insertInto("stratify.assetPrices")
            .values([
                {
                    assetId: 3,
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
                    assetId: 1,
                    quantity: 5,
                    pricePerShare: 100,
                    totalAmount: 500,
                    assetCurrencyTotalAmount: 550,
                    tradeAction: "BUY",
                    tradeDate: new Date("2026-02-02"),
                },
                {
                    portfolioId: portfolio.id,
                    assetId: 1,
                    quantity: 10,
                    pricePerShare: 100,
                    totalAmount: 1000,
                    assetCurrencyTotalAmount: 1100,
                    tradeAction: "BUY",
                    tradeDate: new Date("2026-02-03"),
                },
            ])
            .execute();

        const response = await app.inject({
            method: "GET",
            url: "/assets/1/holdings",
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
                    shares: 15,
                    currentValue: 1664.4,
                    currentValueAssetCurrency: 2280,
                    averagePricePerShare: 100,
                    averagePricePerShareAssetCurrency: 110,
                    currentReturn: 164.4,
                    currentReturnPercentage: 10.96,
                    totalBuyAmount: 1500,
                    totalBuyAmountAssetCurrency: 1650,
                    portfolioId: portfolio.id,
                },
            ],
        });
    });

    it("should return a list of investments where the asset currency is the same as the user's currency without performing currency conversion", async () => {
        await createUser("test-user").execute();

        await db
            .insertInto("stratify.assets")
            .values([
                {
                    id: 2,
                    name: "British Company",
                    symbol: "BRIT",
                    currency: "GBP",
                    type: "STOCK",
                    countryId: 223, // Country ID for united kingdom
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
                    assetId: 2,
                    quantity: 5,
                    pricePerShare: 150,
                    totalAmount: 750,
                    tradeAction: "BUY",
                    tradeDate: new Date("2026-02-02"),
                },
                {
                    portfolioId: portfolio.id,
                    assetId: 2,
                    quantity: 10,
                    pricePerShare: 150,
                    totalAmount: 1500,
                    tradeAction: "BUY",
                    tradeDate: new Date("2026-02-03"),
                },
            ])
            .execute();

        const response = await app.inject({
            method: "GET",
            url: "/assets/2/holdings",
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
                    shares: 15,
                    currentValue: 2280,
                    currentValueAssetCurrency: null,
                    averagePricePerShare: 150,
                    averagePricePerShareAssetCurrency: null,
                    currentReturn: 30,
                    currentReturnPercentage: 1.33,
                    totalBuyAmount: 2250,
                    totalBuyAmountAssetCurrency: null,
                    portfolioId: portfolio.id,
                },
            ],
        });
    });

    it("should return a 404 error if no holdings are found for an asset", async () => {
        await createUser("test-user").execute();

        await db
            .insertInto("stratify.portfolios")
            .values({
                name: "Empty Portfolio",
                userId: "test-user",
            })
            .returning("stratify.portfolios.id as id")
            .executeTakeFirstOrThrow();

        await db
            .insertInto("stratify.assets")
            .values([
                {
                    id: 1,
                    name: "Apple Inc.",
                    symbol: "AAPL",
                    currency: "USD",
                    type: "STOCK",
                    countryId: 224, // Country ID for united states
                },
            ])
            .execute();

        const response = await app.inject({
            method: "GET",
            url: "/assets/1/holdings",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(404);

        const json = await response.json();

        expect(json).toEqual({
            message: "assetHoldingsNotFound",
        });
    });

    it("should not allow a user to get the investments of another user's portfolio", async () => {
        await createUser("test-user").execute();
        await createUser("another-test-user").execute();

        await db
            .insertInto("stratify.assets")
            .values([
                {
                    id: 1,
                    name: "Apple Inc.",
                    symbol: "AAPL",
                    currency: "USD",
                    type: "STOCK",
                    countryId: 224, // Country ID for united states
                },
                {
                    id: 2,
                    name: "USDGBP",
                    symbol: "USDGBP",
                    currency: "USD",
                    type: "CURRENCY",
                    countryId: 224, // Country ID for united states
                },
            ])
            .execute();

        await db
            .insertInto("stratify.assetPrices")
            .values([
                {
                    assetId: 2,
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

        await db
            .insertInto("stratify.trades")
            .values([
                {
                    portfolioId: portfolio.id,
                    assetId: 1,
                    quantity: 5,
                    pricePerShare: 150,
                    totalAmount: 750,
                    tradeAction: "BUY",
                    tradeDate: new Date("2026-02-02"),
                },
                {
                    portfolioId: portfolio.id,
                    assetId: 1,
                    quantity: 10,
                    pricePerShare: 150,
                    totalAmount: 1500,
                    tradeAction: "BUY",
                    tradeDate: new Date("2026-02-03"),
                },
            ])
            .execute();

        const response = await app.inject({
            method: "GET",
            url: "/assets/1/holdings",
            headers: {
                Authorization: secondDevToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(404);
    });
});
