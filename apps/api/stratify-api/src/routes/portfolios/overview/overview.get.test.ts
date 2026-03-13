import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import loadMockApp from "../../../__mocks__/mockApp.js";
import db from "../../../database/db.js";
import { createUser } from "../../../tests/create-user.js";
import { generateDevToken } from "../../../utils/generateDevToken.js";
import { mockHistoricAssetPrices } from "../_mocks/mockHistoricAssetPrices.js";
import { mockAssetData } from "../_mocks/mockAssetData.js";
import { mockTrades } from "../_mocks/mockTrades.js";

const mockAssetPriceResponse = {
    data: {
        data: {
            currentPrice: 30,
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

const mockFundSectorDetailsResponse = {
    data: {
        data: {
            sectorWeights: [
                {
                    sector: "technology",
                    weight: 0.6,
                },
                {
                    sector: "financials",
                    weight: 0.4,
                },
            ],
        },
    },
};

const mockFetchFundDetails = vi
    .fn()
    .mockResolvedValue(mockFundSectorDetailsResponse);

const mockDataApiClient = {
    GET: (url: string) => {
        if (url.includes("/current-price")) {
            return mockGetCurrentPrice();
        }

        if (url.includes("/stocks")) {
            return mockFetchStockDetails();
        }

        if (url.includes("/funds")) {
            return mockFetchFundDetails();
        }
    },
};

vi.mock("../../../lib/api/data-api-client", () => ({
    dataApiClient: () => mockDataApiClient,
}));

describe("GET /portfolios/overview", () => {
    let devToken = "";
    let secondDevToken = "";

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

        await db.insertInto("stratify.assets").values(mockAssetData).execute();

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
            .values(mockTrades(portfolio.id))
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

        const data = await response.json().data;

        expect(data).toEqual({
            totalValue: 1425,
            overallChange: {
                allTime: {
                    absolute: 765,
                    percentage: 115.91,
                },
                lastSevenDays: {
                    absolute: 475,
                    percentage: 50,
                },
                lastSixMonths: {
                    absolute: 1225,
                    percentage: 612.5,
                },
                lastThirtyDays: {
                    absolute: 1225,
                    percentage: 612.5,
                },
            },
            investments: [
                {
                    assetId: 1,
                    symbol: "AAPL",
                    assetCountryId: 224,
                    assetCurrency: "USD",
                    name: "Apple Inc.",
                    shares: 15,
                    type: "STOCK",
                    currentValue: 675,
                    currentAssetCurrencyValue: 450,
                    currentReturn: 375,
                    currentReturnPercentage: 125,
                    totalBuyAmount: 300,
                    sectorDetails: [
                        {
                            sector: "technology",
                            weight: 1,
                        },
                    ],
                    portfolioId: portfolio.id,
                },
                {
                    assetId: 2,
                    symbol: "LEON",
                    assetCountryId: 224,
                    assetCurrency: "USD",
                    name: "Leonida Inc.",
                    shares: 10,
                    type: "STOCK",
                    currentValue: 450,
                    currentAssetCurrencyValue: 300,
                    currentReturn: 300,
                    currentReturnPercentage: 200,
                    totalBuyAmount: 150,
                    sectorDetails: [
                        {
                            sector: "technology",
                            weight: 1,
                        },
                    ],
                    portfolioId: portfolio.id,
                },
                {
                    assetId: 4,
                    symbol: "FUND",
                    assetCountryId: 223,
                    assetCurrency: "GBP",
                    name: "A fund",
                    shares: 10,
                    type: "ETF",
                    currentValue: 300,
                    currentAssetCurrencyValue: null,
                    currentReturn: 90,
                    currentReturnPercentage: 42.86,
                    totalBuyAmount: 210,
                    sectorDetails: [
                        {
                            sector: "technology",
                            weight: 0.6,
                        },
                        {
                            sector: "financials",
                            weight: 0.4,
                        },
                    ],
                    portfolioId: portfolio.id,
                },
            ],
        });
    });

    it("should return a 404 not found error if the user has no portfolios", async () => {
        await createUser("test-user").execute();

        const response = await app.inject({
            method: "GET",
            url: "/portfolios/overview",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(404);

        const message = await response.json().message;
        expect(message).toBe("noPortfoliosFound");
    });

    it("should return a 404 not found if the user has a portfolio but no investments", async () => {
        await createUser("test-user").execute();

        await db
            .insertInto("stratify.portfolios")
            .values({
                name: "Test Portfolio",
                userId: "test-user",
            })
            .execute();

        const response = await app.inject({
            method: "GET",
            url: "/portfolios/overview",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(404);

        const message = await response.json().message;
        expect(message).toBe("noInvestmentsFound");
    });
});
