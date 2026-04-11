import loadMockApp from "../../__mocks__/mockApp.js";
import { describe, beforeAll, expect, it } from "vitest";
import { createUser } from "../../tests/create-user.js";
import db from "../../database/db.js";
import { generateDevToken } from "../../utils/generateDevToken.js";

describe("GET /goal", () => {
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

    it("should retrieve the user's latest goal", async () => {
        await createUser("test-user").execute();

        await db
            .insertInto("stratify.goal")
            .values([
                {
                    targetAmount: 1000,
                    userId: "test-user",
                    createdAt: new Date("2026-03-01"),
                },
                {
                    targetAmount: 2000,
                    userId: "test-user",
                    createdAt: new Date("2026-04-01"),
                },
            ])
            .execute();

        const response = await app.inject({
            method: "GET",
            url: "/goal",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        const json = await response.json();

        expect(response.statusCode).toBe(200);

        expect(json).toEqual({
            data: {
                targetAmount: 2000,
            },
        });
    });

    it("should return a 404 not found error if the user has no goals", async () => {
        await createUser("test-user").execute();

        const response = await app.inject({
            method: "GET",
            url: "/goal",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        const json = await response.json();

        expect(response.statusCode).toBe(404);

        expect(json).toEqual({
            message: "goalNotFound",
        });
    });

    it("should not retrieve the latest goal for another user", async () => {
        await createUser("test-user").execute();
        await createUser("another-test-user").execute();

        await db
            .insertInto("stratify.goal")
            .values([
                {
                    targetAmount: 1000,
                    userId: "test-user",
                    createdAt: new Date("2026-03-01"),
                },
                {
                    targetAmount: 2000,
                    userId: "test-user",
                    createdAt: new Date("2026-04-01"),
                },
            ])
            .execute();

        const response = await app.inject({
            method: "GET",
            url: "/goal",
            headers: {
                Authorization: secondDevToken,
                Accept: "application/json",
            },
        });

        const json = await response.json();

        expect(response.statusCode).toBe(404);

        expect(json).toEqual({
            message: "goalNotFound",
        });
    });
});
