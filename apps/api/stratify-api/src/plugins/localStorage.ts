import { requestContext, RequestContextData } from "@fastify/request-context";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

async function localStorage(fastify: FastifyInstance) {
    fastify.addHook("onRequest", (request, _reply, done) => {
        const store = request.requestContext;

        if (store) {
            store.set("requestId", request.id);
        }

        done();
    });
}

// Allows for getting values from the request context store outside of route handlers
export const getFromStore = (key: keyof RequestContextData) => {
    return requestContext.get(key);
};

export default fp(localStorage, { name: "local-storage" });
