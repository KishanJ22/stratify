import { dataApiClient } from "../../../lib/api/data-api-client.js";
import { paths } from "../../../lib/api/stratify-data-api.js";
import logger from "../../../logger.js";

export type YahooCryptosList =
    paths["/cryptocurrencies"]["get"]["responses"]["200"]["content"]["application/json"]["data"];

export const fetchCryptosList = async (symbols: string) => {
    try {
        const response = await dataApiClient()
            .GET("/cryptocurrencies", {
                params: {
                    query: {
                        symbols,
                    },
                },
            })
            .then((res) => res.data?.data);

        return response;
    } catch (error) {
        logger.error(
            {
                error,
                symbols,
            },
            "Error fetching cryptocurrencies",
        );
    }
};
