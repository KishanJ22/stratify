import { betterAuth } from "better-auth";
import { bearer, openAPI, twoFactor, username } from "better-auth/plugins";
import { pool } from "../database/db.js";
import config from "../config.js";

export const auth = betterAuth({
    appName: "Stratify",
    baseURL: config.auth.baseUrl,
    database: pool,
    secret: config.auth.secret,
    plugins: [
        bearer({ requireSignature: true }),
        username(),
        openAPI(),
        twoFactor({
            issuer: "Stratify",
        }),
    ],
    emailAndPassword: {
        enabled: true,
    },
});
