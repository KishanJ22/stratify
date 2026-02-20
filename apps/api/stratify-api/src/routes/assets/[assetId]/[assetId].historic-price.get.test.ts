import loadMockApp from "../../../__mocks__/mockApp.js";
import { describe, beforeAll, expect, it } from "vitest";
import { createUser } from "../../../tests/create-user.js";
import db from "../../../database/db.js";
import { generateDevToken } from "../../../utils/generateDevToken.js";

describe("GET /assets/:assetId/historic-price", () => {
    let devToken = "";

    let app: any;

    beforeAll(async () => {
        devToken = await generateDevToken({ userId: "test-user" });

        app = await loadMockApp();
    });

    it("should retrieve the historic price for a given asset and trade date", async () => {
        await createUser("test-user").execute();

        await db
            .insertInto("stratify.assets")
            .values({
                id: 1,
                name: "Apple Inc.",
                symbol: "AAPL",
                type: "STOCK",
                countryId: 224,
            })
            .execute();

        await db
            .insertInto("stratify.assetPrices")
            .values({
                assetId: 1,
                priceDate: new Date("2026-01-01"),
                openPrice: "100.00",
                closePrice: "115.00",
                highPrice: "120.00",
                lowPrice: "95.00",
                volume: 1000000,
            })
            .execute();

        const response = await app.inject({
            method: "GET",
            url: "/assets/1/historic-price?tradeDate=2026-01-01",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        const json = await response.json();

        expect(response.statusCode).toBe(200);

        expect(json).toEqual({
            data: {
                price: "115.00",
            },
        });
    });

    it("should return a 404 not found error when an asset price is not found", async () => {
        await createUser("test-user").execute();

        const response = await app.inject({
            method: "GET",
            url: "/assets/2/historic-price?tradeDate=2026-01-01",
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
