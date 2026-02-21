import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { decodeToken } from "../utils/decodeToken.js";
import logger from "../logger.js";

async function authCheck(fastify: FastifyInstance) {
    fastify.addHook("onRequest", async (request, reply) => {
        const authorization = request.headers["authorization"];
        const isPublicRoute =
            request.url.includes("/auth/") ||
            request.url.includes("/health") ||
            request.url.includes("/currencies") ||
            request.url === "/";

        // Applies auth check for non-public routes
        if (!isPublicRoute) {
            if (!authorization || !authorization.startsWith("Bearer ")) {
                return reply
                    .status(401)
                    .send({ error: "Authentication required" });
            }

            const user = await decodeToken(authorization.split(" ")[1]);

            if (!user) {
                logger.error("Invalid or expired token");
                return reply
                    .status(401)
                    .send({ error: "Authentication required" });
            }
        }
    });
}

export default fp(authCheck, {
    name: "auth-check",
});
