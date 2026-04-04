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

describe("GET /assets/:assetId/current-price", () => {
    let devToken = "";

    let app: any;

    beforeAll(async () => {
        devToken = await generateDevToken({ userId: "test-user" });
        app = await loadMockApp();
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return the current price for a valid asset", async () => {
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
            url: "/assets/1/current-price",
            headers: {
                Authorization: devToken,
            },
        });

        expect(response.statusCode).toBe(200);

        const data = await response.json().data;

        expect(data).toEqual({
            price: 152,
        });
    });

    it("should return 404 if the asset does not exist", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/assets/999/current-price",
            headers: {
                Authorization: devToken,
            },
        });

        expect(response.statusCode).toBe(404);

        const responseMessage = await response.json().message;
        expect(responseMessage).toBe("assetNotFound");
    });

    it("should return 404 if the price is not found", async () => {
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

        mockGetCurrentPrice.mockResolvedValueOnce({
            data: {
                data: {
                    currentPrice: null,
                },
            },
        });

        const response = await app.inject({
            method: "GET",
            url: "/assets/1/current-price",
            headers: {
                Authorization: devToken,
            },
        });

        expect(response.statusCode).toBe(404);

        const responseMessage = await response.json().message;
        expect(responseMessage).toBe("priceNotFound");
    });
});
