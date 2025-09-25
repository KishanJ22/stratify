import { pino } from "pino";
import "dotenv/config";

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
                    application: "Pitlane API",
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
        level: "silent",
    },
};

const environment = (process.env.ENVIRONMENT ??
    "development") as keyof typeof loggerVariant;

const logger = pino({
    ...loggerVariant[environment],
});

export default logger;
