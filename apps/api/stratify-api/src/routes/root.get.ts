import type { FastifyInstance } from "fastify";

export default async function getRoot(fastify: FastifyInstance) {
    fastify.get("/", async (_request, reply) => {
        return reply.status(200).send({ message: "Welcome to Stratify API!" });
    });
}
