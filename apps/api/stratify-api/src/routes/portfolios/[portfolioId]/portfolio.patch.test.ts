import loadMockApp from "../../../__mocks__/mockApp.js";
import { describe, beforeAll, expect, it } from "vitest";
import { createUser } from "../../../tests/create-user.js";
import db from "../../../database/db.js";
import { generateDevToken } from "../../../utils/generateDevToken.js";

describe("PATCH /portfolios/:portfolioId", () => {
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

    it("should rename a portfolio successfully", async () => {
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
            method: "PATCH",
            url: `/portfolios/${portfolio.id}`,
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
            body: {
                name: "my main portfolio",
            },
        });

        expect(response.statusCode).toBe(204);

        const updatedPortfolioName = await db
            .selectFrom("stratify.portfolios")
            .where("stratify.portfolios.id", "=", portfolio.id)
            .select("stratify.portfolios.name as portfolioName")
            .executeTakeFirstOrThrow();

        expect(updatedPortfolioName.portfolioName).toBe("my main portfolio");
    });

    it("should return an error if the user already has a portfolio with the name specified", async () => {
        await createUser("test-user").execute();

        const portfolio = await db
            .insertInto("stratify.portfolios")
            .values([
                {
                    name: "main",
                    userId: "test-user",
                },
                {
                    name: "secondary",
                    userId: "test-user",
                },
            ])
            .returning("stratify.portfolios.id as id")
            .executeTakeFirstOrThrow();

        const response = await app.inject({
            method: "PATCH",
            url: `/portfolios/${portfolio.id}`,
            headers: {
                Authorization: devToken,
                Accept: "application/json",
            },
            body: {
                name: "secondary",
            },
        });

        expect(response.statusCode).toBe(400);

        const json = await response.json();

        expect(json.message).toBe("portfolioNameAlreadyExists");
    });

    it("should not allow a user to update another user's portfolio", async () => {
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
            method: "PATCH",
            url: `/portfolios/${portfolio.id}`,
            headers: {
                Authorization: secondDevToken,
                Accept: "application/json",
            },
            body: {
                name: "secondary",
            },
        });

        expect(response.statusCode).toBe(404);

        const json = await response.json();

        expect(json.message).toBe("portfolioNotFound");
    });
});
