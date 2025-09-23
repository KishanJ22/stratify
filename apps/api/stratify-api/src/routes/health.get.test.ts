import loadMockApp from "../__mocks__/mockApp.js";
import { describe, test, beforeAll, expect } from "vitest";

describe("app", () => {
    let app: any;

    beforeAll(async () => {
        app = await loadMockApp();
    });

    test("Should access the health route", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/health",
        });

        const data = response.json().data;

        expect(response.statusCode).toBe(200);
        expect(data.message).toBe("API is healthy");
        expect(data.version).toBe(process.env.npm_package_version);
    });
});
