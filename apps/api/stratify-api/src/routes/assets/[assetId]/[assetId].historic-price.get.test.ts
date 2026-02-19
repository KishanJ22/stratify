import loadMockApp from "../../../__mocks__/mockApp.js";
import { describe, beforeAll, expect, it } from "vitest";
import { createUser } from "../../../tests/create-user.js";
import db from "../../../database/db.js";

describe("GET /assets/:assetId/historic-price", () => {
    const devToken =
        "Bearer Dev-eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjkwMzQ3NTgsIm5hbWUiOiJ0ZXN0LXVzZXIiLCJlbWFpbCI6InRlc3QtdXNlckB0ZXN0LmNvbSIsImVtYWlsVmVyaWZpZWQiOmZhbHNlLCJpbWFnZSI6bnVsbCwiY3JlYXRlZEF0IjoiMjAyNi0wMS0yMVQyMDo1MjoxMC45MTFaIiwidXBkYXRlZEF0IjoiMjAyNi0wMS0yMVQyMDo1MjoxMC45MTFaIiwidXNlcm5hbWUiOiJ0ZXN0LXVzZXIiLCJkaXNwbGF5VXNlcm5hbWUiOiJ0ZXN0LXVzZXIiLCJ0d29GYWN0b3JFbmFibGVkIjpmYWxzZSwiaWQiOiJ0ZXN0LXVzZXIiLCJzdWIiOiJ0ZXN0LXVzZXIiLCJleHAiOjE3NjkwMzgzNTgsImlzcyI6Imh0dHA6Ly8xMjcuMC4wLjE6MjAwMCIsImF1ZCI6Imh0dHA6Ly8xMjcuMC4wLjE6MjAwMCJ9.4h0c9ETlknvzcvHhQULDfCx5OF0_nlo-S_j0BbXqrdQbkzigNUqeU2E3EC-2YeSBMwJk6ERGar_LJ-sBAtK9DQ";

    let app: any;

    beforeAll(async () => {
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
