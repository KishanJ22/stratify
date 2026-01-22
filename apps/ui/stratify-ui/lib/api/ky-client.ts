import { useEnvironmentContext } from "@/app/global/EnvironmentProvider";
import { paths } from "@/openapi/types/stratify-api";
import kyInstance from "ky";
import createClient from "openapi-fetch";

//? Create fetch client for calling Stratify API with type safety (OpenAPI)
const createKyClient = (baseUrl: string) =>
    createClient<paths>({
        baseUrl,
        fetch: kyInstance,
        headers: {
            "Content-Type": "application/json",
        },
    });

export const useKyClient = () => {
    const {
        envVariables: { apiProxyUrl },
    } = useEnvironmentContext();

    return createKyClient(apiProxyUrl);
};
