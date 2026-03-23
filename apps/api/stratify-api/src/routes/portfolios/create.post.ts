import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { getFromStore } from "../../plugins/localStorage.js";
import { UserDetails } from "../../utils/decodeToken.js";
import db from "../../database/db.js";
import logger from "../../logger.js";

const requestBodySchema = Type.Object({
    name: Type.String({ description: "The portfolio name" }),
});

type RequestBody = Static<typeof requestBodySchema>;

//? Error value is camelCase to allow for translations to be easily mapped
const portfolioNameAlreadyExistsResponseSchema = Type.Object({
    message: Type.Literal("portfolioNameAlreadyExists"),
});

type PortfolioNameAlreadyExistsResponse = Static<
    typeof portfolioNameAlreadyExistsResponseSchema
>;

const successResponseSchema = Type.Object({
    data: Type.Object({
        portfolioId: Type.Number(),
    }),
});

type SuccessResponse = Static<typeof successResponseSchema>;

// Create a new portfolio for the user
const createPortfolio = (userId: string, name: string) => {
    return db
        .insertInto("stratify.portfolios")
        .values({
            name: name.toLowerCase(),
            userId,
        })
        .returning("id as portfolioId");
};

// Check if the user already has a portfolio with the same name
const checkPortfolioNameExists = (userId: string, name: string) => {
    return db
        .selectFrom("stratify.portfolios")
        .where("userId", "=", userId)
        .where("name", "=", name.toLowerCase())
        .selectAll();
};

export default async function portfolioCreatePost(fastify: FastifyInstance) {
    fastify.route<{
        Body: RequestBody;
        Reply: SuccessResponse | PortfolioNameAlreadyExistsResponse;
    }>({
        method: "POST",
        url: "/portfolios",
        schema: {
            body: requestBodySchema,
            response: {
                201: successResponseSchema,
                400: portfolioNameAlreadyExistsResponseSchema,
            },
        },
        handler: async (request, reply) => {
            const { name } = request.body;

            try {
                const { userId } = getFromStore("user") as UserDetails;

                const isPortfolioNameAlreadyExists =
                    await checkPortfolioNameExists(
                        userId,
                        name,
                    ).executeTakeFirst();

                if (isPortfolioNameAlreadyExists) {
                    return reply.status(400).send({
                        message: "portfolioNameAlreadyExists",
                    });
                }

                const { portfolioId } = await createPortfolio(
                    userId,
                    name,
                ).executeTakeFirstOrThrow();

                return reply.status(201).send({
                    data: {
                        portfolioId,
                    },
                });
            } catch (error) {
                logger.error({ error }, "Error creating portfolio");
                throw error;
            }
        },
    });
}
