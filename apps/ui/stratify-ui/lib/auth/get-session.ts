"use client";

import { AuthClient } from "./auth";

export const getUserSession = async (
    bearer: string,
    authClient: AuthClient,
) => {
    let jwtToken = "";

    const { data, error } = await authClient.getSession({
        fetchOptions: {
            headers: {
                authorization: `Bearer ${bearer}`,
            },
            onSuccess: (ctx) => {
                const jwt = ctx.response.headers.get("set-auth-jwt");

                if (jwt) {
                    jwtToken = jwt;
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
                token: jwtToken,
            },
        };
    }
};
