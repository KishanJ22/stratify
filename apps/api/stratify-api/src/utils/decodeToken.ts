import config from "../config.js";
import logger from "../logger.js";
import { createRemoteJWKSet, decodeJwt, jwtVerify } from "jose";

export interface UserDetails {
    userId: string;
    name: string;
    email: string;
    username?: string;
    displayUsername?: string;
}

export const decodeToken = async (token: string) => {
    try {
        const jwks = createRemoteJWKSet(
            new URL(`${config.auth.baseUrl}/auth/jwks`),
        );

        // Dev tokens are prefixed with "Dev-"
        const isDevToken = token.startsWith("Dev-");

        // Dev tokens should only be used if dev mode is enabled
        const isDevModeEnabled = config.server.devMode;

        // Handle dev tokens separately
        if (isDevToken && isDevModeEnabled) {
            const payload = decodeJwt(token.split("Dev-")[1]);

            return {
                userId: payload.id as string,
                email: payload.email as string,
                name: payload.name as string,
                username: payload.username as string | undefined,
                displayUsername: payload.displayUsername as string | undefined,
            } satisfies UserDetails;
        }

        const { payload } = await jwtVerify(token, jwks, {
            issuer: config.auth.baseUrl,
            audience: config.auth.baseUrl,
        });

        return {
            userId: payload.id as string,
            email: payload.email as string,
            name: payload.name as string,
            username: payload.username as string | undefined,
            displayUsername: payload.displayUsername as string | undefined,
        } satisfies UserDetails;
    } catch (err) {
        logger.error({ err }, "Error decoding JWT");
        return null;
    }
};
