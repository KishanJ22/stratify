import { FastifyInstance } from "fastify";
import logger from "../logger.js";
import { auth } from "../lib/auth.js";

export default async function authRoutes(fastify: FastifyInstance) {
    fastify.route({
        method: ["GET", "POST"],
        url: "/auth/*",
        handler: async (request, reply) => {
            try {
                const url = new URL(
                    request.url,
                    `http://${request.headers.host}`,
                );

                const headers = new Headers();
                Object.entries(request.headers).forEach(([key, value]) => {
                    if (value) {
                        headers.append(key, value.toString());
                    }
                });

                // Create Fetch API-compatible request
                const req = new Request(url.toString(), {
                    method: request.method,
                    headers,
                    body: request.body
                        ? JSON.stringify(request.body)
                        : undefined,
                });

                // Process authentication request
                const response = await auth.handler(req);

                reply.status(response.status);
                response.headers.forEach((value, key) => {
                    if (key.toLowerCase() !== "set-cookie") {
                        // Avoid cookie being set via headers
                        reply.header(key, value);
                    }
                });
                reply.send(response.body ? await response.text() : null);
            } catch (err) {
                logger.error({ err }, "Error in auth route");
                throw err;
            }
        },
    });
}
