import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import loadMockApp from "../../../../__mocks__/mockApp.js";
import db from "../../../../database/db.js";
import { createUser } from "../../../../tests/create-user.js";
import { generateDevToken } from "../../../../utils/generateDevToken.js";

describe("POST /portfolios/:portfolioId/add-trade", () => {
    let devToken = "";
    let secondDevToken = "";

    let app: any;

    beforeAll(async () => {
        app = await loadMockApp();

        devToken = await generateDevToken({ userId: "test-user" });
        secondDevToken = await generateDevToken({
            userId: "another-test-user",
        });
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should add a trade to the user's portfolio successfully", async () => {
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

        const portfolio = await db
            .insertInto("stratify.portfolios")
            .values({
                userId: "test-user",
                name: "Test Portfolio",
            })
            .returning("stratify.portfolios.id as id")
            .executeTakeFirstOrThrow();

        const response = await app.inject({
            method: "POST",
            url: `/portfolios/${portfolio.id}/add-trade`,
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
            body: {
                assetId: 1,
                tradeAction: "BUY",
                pricePerShare: 150,
                quantity: 10,
                currencyConversionRate: 0.75,
                tradeDate: new Date().toISOString(),
                fee: 0,
                assetCurrencyTotalAmount: 1500,
                totalAmount: 1125,
            },
        });

        const json = await response.json();

        expect(response.statusCode).toBe(201);

        expect(json).toEqual({
            data: {
                success: true,
            },
        });
    });

    it("should return a 404 not found error if the portfolio does not exist", async () => {
        await createUser("test-user").execute();

        const response = await app.inject({
            method: "POST",
            url: `/portfolios/9999/add-trade`,
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
            body: {
                assetId: 1,
                tradeAction: "BUY",
                pricePerShare: 150,
                quantity: 10,
                currencyConversionRate: 0.75,
                tradeDate: new Date().toISOString(),
                fee: 0,
                assetCurrencyTotalAmount: 1500,
                totalAmount: 1125,
            },
        });

        const json = await response.json();

        expect(response.statusCode).toBe(404);

        expect(json).toEqual({
            message: "portfolioNotFound",
        });
    });

    it("should return a 404 not found error if the portfolio does not belong to the user", async () => {
        await createUser("test-user").execute();
        await createUser("another-test-user").execute();

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

        const portfolio = await db
            .insertInto("stratify.portfolios")
            .values({
                userId: "test-user",
                name: "Test Portfolio",
            })
            .returning("stratify.portfolios.id as id")
            .executeTakeFirstOrThrow();

        const response = await app.inject({
            method: "POST",
            url: `/portfolios/${portfolio.id}/add-trade`,
            headers: {
                Authorization: secondDevToken,
                Accept: "application/json",
            },
            body: {
                assetId: 1,
                tradeAction: "BUY",
                pricePerShare: 150,
                quantity: 10,
                currencyConversionRate: 0.75,
                tradeDate: new Date().toISOString(),
                fee: 0,
                assetCurrencyTotalAmount: 1500,
                totalAmount: 1125,
            },
        });

        const json = await response.json();

        expect(response.statusCode).toBe(404);

        expect(json).toEqual({
            message: "portfolioNotFound",
        });
    });

    it("should return a 400 error if the user tries to sell more shares than they currently hold", async () => {
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

        const portfolio = await db
            .insertInto("stratify.portfolios")
            .values({
                userId: "test-user",
                name: "Test Portfolio",
            })
            .returning("stratify.portfolios.id as id")
            .executeTakeFirstOrThrow();

        await db
            .insertInto("stratify.trades")
            .values({
                portfolioId: portfolio.id,
                tradeAction: "BUY",
                assetId: 1,
                pricePerShare: 150,
                quantity: 10,
                tradeDate: new Date(),
                fee: 0,
                totalAmount: 1125,
                assetCurrencyTotalAmount: 1500,
            })
            .execute();

        const response = await app.inject({
            method: "POST",
            url: `/portfolios/${portfolio.id}/add-trade`,
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
            body: {
                assetId: 1,
                tradeAction: "SELL",
                pricePerShare: 150,
                quantity: 15, // Trying to sell more than the 10 shares currently held
                currencyConversionRate: 0.75,
                tradeDate: new Date().toISOString(),
                fee: 0,
                assetCurrencyTotalAmount: 2250,
                totalAmount: 1687.5,
            },
        });

        const json = await response.json();

        expect(response.statusCode).toBe(400);

        expect(json).toEqual({
            message: "cannotSellMoreThanHeld",
        });
    });
});
