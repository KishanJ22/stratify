import loadMockApp from "../../../__mocks__/mockApp.js";
import { describe, beforeAll, expect, it } from "vitest";
import { createUser } from "../../../tests/create-user.js";
import db from "../../../database/db.js";
import { generateDevToken } from "../../../utils/generateDevToken.js";

describe("GET /currencies/:currencyPair/historic-price", () => {
    let devToken = "";

    let app: any;

    beforeAll(async () => {
        devToken = await generateDevToken({ userId: "test-user" });
        app = await loadMockApp();
    });

    it("should retrieve the historic price for a given currency pair and trade date", async () => {
        createUser("test-user").execute();

        await db
            .insertInto("stratify.assets")
            .values({
                id: 1,
                name: "USDGBP",
                symbol: "USDGBP",
                type: "CURRENCY",
                countryId: 224,
            })
            .execute();

        await db
            .insertInto("stratify.assetPrices")
            .values({
                assetId: 1,
                priceDate: new Date("2026-01-01"),
                openPrice: "0.75",
                highPrice: "0.81",
                lowPrice: "0.70",
                closePrice: "0.78",
                volume: 0,
            })
            .execute();

        const response = await app.inject({
            method: "GET",
            url: "/currencies/USDGBP/historic-price?tradeDate=2026-01-01",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        const json = await response.json();

        expect(response.statusCode).toBe(200);

        expect(json).toEqual({
            data: {
                price: 0.78,
            },
        });
    });

    it("should return 404 not found error when the price for a currency pair and trade date is not found", async () => {
        createUser("test-user").execute();

        const response = await app.inject({
            method: "GET",
            url: "/currencies/USDGBP/historic-price?tradeDate=2026-01-01",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        const json = await response.json();

        expect(response.statusCode).toBe(404);

        expect(json).toEqual({
            message: "priceNotFound",
        });
    });
});
