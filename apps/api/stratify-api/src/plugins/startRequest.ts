import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import logger from "../logger.js";

async function startRequest(fastify: FastifyInstance) {
    fastify.addHook("preHandler", async (request, _reply) => {
        const { method, originalUrl } = request;

        logger.info(
            {
                method,
                url: originalUrl,
            },
            "Incoming request",
        );
    });
}

export default fp(startRequest, { name: "start-request" });
