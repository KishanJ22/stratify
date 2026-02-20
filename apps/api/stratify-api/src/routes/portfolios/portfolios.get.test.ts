import loadMockApp from "../../__mocks__/mockApp.js";
import { describe, beforeAll, expect, it } from "vitest";
import { createUser } from "../../tests/create-user.js";
import db from "../../database/db.js";
import { generateDevToken } from "../../utils/generateDevToken.js";

describe("GET /portfolios", () => {
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

    it("should retrieve the user's portfolios", async () => {
        await createUser("test-user").execute();

        await db
            .insertInto("stratify.portfolios")
            .values([
                { name: "Portfolio 1", userId: "test-user" },
                { name: "Portfolio 2", userId: "test-user" },
            ])
            .execute();

        const response = await app.inject({
            method: "GET",
            url: "/portfolios",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        const json = await response.json();

        expect(response.statusCode).toBe(200);

        expect(json).toEqual({
            data: [
                { name: "Portfolio 1", id: expect.any(Number) },
                { name: "Portfolio 2", id: expect.any(Number) },
            ],
        });
    });

    it("should return a not found error if the user has no portfolios", async () => {
        await createUser("test-user").execute();

        const response = await app.inject({
            method: "GET",
            url: "/portfolios",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        const json = await response.json();

        expect(response.statusCode).toBe(404);

        expect(json).toEqual({
            message: "noPortfoliosFound",
        });
    });

    it("should retrieve portfolios only for the authenticated user", async () => {
        await createUser("test-user").execute();
        await createUser("another-test-user").execute();

        await db
            .insertInto("stratify.portfolios")
            .values([
                { name: "Portfolio 1", userId: "test-user" },
                { name: "Portfolio 2", userId: "test-user" },
            ])
            .execute();

        await db
            .insertInto("stratify.portfolios")
            .values([
                { name: "Portfolio 3", userId: "another-test-user" },
                { name: "Portfolio 4", userId: "another-test-user" },
            ])
            .execute();

        const firstPortfolioListResponse = await app.inject({
            method: "GET",
            url: "/portfolios",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        const firstJson = await firstPortfolioListResponse.json();

        expect(firstPortfolioListResponse.statusCode).toBe(200);

        expect(firstJson).toEqual({
            data: [
                { name: "Portfolio 1", id: expect.any(Number) },
                { name: "Portfolio 2", id: expect.any(Number) },
            ],
        });

        const secondPortfolioListResponse = await app.inject({
            method: "GET",
            url: "/portfolios",
            headers: {
                Authorization: secondDevToken,
                Accept: "application/json",
            },
        });

        const secondJson = await secondPortfolioListResponse.json();

        expect(secondPortfolioListResponse.statusCode).toBe(200);

        expect(secondJson).toEqual({
            data: [
                { name: "Portfolio 3", id: expect.any(Number) },
                { name: "Portfolio 4", id: expect.any(Number) },
            ],
        });
    });
});
