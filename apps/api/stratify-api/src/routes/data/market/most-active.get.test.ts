import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import loadMockApp from "../../../__mocks__/mockApp.js";
import { mockDataResponse } from "./_mocks/mock-data-response.js";
import db from "../../../database/db.js";
import { createUser } from "../../../tests/create-user.js";
import type { TopAsset } from "./top-assets-schema.js";
import { generateDevToken } from "../../../utils/generateDevToken.js";

const mockMostActivesDataGet = vi.fn();

const mockDataApiClient = {
    GET: mockMostActivesDataGet,
};

vi.mock("../../../lib/api/data-api-client.js", () => ({
    dataApiClient: () => mockDataApiClient,
}));

describe("GET /data/market/most-active", () => {
    let devToken = "";

    let app: any;

    beforeAll(async () => {
        devToken = await generateDevToken({ userId: "test-user" });

        app = await loadMockApp();
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return the most active assets in the market and a 200 status", async () => {
        await createUser("test-user").execute();

        mockMostActivesDataGet.mockResolvedValue(mockDataResponse);

        await db
            .insertInto("stratify.assets")
            .values([
                {
                    symbol: "ABC",
                    name: "ABC company",
                    type: "STOCK",
                    countryId: 223,
                    currency: "GBP",
                },
                {
                    symbol: "DEF",
                    name: "DEF company",
                    type: "STOCK",
                    countryId: 223,
                    currency: "GBP",
                },
                {
                    symbol: "ABCD",
                    name: "ABCD company",
                    type: "STOCK",
                    countryId: 224,
                    currency: "USD",
                },
            ])
            .execute();

        const response = await app.inject({
            method: "GET",
            url: "/data/market/most-active",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(200);

        const json = await response.json();
        const data = json.data as TopAsset[];

        expect(data).toHaveLength(3);
        expect(data[0]).toMatchObject({
            symbol: "ABC",
            name: "ABC company",
            currency: "GBP",
            assetType: "STOCK",
            marketState: "POSTPOST",
            priceDetails: {
                currentPrice: 46.55,
                volume: 40,
                priceChange: 26.9614,
                priceChangePercent: 137.63821,
            },
        });
    });

    it("should return a 404 status if there are no most active assets", async () => {
        await createUser("test-user").execute();

        mockMostActivesDataGet.mockResolvedValue({ data: { data: [] } });

        const response = await app.inject({
            method: "GET",
            url: "/data/market/most-active",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(404);

        const json = await response.json();
        expect(json).toMatchObject({ message: "noMostActiveAssets" });
    });

    it("should not return assets for which details cannot be found in the db", async () => {
        await createUser("test-user").execute();

        mockMostActivesDataGet.mockResolvedValue(mockDataResponse);

        await db
            .insertInto("stratify.assets")
            .values([
                {
                    symbol: "ABC",
                    name: "ABC company",
                    type: "STOCK",
                    countryId: 223,
                    currency: "GBP",
                },
                {
                    symbol: "DEF",
                    name: "DEF company",
                    type: "STOCK",
                    countryId: 223,
                    currency: "GBP",
                },
            ])
            .execute();

        const response = await app.inject({
            method: "GET",
            url: "/data/market/most-active",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(200);

        const json = await response.json();
        const data = json.data as TopAsset[];

        expect(data).toHaveLength(2);

        data.forEach((asset) => {
            expect("ABCD").not.toBe(asset.symbol);
        });
    });
});
