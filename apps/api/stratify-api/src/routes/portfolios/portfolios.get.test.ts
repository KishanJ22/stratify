import loadMockApp from "../../__mocks__/mockApp.js";
import { describe, beforeAll, expect, it } from "vitest";
import { createUser } from "../../tests/create-user.js";
import db from "../../database/db.js";

describe("GET /portfolios", () => {
    const devToken =
        "Bearer Dev-eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjkwMzQ3NTgsIm5hbWUiOiJ0ZXN0LXVzZXIiLCJlbWFpbCI6InRlc3QtdXNlckB0ZXN0LmNvbSIsImVtYWlsVmVyaWZpZWQiOmZhbHNlLCJpbWFnZSI6bnVsbCwiY3JlYXRlZEF0IjoiMjAyNi0wMS0yMVQyMDo1MjoxMC45MTFaIiwidXBkYXRlZEF0IjoiMjAyNi0wMS0yMVQyMDo1MjoxMC45MTFaIiwidXNlcm5hbWUiOiJ0ZXN0LXVzZXIiLCJkaXNwbGF5VXNlcm5hbWUiOiJ0ZXN0LXVzZXIiLCJ0d29GYWN0b3JFbmFibGVkIjpmYWxzZSwiaWQiOiJ0ZXN0LXVzZXIiLCJzdWIiOiJ0ZXN0LXVzZXIiLCJleHAiOjE3NjkwMzgzNTgsImlzcyI6Imh0dHA6Ly8xMjcuMC4wLjE6MjAwMCIsImF1ZCI6Imh0dHA6Ly8xMjcuMC4wLjE6MjAwMCJ9.4h0c9ETlknvzcvHhQULDfCx5OF0_nlo-S_j0BbXqrdQbkzigNUqeU2E3EC-2YeSBMwJk6ERGar_LJ-sBAtK9DQ";
    const secondDevToken =
        "Bearer Dev-eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjkwMzQ3NTgsIm5hbWUiOiJhbm90aGVyLXRlc3QtdXNlciIsImVtYWlsIjoiYW5vdGhlci10ZXN0LXVzZXJAdGVzdC5jb20iLCJlbWFpbFZlcmlmaWVkIjpmYWxzZSwiaW1hZ2UiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjYtMDEtMjFUMjA6NTI6MTAuOTExWiIsInVwZGF0ZWRBdCI6IjIwMjYtMDEtMjFUMjA6NTI6MTAuOTExWiIsInVzZXJuYW1lIjoiYW5vdGhlci10ZXN0LXVzZXIiLCJkaXNwbGF5VXNlcm5hbWUiOiJhbm90aGVyLXRlc3QtdXNlciIsInR3b0ZhY3RvckVuYWJsZWQiOmZhbHNlLCJpZCI6ImFub3RoZXItdGVzdC11c2VyIiwic3ViIjoiYW5vdGhlci10ZXN0LXVzZXIiLCJleHAiOjE3NjkwMzgzNTgsImlzcyI6Imh0dHA6Ly8xMjcuMC4wLjE6MjAwMCIsImF1ZCI6Imh0dHA6Ly8xMjcuMC4wLjE6MjAwMCJ9.loa5vJNiu9uwpmSTilPMCDI4NF2e0GP6ATO7fmQNuRjg-ByCgmJTcAUd-jNY4A2Lkls_VTED07WYEe8SelVRCA";

    let app: any;

    beforeAll(async () => {
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
