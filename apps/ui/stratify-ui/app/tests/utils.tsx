import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { EnvironmentProvider } from "../global/EnvironmentProvider";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en/messages.json";

export interface TestContext {
    queryClient?: QueryClient;
}

export const renderWithContext = ({
    queryClient,
    children,
}: PropsWithChildren<TestContext>) => {
    const defaultQueryClient = () =>
        new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                    refetchOnWindowFocus: false,
                    refetchOnReconnect: false,
                    refetchOnMount: false,
                },
            },
        });

    return render(
        <EnvironmentProvider apiProxyUrl="" authProxyUrl="">
            <QueryClientProvider client={queryClient || defaultQueryClient()}>
                <NextIntlClientProvider locale="en" messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </QueryClientProvider>
        </EnvironmentProvider>,
    );
};
