import loadMockApp from "./__mocks__/mockApp.js";
import { describe, test, beforeAll, expect } from "vitest";

describe("app tests", () => {
    let app: any;

    beforeAll(async () => {
        app = await loadMockApp();
    });

    test("app is defined", () => {
        expect(app).toBeDefined();
    });
});
