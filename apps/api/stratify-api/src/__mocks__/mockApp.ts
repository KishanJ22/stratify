import fastify, { FastifyInstance } from "fastify";
import FastifyFormBody from "@fastify/formbody";
import autoload from "@fastify/autoload";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import authRoutes from "../routes/auth.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const mockApp: FastifyInstance = fastify();

mockApp.register(FastifyFormBody);

await mockApp.register(authRoutes);

await mockApp.register(autoload, {
    dir: join(__dirname, "../plugins"),
    ignoreFilter: /.*\.test\..*$/,
});

await mockApp.register(autoload, {
    dir: join(__dirname, "../routes"),
    dirNameRoutePrefix: false,
    routeParams: false,
    matchFilter: /\.(?:get|post|put|delete|patch|options|head|)\..*$/,
    ignoreFilter: /.*\.test\..*$/,
});

const loadMockApp = async () => {
    await mockApp.ready();
    return mockApp;
};

export default loadMockApp;
