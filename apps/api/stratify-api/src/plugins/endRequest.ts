import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import logger from "../logger.js";

async function endRequest(fastify: FastifyInstance) {
    fastify.addHook("onResponse", async (request, reply) => {
        const { method, originalUrl } = request;
        const { statusCode, elapsedTime: duration } = reply;

        const loggingValues = {
            method,
            url: originalUrl,
            statusCode,
            duration,
        };

        if (statusCode >= 500) {
            logger.error(loggingValues, "Sending error response");
        } else if (statusCode >= 400) {
            logger.warn(loggingValues, "Sending client error response");
        } else {
            logger.info(loggingValues, "Sending response");
        }
    });
}

export default fp(endRequest, { name: "end-request" });
