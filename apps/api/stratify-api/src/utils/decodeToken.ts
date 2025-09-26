import config from "../config.js";
import logger from "../logger.js";
import { createRemoteJWKSet, jwtVerify } from "jose";

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

        const { payload } = await jwtVerify(token, jwks, {
            issuer: config.auth.baseUrl,
            audience: config.auth.baseUrl,
        });

        return {
            userId: payload.userId as string,
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
