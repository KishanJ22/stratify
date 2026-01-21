import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

const requestBodySchema = Type.Object({
    name: Type.String({ description: "The portfolio name" }),
});

type RequestBody = Static<typeof requestBodySchema>;

const successResponseSchema = Type.Object({
    data: Type.Object({
        success: Type.Boolean(),
    }),
});

type SuccessResponse = Static<typeof successResponseSchema>;

export default async function portfolioCreatePost(fastify: FastifyInstance) {
    fastify.route<{ Body: RequestBody; Reply: SuccessResponse }>({
        method: "POST",
        url: "/portfolios",
        schema: {
            body: requestBodySchema,
            response: {
                200: successResponseSchema,
            },
        },
        handler: async (request, reply) => {
            const { name } = request.body;
        },
    });
}
