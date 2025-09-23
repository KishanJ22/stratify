import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "path";
import autoload from "@fastify/autoload";
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import { openapi } from "./config.js";
import fastifyFormbody from "@fastify/formbody";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsDir = join(__dirname, "../docs");

await mkdir(docsDir, { recursive: true });

const app = fastify();

app.register(fastifySwagger, { openapi });
app.register(fastifyFormbody);

await app.register(autoload, {
    dir: join(__dirname, "routes"),
    dirNameRoutePrefix: false,
    routeParams: false,
    matchFilter: /\.(?:get|post|put|delete|patch|options|head|)\..*$/,
    ignoreFilter: /.*\.test\..*$/,
});

await app.ready();

const openapiSpec = app.swagger();
const apiSpec = JSON.stringify(openapiSpec, undefined, 2);

await writeFile(join(docsDir, "openapi.json"), apiSpec, {
    flag: "w+",
});

await app.close();
