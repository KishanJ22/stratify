import { Static, Type } from "@sinclair/typebox";
import packageJson from "../package.json" with { type: "json" };
import "dotenv/config";

export const openapi = {
    info: {
        title: "Stratify API",
        version: packageJson.version,
        description: "API for the Stratify web portal.",
    },
};

const configSchema = Type.Object({
    database: Type.Object({
        host: Type.String({ minLength: 1 }),
        port: Type.Number({ minimum: 1 }),
        user: Type.String({ minLength: 1 }),
        password: Type.String({ minLength: 1 }),
        name: Type.String({ minLength: 1 }),
        keepAlive: Type.Boolean(),
        maxConnections: Type.Number({ minimum: 1 }),
    }),
    server: Type.Object({
        port: Type.Number({ minimum: 1 }),
        environment: Type.Union([
            Type.Literal("local"),
            Type.Literal("development"),
            Type.Literal("test"),
            Type.Literal("production"),
        ]),
    }),
    auth: Type.Object({
        baseUrl: Type.String({ minLength: 1 }),
        secret: Type.String({ minLength: 1 }),
    }),
});

type ConfigSchema = Static<typeof configSchema>;

export const config: ConfigSchema = {
    auth: {
        baseUrl: process.env.BETTER_AUTH_BASE_URL || "http://localhost:2000",
        secret: process.env.BETTER_AUTH_SECRET!,
    },
    database: {
        host: process.env.DATABASE_HOST!,
        port: Number(process.env.DATABASE_PORT!),
        user: process.env.DATABASE_USER!,
        password: process.env.DATABASE_PASSWORD!,
        name: process.env.DATABASE_NAME!,
        keepAlive: process.env.DATABASE_KEEP_ALIVE === "true",
        maxConnections: Number(process.env.DATABASE_MAX_CONNECTIONS) || 10,
    },
    server: {
        port: Number(process.env.PORT) || 2000,
        environment: (process.env
            .ENVIRONMENT as ConfigSchema["server"]["environment"])!,
    },
};

export default config;
