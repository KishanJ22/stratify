import kyInstance from "ky";
import createClient from "openapi-fetch";
import config from "../../config.js";
import type { paths } from "./stratify-data-api.js";

export const dataApiClient = () =>
	createClient<paths>({
		baseUrl: config.dataApiBaseUrl,
		fetch: kyInstance,
		headers: {
			"Content-Type": "application/json",
		},
	});
