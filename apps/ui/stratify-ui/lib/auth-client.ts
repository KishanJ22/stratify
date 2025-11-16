import { useEnvironmentContext } from "@/app/global/EnvironmentProvider";
import { jwt, username } from "better-auth/plugins";
import { createAuthClient } from "better-auth/react";

export const useAuthClient = () => {
    const {
        envVariables: { authProxyUrl },
    } = useEnvironmentContext();

    return createAuthClient({
        baseUrl: authProxyUrl,
        plugins: [username(), jwt()],
    });
};
