import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import loadMockApp from "../../../../__mocks__/mockApp.js";
import db from "../../../../database/db.js";
import { createUser } from "../../../../tests/create-user.js";
import { generateDevToken } from "../../../../utils/generateDevToken.js";
import { mockAssetData } from "../../_mocks/mockAssetData.js";
import { mockHistoricAssetPrices } from "../_mocks/mockHistoricAssetPrices.js";
import { mockTrades } from "../../_mocks/mockTrades.js";

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

describe("GET /portfolios/:portfolioId/metrics", () => {
    let devToken = "";
    let secondDevToken = "";

    let app: any;

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

    it("should return the metrics for a portfolio successfully", async () => {
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
            url: `/portfolios/${portfolio.id}/metrics`,
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(200);

        const json = await response.json().data;

        expect(json).toEqual({
            totalValue: 847.5,
            overallReturn: {
                absolute: 187.5,
                percentage: 28.41,
            },
            riskMetrics: {
                volatility: 17.58,
                sortinoRatio: 9.8,
                riskLevel: "low",
            },
        });
    });

    it("should return a 404 not found error if the portfolio does not exist", async () => {
        const response = await app.inject({
            method: "GET",
            url: `/portfolios/9999/metrics`,
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(404);

        const json = await response.json();

        expect(json).toEqual({
            message: "portfolioNotFound",
        });
    });

    it("should return a 404 not found error if the portfolio exists but has no investments", async () => {
        await createUser("test-user").execute();
        await createUser("another-test-user").execute();

        const portfolio = await db
            .insertInto("stratify.portfolios")
            .values({
                name: "Test Portfolio",
                userId: "test-user",
            })
            .returning("stratify.portfolios.id as id")
            .executeTakeFirstOrThrow();

        const response = await app.inject({
            method: "GET",
            url: `/portfolios/${portfolio.id}/metrics`,
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(404);

        const json = await response.json();

        expect(json).toEqual({
            message: "metricsNotFound",
        });
    });

    it("should return a 404 not found error if the portfolio does not belong to the user", async () => {
        await createUser("test-user").execute();

        const portfolio = await db
            .insertInto("stratify.portfolios")
            .values({
                name: "Test Portfolio",
                userId: "test-user",
            })
            .returning("stratify.portfolios.id as id")
            .executeTakeFirstOrThrow();

        const response = await app.inject({
            method: "GET",
            url: `/portfolios/${portfolio.id}/metrics`,
            headers: {
                Authorization: secondDevToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(404);

        const json = await response.json();

        expect(json).toEqual({
            message: "portfolioNotFound",
        });
    });
});
