import { EnvironmentProvider } from "@/app/global/EnvironmentProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const MockEnvironmentProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const queryClient = () => new QueryClient();
    return (
        <EnvironmentProvider apiProxyUrl="" authProxyUrl="">
            <QueryClientProvider client={queryClient()}>
                {children}
            </QueryClientProvider>
        </EnvironmentProvider>
    );
};

export default MockEnvironmentProvider;
