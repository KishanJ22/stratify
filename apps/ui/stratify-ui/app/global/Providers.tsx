"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { EnvironmentProvider } from "./EnvironmentProvider";
import { getQueryClient } from "./get-query-client";
import { ReactNode, Suspense } from "react";
import { getPublicEnv } from "@/public-env";

export default function Providers({ children }: { children: ReactNode }) {
    const queryClient = getQueryClient();
    const publicEnv = getPublicEnv();

    return (
        <Suspense>
            <EnvironmentProvider
                apiProxyUrl={publicEnv.STRATIFY_API_PROXY_URL}
                authProxyUrl={publicEnv.STRATIFY_AUTH_PROXY_URL}
            >
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </EnvironmentProvider>
        </Suspense>
    );
}
