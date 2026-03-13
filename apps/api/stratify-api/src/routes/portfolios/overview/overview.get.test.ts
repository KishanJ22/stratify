import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import loadMockApp from "../../../__mocks__/mockApp.js";
import db from "../../../database/db.js";
import { createUser } from "../../../tests/create-user.js";
import { generateDevToken } from "../../../utils/generateDevToken.js";
import { mockHistoricAssetPrices } from "../[portfolioId]/_mocks/mockHistoricAssetPrices.js";

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

const mockSectorDetailsResponse = {
    data: {
        data: {
            industryDetails: {
                sector: "technology",
            },
        },
    },
};

const mockFetchStockDetails = vi
    .fn()
    .mockResolvedValue(mockSectorDetailsResponse);

const mockDataApiClient = {
    GET: (url: string) => {
        if (url.includes("/current-price")) {
            return mockGetCurrentPrice();
        }

        if (url.includes("/stocks")) {
            return mockFetchStockDetails();
        }
    },
};

vi.mock("../../../../lib/api/data-api-client", () => ({
    dataApiClient: () => mockDataApiClient,
}));

describe("GET /portfolios/overview", () => {
    let devToken = "";
    let secondDevToken = "";

    const now = new Date();

    let app: any;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    beforeAll(async () => {
        devToken = await generateDevToken({ userId: "test-user" });
        secondDevToken = await generateDevToken({
            userId: "another-test-user",
        });

        app = await loadMockApp();
    });

    it("should return an overview of all portfolios successfully", async () => {
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

        const response = await app.inject({
            method: "GET",
            url: "/portfolios/overview",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(200);
    });
});
