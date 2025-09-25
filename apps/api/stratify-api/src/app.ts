import { config, openapi } from "./config.js";
import Fastify from "fastify";
import cors from "@fastify/cors";
import FastifyFormBody from "@fastify/formbody";
import autoload from "@fastify/autoload";
import fastifySwagger from "@fastify/swagger";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastifySensible from "@fastify/sensible";
import fastifyHelmet from "@fastify/helmet";
import logger from "./logger.js";
import fastifyRequestContext from "@fastify/request-context";

declare module "@fastify/request-context" {
    interface RequestContextData {
        requestId: string;
    }
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = Fastify({
    disableRequestLogging: true,
    genReqId: () => crypto.randomUUID(),
}).withTypeProvider<TypeBoxTypeProvider>();

app.register(fastifyRequestContext);
app.register(fastifySensible);
app.register(fastifyHelmet, {
    global: true,
});
app.register(fastifySwagger, { openapi });
app.register(FastifyFormBody);

await app.register(cors);

await app.register(autoload, {
    dir: join(__dirname, "plugins"),
    ignoreFilter: /.*\.test\..*$/,
});

await app.register(autoload, {
    dir: join(__dirname, "routes"),
    dirNameRoutePrefix: false,
    routeParams: false,
    matchFilter: /\.(?:get|post|put|delete|patch|options|head|)\..*$/,
    ignoreFilter: /.*\.test\..*$/,
});

app.setNotFoundHandler((request, reply) => {
    app.log.warn(
        { requestId: request.id },
        `Route not found: ${request.method} ${request.url}`,
    );
    return reply
        .status(404)
        .send({ message: `Route not found: ${request.method} ${request.url}` });
});

app.setErrorHandler((error, request, reply) => {
    app.log.error(`Error handling request: ${request.method} ${request.url}`);

    if (error.validation) {
        return reply
            .status(400)
            .send({ error: "Bad Request", message: "Validation failed" });
    }

    if (error.statusCode) {
        return reply
            .status(error.statusCode)
            .send({ error: error.name, message: error.message });
    }

    return reply.status(500).send({
        error: "Internal Server Error",
    });
});

const loadApp = async () => {
    await app.ready();
    return app;
};

const checkPortAlreadyInUse = async () => {
    const server = Fastify();

    try {
        await server.listen({
            port: config.server.port,
            host: "0.0.0.0",
        });
        await server.close();

        return false;
    } catch {
        return true;
    }
};

const start = async () => {
    const app = await loadApp();
    const portInUse = await checkPortAlreadyInUse();

    if (portInUse) {
        logger.warn(
            `Port ${config.server.port} is already in use. Using port ${config.server.port + 1} instead`,
        );

        config.server.port = config.server.port + 1;
    }

    await app.listen({ port: config.server.port, host: "0.0.0.0" });

    logger.info(`Server listening on 0.0.0.0:${config.server.port}`);

    const gracefulShutdown = async (signal: string) => {
        logger.info(`Received ${signal}, shutting down gracefully`);

        try {
            await app.close();
            logger.info("Server closed successfully");
            process.exit(0);
        } catch (error) {
            logger.error(`Error shutting down gracefully: ${error}`);
            process.exit(1);
        }
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
};

start().catch((err) => {
    logger.error("Error starting server: ", err);
    process.exit(1);
});
