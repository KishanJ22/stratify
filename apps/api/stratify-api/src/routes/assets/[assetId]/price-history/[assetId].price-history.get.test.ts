import { describe, beforeAll, expect, it } from "vitest";
import loadMockApp from "../../../../__mocks__/mockApp.js";
import { generateDevToken } from "../../../../utils/generateDevToken.js";
import { createUser } from "../../../../tests/create-user.js";
import db from "../../../../database/db.js";

describe("GET /assets/:assetId/price-history", () => {
    let app: any;
    let devToken = "";

    beforeAll(async () => {
        devToken = await generateDevToken({ userId: "test-user" });
        app = await loadMockApp();
    });

    it("should retrieve the price history for an asset successfully", async () => {
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

        await db
            .insertInto("stratify.assetPrices")
            .values([
                {
                    assetId: 1,
                    priceDate: "2026-01-01",
                    openPrice: 150,
                    closePrice: 155,
                    highPrice: 160,
                    lowPrice: 148,
                    volume: 1000000,
                },
                {
                    assetId: 1,
                    priceDate: "2026-01-02",
                    openPrice: 155,
                    closePrice: 158,
                    highPrice: 162,
                    lowPrice: 154,
                    volume: 1200000,
                },
            ])
            .execute();

        const response = await app.inject({
            method: "GET",
            url: "/assets/1/price-history",
            headers: {
                Authorization: devToken,
            },
        });

        expect(response.statusCode).toBe(200);

        const data = await response.json().data;

        expect(data).toEqual([
            {
                date: "2026-01-01",
                priceDetails: {
                    open: 150,
                    close: 155,
                    high: 160,
                    low: 148,
                },
            },
            {
                date: "2026-01-02",
                priceDetails: {
                    open: 155,
                    close: 158,
                    high: 162,
                    low: 154,
                },
            },
        ]);
    });

    it("should return a 404 not found error if the asset cannot be found", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/assets/999/price-history",
            headers: {
                Authorization: devToken,
            },
        });

        expect(response.statusCode).toBe(404);
        const responseBody = await response.json();
        expect(responseBody).toEqual({ message: "assetNotFound" });
    });
});
