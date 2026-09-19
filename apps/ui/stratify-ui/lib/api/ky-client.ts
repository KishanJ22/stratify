import kyInstance from "ky";
import createClient from "openapi-fetch";
import { useEnvironmentContext } from "@/app/global/EnvironmentProvider";
import type { paths } from "@/openapi/types/stratify-api";

//? Create fetch client for calling Stratify API with type safety (OpenAPI)
const createKyClient = (baseUrl: string) =>
	createClient<paths>({
		baseUrl,
		fetch: kyInstance,
	});

export const useKyClient = () => {
	const {
		envVariables: { apiProxyUrl },
	} = useEnvironmentContext();

	return createKyClient(apiProxyUrl);
};
