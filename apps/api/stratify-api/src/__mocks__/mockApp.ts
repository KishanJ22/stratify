import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import autoload from "@fastify/autoload";
import FastifyFormBody from "@fastify/formbody";
import fastifyRequestContext from "@fastify/request-context";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify, { type FastifyError } from "fastify";
import logger from "../logger.js";
import authRoutes from "../routes/auth.js";
import type { UserDetails } from "../utils/decodeToken.js";

declare module "@fastify/request-context" {
	interface RequestContextData {
		requestId: string;
		user: UserDetails | null;
	}
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const mockApp = Fastify({
	disableRequestLogging: true,
	genReqId: () => crypto.randomUUID(),
}).withTypeProvider<TypeBoxTypeProvider>();

mockApp.register(fastifyRequestContext);
mockApp.register(FastifyFormBody);

await mockApp.register(autoload, {
	dir: join(__dirname, "../plugins"),
	ignoreFilter: /.*\.test\..*$/,
});

await mockApp.register(authRoutes);

await mockApp.register(autoload, {
	dir: join(__dirname, "../routes"),
	dirNameRoutePrefix: false,
	routeParams: false,
	matchFilter: /\.(?:get|post|put|delete|patch|options|head|)\..*$/,
	ignoreFilter: /.*\.test\..*$/,
});

mockApp.setErrorHandler<FastifyError>((error, request, reply) => {
	logger.error(
		{ err: error },
		`Error in request: ${request.method} ${request.url}`,
	);

	if (error.validation) {
		return reply
			.status(400)
			.send({ error: "Bad Request", message: "Validation failed" });
	}

	if (error.statusCode) {
		return reply.status(error.statusCode).send({ error: error.name });
	}

	return reply.status(500).send({
		error: "Internal Server Error",
	});
});

const loadMockApp = async () => {
	await mockApp.ready();
	return mockApp;
};

export default loadMockApp;
