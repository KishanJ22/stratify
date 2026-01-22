"use client";

import { AuthClient } from "./auth";
import { removeTokensFromCookies } from "./remove-tokens";

export const logoutUser = async (bearer: string, authClient: AuthClient) => {
    await authClient.signOut({
        fetchOptions: {
            headers: {
                authorization: `Bearer ${bearer}`,
            },
            onSuccess: async () => {
                //? Remove auth and access token from cookies
                await removeTokensFromCookies();
            },
        },
    });
};
