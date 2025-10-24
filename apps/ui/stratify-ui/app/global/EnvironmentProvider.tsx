"use client";

import { createContext, useContext, useMemo } from "react";

export interface Environment {
    apiBaseUrl?: string;
    authBaseUrl?: string;
}

export const EnvironmentContext = createContext<{
    envVariables: Environment;
} | null>(null);

interface EnvironmentProviderProps extends Environment {
    children: React.ReactNode;
}

export const EnvironmentProvider = ({
    children,
    apiBaseUrl,
    authBaseUrl,
}: EnvironmentProviderProps) => {
    const envVariables = useMemo(
        () => ({
            apiBaseUrl,
            authBaseUrl,
        }),
        [apiBaseUrl, authBaseUrl],
    );

    const environmentProviderValues = {
        envVariables,
    };

    return (
        <EnvironmentContext.Provider value={environmentProviderValues}>
            {children}
        </EnvironmentContext.Provider>
    );
};

export const useEnvironmentContext = () => {
    const context = useContext(EnvironmentContext);

    if (context === null) {
        throw new Error(
            "useEnvironmentContext must be used within an EnvironmentProvider",
        );
    }

    return context;
};
