import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import loadMockApp from "../../../../__mocks__/mockApp.js";
import db from "../../../../database/db.js";
import { createUser } from "../../../../tests/create-user.js";
import { generateDevToken } from "../../../../utils/generateDevToken.js";

const mockAssetPriceResponse = {
    data: {
        data: {
            currentPrice: 15,
            change: 2.5,
            changePercent: 1.55,
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

describe("GET /portfolios/{portfolioId}/value-history", () => {
    let devToken = "";
    let secondDevToken = "";

    let app: any;

    const now = new Date();
    const twoDaysAgo = new Date(new Date().setDate(now.getDate() - 2));

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

    it("should return the value history of a portfolio successfully", async () => {
        await createUser("test-user").execute();

        await db
            .insertInto("stratify.assets")
            .values([
                {
                    id: 1,
                    name: "British Company",
                    symbol: "BRIT",
                    currency: "GBP",
                    type: "STOCK",
                    countryId: 223, // Country ID for United Kingdom
                },
                {
                    id: 2,
                    name: "Cheese Company",
                    symbol: "CHEESE",
                    currency: "GBP",
                    type: "STOCK",
                    countryId: 223, // Country ID for United Kingdom
                },
            ])
            .execute();

        await db
            .insertInto("stratify.assetPrices")
            .values([
                {
                    assetId: 1,
                    priceDate: twoDaysAgo,
                    lowPrice: 10,
                    highPrice: 20,
                    openPrice: 15,
                    closePrice: 20,
                    volume: 1000,
                },
                {
                    assetId: 2,
                    priceDate: twoDaysAgo,
                    lowPrice: 10,
                    highPrice: 20,
                    openPrice: 15,
                    closePrice: 20,
                    volume: 1000,
                },
                {
                    assetId: 1,
                    priceDate: new Date(new Date().setDate(now.getDate() - 1)),
                    lowPrice: 10,
                    highPrice: 20,
                    openPrice: 15,
                    closePrice: 20,
                    volume: 1000,
                },
                {
                    assetId: 2,
                    priceDate: new Date(new Date().setDate(now.getDate() - 1)),
                    lowPrice: 10,
                    highPrice: 20,
                    openPrice: 15,
                    closePrice: 20,
                    volume: 1000,
                },
            ])
            .execute();

        const portfolio = await db
            .insertInto("stratify.portfolios")
            .values({
                name: "My portfolio",
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
                    pricePerShare: 15,
                    totalAmount: 75,
                    tradeAction: "BUY",
                    tradeDate: twoDaysAgo,
                },
                {
                    portfolioId: portfolio.id,
                    assetId: 2,
                    quantity: 10,
                    pricePerShare: 15,
                    totalAmount: 150,
                    tradeAction: "BUY",
                    tradeDate: twoDaysAgo,
                },
                {
                    portfolioId: portfolio.id,
                    assetId: 1,
                    quantity: 5,
                    pricePerShare: 15,
                    totalAmount: 75,
                    tradeAction: "BUY",
                    tradeDate: new Date(new Date().setDate(now.getDate() - 1)),
                },
            ])
            .execute();

        const response = await app.inject({
            method: "GET",
            url: `/portfolios/${portfolio.id}/value-history`,
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(200);
    });

    it("should return a 404 not found error if the portfolio does not exist", async () => {
        const response = await app.inject({
            method: "GET",
            url: `/portfolios/44/value-history`,
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(404);
    });

    it("should return a 404 not found error if the portfolio exists but has no trades", async () => {
        await createUser("test-user").execute();

        const portfolio = await db
            .insertInto("stratify.portfolios")
            .values({
                name: "Empty portfolio",
                userId: "test-user",
            })
            .returning("stratify.portfolios.id as id")
            .executeTakeFirstOrThrow();

        const response = await app.inject({
            method: "GET",
            url: `/portfolios/${portfolio.id}/value-history`,
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(404);
    });

    it("should return a 404 not found error if the portfolio exists and has trades but for another user", async () => {
        await createUser("test-user").execute();
        await createUser("another-test-user").execute();

        await db
            .insertInto("stratify.assets")
            .values([
                {
                    id: 1,
                    name: "British Company",
                    symbol: "BRIT",
                    currency: "GBP",
                    type: "STOCK",
                    countryId: 223, // Country ID for United Kingdom
                },
                {
                    id: 2,
                    name: "Cheese Company",
                    symbol: "CHEESE",
                    currency: "GBP",
                    type: "STOCK",
                    countryId: 223, // Country ID for United Kingdom
                },
            ])
            .execute();

        await db
            .insertInto("stratify.assetPrices")
            .values([
                {
                    assetId: 1,
                    priceDate: twoDaysAgo,
                    lowPrice: 10,
                    highPrice: 20,
                    openPrice: 15,
                    closePrice: 20,
                    volume: 1000,
                },
                {
                    assetId: 2,
                    priceDate: twoDaysAgo,
                    lowPrice: 10,
                    highPrice: 20,
                    openPrice: 15,
                    closePrice: 20,
                    volume: 1000,
                },
                {
                    assetId: 1,
                    priceDate: new Date(new Date().setDate(now.getDate() - 1)),
                    lowPrice: 10,
                    highPrice: 20,
                    openPrice: 15,
                    closePrice: 20,
                    volume: 1000,
                },
                {
                    assetId: 2,
                    priceDate: new Date(new Date().setDate(now.getDate() - 1)),
                    lowPrice: 10,
                    highPrice: 20,
                    openPrice: 15,
                    closePrice: 20,
                    volume: 1000,
                },
            ])
            .execute();

        const portfolio = await db
            .insertInto("stratify.portfolios")
            .values({
                name: "My portfolio",
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
                    pricePerShare: 15,
                    totalAmount: 75,
                    tradeAction: "BUY",
                    tradeDate: twoDaysAgo,
                },
                {
                    portfolioId: portfolio.id,
                    assetId: 2,
                    quantity: 10,
                    pricePerShare: 15,
                    totalAmount: 150,
                    tradeAction: "BUY",
                    tradeDate: twoDaysAgo,
                },
                {
                    portfolioId: portfolio.id,
                    assetId: 1,
                    quantity: 5,
                    pricePerShare: 15,
                    totalAmount: 75,
                    tradeAction: "BUY",
                    tradeDate: new Date(new Date().setDate(now.getDate() - 1)),
                },
            ])
            .execute();

        const response = await app.inject({
            method: "GET",
            url: `/portfolios/${portfolio.id}/value-history`,
            headers: {
                Authorization: secondDevToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(404);
    });
});
