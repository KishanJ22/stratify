import createClient from "openapi-fetch";
import { paths } from "./stratify-data-api.js";
import kyInstance from "ky";
import config from "../../config.js";

const dataApiClient = createClient<paths>({
    baseUrl: config.dataApiBaseUrl,
    fetch: kyInstance,
    headers: {
        "Content-Type": "application/json",
    },
});

export default dataApiClient;
