import loadMockApp from "../../../__mocks__/mockApp.js";
import { describe, beforeAll, expect, it } from "vitest";
import { createUser } from "../../../tests/create-user.js";
import db from "../../../database/db.js";
import { generateDevToken } from "../../../utils/generateDevToken.js";

describe("DELETE /portfolios/:portfolioId", () => {
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

    it("should delete a portfolio successfully", async () => {
        await createUser("test-user").execute();

        const portfolio = await db
            .insertInto("stratify.portfolios")
            .values({
                name: "main",
                userId: "test-user",
            })
            .returning("stratify.portfolios.id as id")
            .executeTakeFirstOrThrow();

        const response = await app.inject({
            method: "DELETE",
            url: `/portfolios/${portfolio.id}`,
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(204);
    });

    it("should return an error if the portfolio cannot be found", async () => {
        const response = await app.inject({
            method: "DELETE",
            url: "/portfolios/1",
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(404);

        const json = await response.json();
        expect(json.message).toBe("portfolioNotFound");
    });

    it("should not allow a user to delete another user's portfolio", async () => {
        await createUser("test-user").execute();
        await createUser("another-test-user").execute();

        const portfolio = await db
            .insertInto("stratify.portfolios")
            .values({
                name: "main",
                userId: "test-user",
            })
            .returning("stratify.portfolios.id as id")
            .executeTakeFirstOrThrow();

        const response = await app.inject({
            method: "DELETE",
            url: `/portfolios/${portfolio.id}`,
            headers: {
                Authorization: secondDevToken,
                Accept: "application/json",
            },
        });

        expect(response.statusCode).toBe(404);

        const json = await response.json();
        expect(json.message).toBe("portfolioNotFound");
    });
});
