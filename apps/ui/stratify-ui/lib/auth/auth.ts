import { useEnvironmentContext } from "@/app/global/EnvironmentProvider";
import {
    usernameClient,
    jwtClient,
    inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const useAuthClient = () => {
    const {
        envVariables: { authProxyUrl },
    } = useEnvironmentContext();

    return createAuthClient({
        baseUrl: authProxyUrl,
        plugins: [
            usernameClient(),
            jwtClient(),
            inferAdditionalFields({
                user: {
                    currency: {
                        type: "string",
                    },
                },
            }),
        ],
    });
};

export type AuthClient = ReturnType<typeof useAuthClient>;
