import type { FastifyInstance } from "fastify";
import packageJson from "../../package.json" with { type: "json" };
import { type Static, Type } from "@sinclair/typebox";

const health = Type.Object({
    message: Type.String(),
    version: Type.String(),
});

type Health = Static<typeof health>;

export default async function (fastify: FastifyInstance) {
    fastify.get<{ Reply: { data: Health } }>(
        "/health",
        { schema: { response: { 200: Type.Object({ data: health }) } } },
        async (_request, reply) => {
            return reply.status(200).send({
                data: {
                    message: "API is healthy",
                    version: packageJson.version,
                },
            });
        },
    );
}
