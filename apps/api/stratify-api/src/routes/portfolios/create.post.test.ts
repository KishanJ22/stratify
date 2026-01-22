import loadMockApp from "../../__mocks__/mockApp.js";
import { describe, beforeAll, expect, it } from "vitest";
import db from "../../database/db.js";

describe("POST /portfolios", () => {
    const devToken =
        "Bearer Dev-eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjkwMzQ3NTgsIm5hbWUiOiJ0ZXN0LXVzZXIiLCJlbWFpbCI6InRlc3QtdXNlckB0ZXN0LmNvbSIsImVtYWlsVmVyaWZpZWQiOmZhbHNlLCJpbWFnZSI6bnVsbCwiY3JlYXRlZEF0IjoiMjAyNi0wMS0yMVQyMDo1MjoxMC45MTFaIiwidXBkYXRlZEF0IjoiMjAyNi0wMS0yMVQyMDo1MjoxMC45MTFaIiwidXNlcm5hbWUiOiJ0ZXN0LXVzZXIiLCJkaXNwbGF5VXNlcm5hbWUiOiJ0ZXN0LXVzZXIiLCJ0d29GYWN0b3JFbmFibGVkIjpmYWxzZSwiaWQiOiJ0ZXN0LXVzZXIiLCJzdWIiOiJ0ZXN0LXVzZXIiLCJleHAiOjE3NjkwMzgzNTgsImlzcyI6Imh0dHA6Ly8xMjcuMC4wLjE6MjAwMCIsImF1ZCI6Imh0dHA6Ly8xMjcuMC4wLjE6MjAwMCJ9.4h0c9ETlknvzcvHhQULDfCx5OF0_nlo-S_j0BbXqrdQbkzigNUqeU2E3EC-2YeSBMwJk6ERGar_LJ-sBAtK9DQ";
    let app: any;

    beforeAll(async () => {
        app = await loadMockApp();
    });

    it("should create a new portfolio for the user and return a success response", async () => {
        await db
            .insertInto("auth.user")
            .values({ id: "test-user" } as any)
            .execute();

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
                success: true,
            },
        });
    });

    it("should not create a portfolio with a name that already exists and return a 400 error", async () => {
        await db
            .insertInto("auth.user")
            .values({ id: "test-user" } as any)
            .execute();

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
            data: {
                error: "portfolioNameAlreadyExists",
            },
        });
    });

    it("should create multiple portfolios with different names for the same user", async () => {
        await db
            .insertInto("auth.user")
            .values({ id: "test-user" } as any)
            .execute();

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
                success: true,
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
                success: true,
            },
        });
    });

    it("should not create another portfolio with the same name but different casing for the same user", async () => {
        await db
            .insertInto("auth.user")
            .values({ id: "test-user" } as any)
            .execute();

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
                success: true,
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
            data: {
                error: "portfolioNameAlreadyExists",
            },
        });
    });

    it("should create portfolios with the same name for different users", async () => {
        const secondDevToken =
            "Bearer Dev-eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjkwMzQ3NTgsIm5hbWUiOiJhbm90aGVyLXRlc3QtdXNlciIsImVtYWlsIjoiYW5vdGhlci10ZXN0LXVzZXJAdGVzdC5jb20iLCJlbWFpbFZlcmlmaWVkIjpmYWxzZSwiaW1hZ2UiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjYtMDEtMjFUMjA6NTI6MTAuOTExWiIsInVwZGF0ZWRBdCI6IjIwMjYtMDEtMjFUMjA6NTI6MTAuOTExWiIsInVzZXJuYW1lIjoiYW5vdGhlci10ZXN0LXVzZXIiLCJkaXNwbGF5VXNlcm5hbWUiOiJhbm90aGVyLXRlc3QtdXNlciIsInR3b0ZhY3RvckVuYWJsZWQiOmZhbHNlLCJpZCI6ImFub3RoZXItdGVzdC11c2VyIiwic3ViIjoiYW5vdGhlci10ZXN0LXVzZXIiLCJleHAiOjE3NjkwMzgzNTgsImlzcyI6Imh0dHA6Ly8xMjcuMC4wLjE6MjAwMCIsImF1ZCI6Imh0dHA6Ly8xMjcuMC4wLjE6MjAwMCJ9.loa5vJNiu9uwpmSTilPMCDI4NF2e0GP6ATO7fmQNuRjg-ByCgmJTcAUd-jNY4A2Lkls_VTED07WYEe8SelVRCA";

        await db
            .insertInto("auth.user")
            .values([
                { id: "test-user" } as any,
                { id: "another-test-user" } as any,
            ])
            .execute();

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
                success: true,
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
                success: true,
            },
        });
    });
});
