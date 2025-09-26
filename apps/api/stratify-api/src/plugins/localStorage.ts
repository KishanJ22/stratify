import { requestContext, RequestContextData } from "@fastify/request-context";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { decodeToken } from "../utils/decodeToken.js";

async function localStorage(fastify: FastifyInstance) {
    fastify.addHook("onRequest", async (request, _reply) => {
        const store = request.requestContext;
        const authorization = request.headers["authorization"];

        if (store) {
            store.set("requestId", request.id);
            store.set("user", null);

            if (
                authorization &&
                !request.url.includes("/auth/") &&
                authorization.startsWith("Bearer ")
            ) {
                const userDetails = await decodeToken(
                    authorization.split(" ")[1],
                );
                store.set("user", userDetails);
            }
        }
    });
}

// Allows for getting values from the request context store outside of route handlers
export const getFromStore = (key: keyof RequestContextData) => {
    return requestContext.get(key);
};

export default fp(localStorage, { name: "local-storage" });
