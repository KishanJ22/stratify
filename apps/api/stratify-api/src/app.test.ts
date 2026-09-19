import { beforeAll, describe, expect, test } from "vitest";
import loadMockApp from "./__mocks__/mockApp.js";

describe("app tests", () => {
	let app: any;

	beforeAll(async () => {
		app = await loadMockApp();
	});

	test("app is defined", () => {
		expect(app).toBeDefined();
	});
});
