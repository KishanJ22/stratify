import { useEnvironmentContext } from "@/app/global/EnvironmentProvider";
import { jwt, username } from "better-auth/plugins";
import { createAuthClient } from "better-auth/react";

export const useAuthClient = () => {
    const {
        envVariables: { authBaseUrl },
    } = useEnvironmentContext();

    return createAuthClient({
        baseUrl: authBaseUrl,
        basePath: "/api/auth",
        plugins: [username(), jwt()],
    });
};
