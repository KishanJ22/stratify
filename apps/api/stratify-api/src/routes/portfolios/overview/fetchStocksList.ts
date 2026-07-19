import { dataApiClient } from "../../../lib/api/data-api-client.js";
import { paths } from "../../../lib/api/stratify-data-api.js";
import logger from "../../../logger.js";

export type YahooStocksList =
    paths["/stocks"]["get"]["responses"]["200"]["content"]["application/json"]["data"];

export const fetchStocksList = async (symbols: string) => {
    try {
        const response = await dataApiClient()
            .GET("/stocks", {
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
            "Error fetching stocks",
        );
    }
};
