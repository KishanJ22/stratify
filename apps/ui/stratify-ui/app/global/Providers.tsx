"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { EnvironmentProvider } from "./EnvironmentProvider";
import { getQueryClient } from "./get-query-client";
import { PropsWithChildren, Suspense } from "react";

interface Providers {
    apiProxyUrl: string;
    authProxyUrl: string;
}

export default function Providers({
    children,
    apiProxyUrl,
    authProxyUrl,
}: PropsWithChildren<Providers>) {
    const queryClient = getQueryClient();

    return (
        <Suspense>
            <EnvironmentProvider
                apiProxyUrl={apiProxyUrl}
                authProxyUrl={authProxyUrl}
            >
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </EnvironmentProvider>
        </Suspense>
    );
}
