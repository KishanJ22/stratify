import { createPublicEnv } from "next-public-env";

export const { getPublicEnv, PublicEnv } = createPublicEnv(
    {
        STRATIFY_API_PROXY_URL: process.env.STRATIFY_API_PROXY_URL,
        STRATIFY_AUTH_PROXY_URL: process.env.STRATIFY_AUTH_PROXY_URL,
    },
    {
        schema: (z) => ({
            STRATIFY_API_PROXY_URL: z.string(),
            STRATIFY_AUTH_PROXY_URL: z.string(),
        }),
    },
);
