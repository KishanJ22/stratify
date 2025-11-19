import { useEnvironmentContext } from "@/app/global/EnvironmentProvider";
import { usernameClient, jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { cookies } from "next/headers";

export const useAuthClient = () => {
    const {
        envVariables: { authProxyUrl },
    } = useEnvironmentContext();

    return createAuthClient({
        baseUrl: authProxyUrl,
        plugins: [usernameClient(), jwtClient()],
    });
};

export const storeAuthToken = async (token: string) => {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("bearer-token");

    if (!authToken || authToken.value !== token) {
        cookieStore.set({
            name: "bearer-token",
            value: token,
            httpOnly: true,
        });
    }
};
