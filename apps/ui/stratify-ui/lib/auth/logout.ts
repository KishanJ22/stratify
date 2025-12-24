"use client";

import { AuthClient } from "./auth";
import { removeAuthTokenFromCookies } from "./remove-auth-token";

export const logoutUser = async (
    bearer: string,
    authClient: AuthClient,
) => {
    await authClient.signOut({
        fetchOptions: {
            headers: {
                authorization: `Bearer ${bearer}`,
            },
            onSuccess: async () => {
                //? Remove bearer token from cookies
                await removeAuthTokenFromCookies();
            },
        },
    });
};
