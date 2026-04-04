import { dataApiClient } from "../../../../../lib/api/data-api-client.js";
import logger from "../../../../../logger.js";

export const fetchCryptocurrencyDetails = async (
    symbol: string,
    currency: string,
) => {
    try {
        const response = await dataApiClient()
            .GET("/cryptocurrencies/{symbol}", {
                params: {
                    path: {
                        symbol: `${symbol}-${currency}`,
                    },
                },
            })
            .then((res) => res.data?.data);

        return response;
    } catch (error) {
        logger.error(
            {
                error,
                symbol,
                currency,
            },
            "Error fetching details for cryptocurrency",
        );
    }
};
