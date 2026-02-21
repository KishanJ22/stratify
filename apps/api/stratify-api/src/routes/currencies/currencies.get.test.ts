import loadMockApp from "../../__mocks__/mockApp.js";
import { describe, beforeAll, expect, it } from "vitest";

describe("GET /currencies", () => {
    let app: any;

    beforeAll(async () => {
        app = await loadMockApp();
    });

    it("should retrieve a list of currencies successfully", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/currencies",
            headers: {
                Accept: "application/json",
            },
        });

        const json = await response.json();

        expect(response.statusCode).toBe(200);

        expect(json.data).toBeInstanceOf(Array);
    });
});
