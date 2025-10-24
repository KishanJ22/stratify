"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { EnvironmentProvider } from "./EnvironmentProvider";
import { getQueryClient } from "./get-query-client";
import { PropsWithChildren } from "react";

interface Providers {
    apiBaseUrl: string;
    authBaseUrl: string;
}

export default function Providers({
    children,
    apiBaseUrl,
    authBaseUrl,
}: PropsWithChildren<Providers>) {
    const queryClient = getQueryClient();

    return (
        <EnvironmentProvider apiBaseUrl={apiBaseUrl} authBaseUrl={authBaseUrl}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </EnvironmentProvider>
    );
}
