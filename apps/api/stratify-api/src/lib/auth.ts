import { betterAuth } from "better-auth";
import { bearer, jwt, openAPI, twoFactor, username } from "better-auth/plugins";
import { pool } from "../database/db.js";
import config from "../config.js";
import logger from "../logger.js";

export const auth = betterAuth({
    appName: "Stratify",
    baseURL: config.auth.baseUrl,
    basePath: "/auth",
    database: pool,
    secret: config.auth.secret,
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        jwt({
            jwt: {
                expirationTime: "15m", // 15 minutes for access tokens
            },
        }),
        bearer(),
        username(),
        openAPI(),
        twoFactor({
            issuer: "Stratify",
        }),
    ],
    session: {
        cookieCache: {
            enabled: false,
        },
        expiresIn: 60 * 60 * 8, // 8 hours absolute
        updateAge: 60 * 30, // 30 minutes - extend on activity
    },
    telemetry: {
        enabled: false,
    },
    logger: {
        level: "info",
        log: (level, message, ...args) => {
            switch (level) {
                case "info":
                    logger.info(message, ...args);
                    break;
                case "warn":
                    logger.warn(message, ...args);
                    break;
                case "error":
                    logger.error(message, ...args);
                    break;
            }
        },
    },
});
