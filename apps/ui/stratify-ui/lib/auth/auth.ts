import { useEnvironmentContext } from "@/app/global/EnvironmentProvider";
import { usernameClient, jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const useAuthClient = () => {
    const {
        envVariables: { authProxyUrl },
    } = useEnvironmentContext();

    return createAuthClient({
        baseUrl: authProxyUrl,
        plugins: [usernameClient(), jwtClient()],
    });
};

export type AuthClient = ReturnType<typeof useAuthClient>;