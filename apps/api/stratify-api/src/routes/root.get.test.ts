import { beforeAll, describe, expect, test } from "vitest";
import loadMockApp from "../__mocks__/mockApp.js";

describe("app", () => {
	let app: any;

	beforeAll(async () => {
		app = await loadMockApp();
	});

	test("Should access the root route", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/",
		});

		expect(response.statusCode).toBe(200);
		expect(response.json().message).toBe("Welcome to Stratify API!");
	});
});
