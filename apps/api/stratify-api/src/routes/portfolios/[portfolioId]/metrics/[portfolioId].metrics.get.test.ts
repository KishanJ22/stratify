import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import loadMockApp from "../../../../__mocks__/mockApp.js";
import db from "../../../../database/db.js";
import { createUser } from "../../../../tests/create-user.js";
import { generateDevToken } from "../../../../utils/generateDevToken.js";
import { mockHistoricAssetPrices } from "../_mocks/mockHistoricAssetPrices.js";

const mockAssetPriceResponse = {
    data: {
        data: {
            currentPrice: 150,
            change: 2.5,
            changePercent: 1.69,
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

describe("GET /portfolios/:portfolioId/metrics", () => {
    let devToken = "";

    let secondDevToken = "";

    let app: any;

    const now = new Date();

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

    it("should return the metrics for a portfolio successfully", async () => {
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
                    id: 2,
                    name: "Leonida Inc.",
                    symbol: "LEON",
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
            .values(mockHistoricAssetPrices)
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
                    assetCurrencyTotalAmount: 500,
                    tradeAction: "BUY",
                    tradeDate: new Date(new Date().setDate(now.getMonth() - 1)),
                },
                {
                    portfolioId: portfolio.id,
                    assetId: 1,
                    quantity: 10,
                    pricePerShare: 100,
                    totalAmount: 1000,
                    assetCurrencyTotalAmount: 1000,
                    tradeAction: "BUY",
                    tradeDate: new Date(new Date().setDate(now.getMonth() - 1)),
                },
                {
                    portfolioId: portfolio.id,
                    assetId: 2,
                    quantity: 10,
                    pricePerShare: 80,
                    totalAmount: 800,
                    assetCurrencyTotalAmount: 880,
                    tradeAction: "BUY",
                    tradeDate: new Date(new Date().setDate(now.getMonth() - 1)),
                },
            ])
            .execute();

        await db
            .insertInto("stratify.assetPrices")
            .values([
                {
                    priceDate: new Date(),
                    lowPrice: 0.75,
                    highPrice: 0.77,
                    openPrice: 0.76,
                    closePrice: 0.73,
                    volume: 0,
                },
            ])
            .execute();

        const response = await app.inject({
            method: "GET",
            url: `/portfolios/${portfolio.id}/metrics`,
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(200);

        const json = await response.json().data;

        expect(json).toEqual({
            totalValue: 2737.5,
            overallReturn: {
                absolute: 437.5,
                percentage: 19.02,
            },
            riskMetrics: {
                volatility: 27.18,
                sortinoRatio: 2.4,
                riskLevel: "medium",
            },
        });
    });

    it("should return a 404 not found error if the portfolio does not exist", async () => {
        const response = await app.inject({
            method: "GET",
            url: `/portfolios/9999/metrics`,
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(404);

        const json = await response.json();

        expect(json).toEqual({
            message: "portfolioNotFound",
        });
    });

    it("should return a 404 not found error if the portfolio exists but has no investments", async () => {
        await createUser("test-user").execute();
        await createUser("another-test-user").execute();

        const portfolio = await db
            .insertInto("stratify.portfolios")
            .values({
                name: "Test Portfolio",
                userId: "test-user",
            })
            .returning("stratify.portfolios.id as id")
            .executeTakeFirstOrThrow();

        const response = await app.inject({
            method: "GET",
            url: `/portfolios/${portfolio.id}/metrics`,
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(404);

        const json = await response.json();

        expect(json).toEqual({
            message: "metricsNotFound",
        });
    });

    it("should return a 404 not found error if the portfolio does not belong to the user", async () => {
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
                    id: 2,
                    name: "Leonida Inc.",
                    symbol: "LEON",
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
            .values(mockHistoricAssetPrices)
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
                    assetCurrencyTotalAmount: 500,
                    tradeAction: "BUY",
                    tradeDate: new Date(new Date().setDate(now.getMonth() - 1)),
                },
                {
                    portfolioId: portfolio.id,
                    assetId: 1,
                    quantity: 10,
                    pricePerShare: 100,
                    totalAmount: 1000,
                    assetCurrencyTotalAmount: 1000,
                    tradeAction: "BUY",
                    tradeDate: new Date(new Date().setDate(now.getMonth() - 1)),
                },
                {
                    portfolioId: portfolio.id,
                    assetId: 2,
                    quantity: 10,
                    pricePerShare: 80,
                    totalAmount: 800,
                    assetCurrencyTotalAmount: 880,
                    tradeAction: "BUY",
                    tradeDate: new Date(new Date().setDate(now.getMonth() - 1)),
                },
            ])
            .execute();

        await db
            .insertInto("stratify.assetPrices")
            .values([
                {
                    priceDate: new Date(),
                    lowPrice: 0.75,
                    highPrice: 0.77,
                    openPrice: 0.76,
                    closePrice: 0.73,
                    volume: 0,
                },
            ])
            .execute();

        const response = await app.inject({
            method: "GET",
            url: `/portfolios/${portfolio.id}/metrics`,
            headers: {
                Authorization: secondDevToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(404);

        const json = await response.json();

        expect(json).toEqual({
            message: "portfolioNotFound",
        });
    });
});
