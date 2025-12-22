import { requestContext, RequestContextData } from "@fastify/request-context";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { decodeToken } from "../utils/decodeToken.js";

async function localStorage(fastify: FastifyInstance) {
    fastify.addHook("onRequest", async (request, _reply) => {
        const store = request.requestContext;
        const authorization = request.headers["authorization"];
        const isAuthRoute = request.url.includes("/auth/");

        if (store) {
            store.set("requestId", request.id);
            store.set("user", null);

            // Sets user details in context store if JWT is present and auth route isn't being accessed
            if (
                authorization &&
                !isAuthRoute &&
                authorization.startsWith("Bearer ")
            ) {
                const userDetails = await decodeToken(
                    authorization.split(" ")[1],
                );

                if (!userDetails) {
                    return;
                }

                store.set("user", userDetails);
            }
        }
    });
}

// Allows for getting values from the request context store outside of route handlers
export const getFromStore = (key: keyof RequestContextData) => {
    return requestContext.get(key) ? requestContext.get(key) : null;
};

export default fp(localStorage, {
    name: "local-storage",
    dependencies: ["auth-check"],
});
