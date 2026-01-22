"use client";

import { AuthClient } from "./auth";
import { storeAccessToken } from "./store-access-token";

//? Get user session using bearer token and store new access token in cookies if provided
export const getUserSession = async (
    bearer: string,
    authClient: AuthClient,
) => {
    const { data, error } = await authClient.getSession({
        fetchOptions: {
            headers: {
                authorization: `Bearer ${bearer}`,
            },
            onSuccess: async (ctx) => {
                const jwt = ctx.response.headers.get("set-auth-jwt");

                if (jwt) {
                    await storeAccessToken(jwt);
                }
            },
        },
    });

    if (error || !data) {
        return null;
    }

    if (data) {
        return {
            data: {
                userDetails: {
                    id: data.user.id,
                    name: data.user.name,
                    username: data.user.username as string,
                    displayUsername: data.user.displayUsername as string,
                    email: data.user.email,
                },
            },
        };
    }
};
