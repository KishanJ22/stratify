import loadMockApp from "../../__mocks__/mockApp.js";
import { describe, beforeAll, expect, it } from "vitest";
import { createUser } from "../../tests/create-user.js";
import db from "../../database/db.js";
import { generateDevToken } from "../../utils/generateDevToken.js";

describe("POST /goal", () => {
    let devToken = "";

    let app: any;

    beforeAll(async () => {
        devToken = await generateDevToken({ userId: "test-user" });

        app = await loadMockApp();
    });

    it("should create a new goal for a user successfully", async () => {
        await createUser("test-user").execute();

        const response = await app.inject({
            method: "POST",
            url: "/goal",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
            payload: {
                targetAmount: 5000,
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
});
