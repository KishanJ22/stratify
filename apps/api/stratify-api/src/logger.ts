import { getFromStore } from "./plugins/localStorage.js";
import { pino } from "pino";
import "dotenv/config";
import { UserDetails } from "./utils/decodeToken.js";

export const loggerVariant = {
    local: {
        level: process.env.LOG_LEVEL ?? "debug",
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
                levelFirst: true,
            },
        },
    },
    development: {
        level: process.env.LOG_LEVEL ?? "debug",
    },
    production: {
        level: process.env.LOG_LEVEL ?? "info",
        base: {
            pid: undefined,
            hostname: undefined,
        },
        transport: {
            target: "pino-loki",
            batching: false,
            options: {
                host: process.env.LOKI_URL!,
                labels: {
                    application: "Stratify API",
                    environment: process.env.ENVIRONMENT!,
                },
                basicAuth: {
                    username: process.env.LOKI_USERNAME!,
                    password: process.env.LOKI_PASSWORD!,
                },
                batchSize: 1,
                timeThreshold: 15 * 1000,
            },
        },
    },
    test: {
        level: process.env.LOG_LEVEL ?? "debug",
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
                levelFirst: true,
            },
        },
    },
};

const environment = (process.env.ENVIRONMENT ??
    "development") as keyof typeof loggerVariant;

const logger = pino({
    ...loggerVariant[environment],
    hooks: {
        streamWrite: (s) => {
            if (environment === "test") {
                console.log(s);
            }
            return s;
        },
    },
    mixin: () => {
        const requestId = getFromStore("requestId");
        const user = getFromStore("user") as UserDetails | null;

        return {
            requestId: requestId ?? undefined,
            user: user ?? undefined,
        };
    },
});

export default logger;
