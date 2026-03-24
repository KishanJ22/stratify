import loadMockApp from "../../__mocks__/mockApp.js";
import { describe, beforeAll, expect, it } from "vitest";
import { createUser } from "../../tests/create-user.js";
import db from "../../database/db.js";
import { generateDevToken } from "../../utils/generateDevToken.js";

describe("POST /portfolios", () => {
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

    it("should create a new portfolio for the user and return a success response", async () => {
        await createUser("test-user").execute();

        const response = await app.inject({
            method: "POST",
            url: "/portfolios",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
            body: {
                name: "test portfolio",
            },
        });

        const json = await response.json();

        expect(response.statusCode).toBe(201);

        expect(json).toEqual({
            data: {
                portfolioId: expect.any(Number),
            },
        });
    });

    it("should not create a portfolio with a name that already exists and return a 400 error", async () => {
        await createUser("test-user").execute();

        await db
            .insertInto("stratify.portfolios")
            .values({
                name: "my main portfolio",
                userId: "test-user",
            })
            .execute();

        const response = await app.inject({
            method: "POST",
            url: "/portfolios",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
            body: {
                name: "my main portfolio",
            },
        });

        const json = await response.json();

        expect(response.statusCode).toBe(400);

        expect(json).toEqual({
            message: "portfolioNameAlreadyExists",
        });
    });

    it("should create multiple portfolios with different names for the same user", async () => {
        await createUser("test-user").execute();

        const firstPortfolioResponse = await app.inject({
            method: "POST",
            url: "/portfolios",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
            body: { name: "my main portfolio" },
        });

        const firstPortfolioJson = await firstPortfolioResponse.json();

        expect(firstPortfolioResponse.statusCode).toBe(201);

        expect(firstPortfolioJson).toEqual({
            data: {
                portfolioId: expect.any(Number),
            },
        });

        const secondPortfolioResponse = await app.inject({
            method: "POST",
            url: "/portfolios",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
            body: { name: "my secondary portfolio" },
        });

        const secondPortfolioJson = await secondPortfolioResponse.json();

        expect(secondPortfolioResponse.statusCode).toBe(201);
        expect(secondPortfolioJson).toEqual({
            data: {
                portfolioId: expect.any(Number),
            },
        });
    });

    it("should not create another portfolio with the same name but different casing for the same user", async () => {
        await createUser("test-user").execute();

        const firstPortfolioResponse = await app.inject({
            method: "POST",
            url: "/portfolios",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
            body: { name: "my main portfolio" },
        });

        const firstPortfolioJson = await firstPortfolioResponse.json();

        expect(firstPortfolioResponse.statusCode).toBe(201);

        expect(firstPortfolioJson).toEqual({
            data: {
                portfolioId: expect.any(Number),
            },
        });

        const secondPortfolioResponse = await app.inject({
            method: "POST",
            url: "/portfolios",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
            body: { name: "my Main portfolio" },
        });

        const secondPortfolioJson = await secondPortfolioResponse.json();

        expect(secondPortfolioResponse.statusCode).toBe(400);
        expect(secondPortfolioJson).toEqual({
            message: "portfolioNameAlreadyExists",
        });
    });

    it("should create portfolios with the same name for different users", async () => {
        await createUser("test-user").execute();
        await createUser("another-test-user").execute();

        const firstPortfolioResponse = await app.inject({
            method: "POST",
            url: "/portfolios",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
            body: { name: "my main portfolio" },
        });

        const firstPortfolioJson = await firstPortfolioResponse.json();

        expect(firstPortfolioResponse.statusCode).toBe(201);

        expect(firstPortfolioJson).toEqual({
            data: {
                portfolioId: expect.any(Number),
            },
        });

        const secondPortfolioResponse = await app.inject({
            method: "POST",
            url: "/portfolios",
            headers: {
                Authorization: secondDevToken,
                Accept: "application/json",
            },
            body: { name: "my main portfolio" },
        });

        const secondPortfolioJson = await secondPortfolioResponse.json();

        expect(secondPortfolioResponse.statusCode).toBe(201);
        expect(secondPortfolioJson).toEqual({
            data: {
                portfolioId: expect.any(Number),
            },
        });
    });
});
