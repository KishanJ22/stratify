import { dataApiClient } from "../../lib/api/data-api-client.js";
import logger from "../../logger.js";

export const fetchCurrentPrice = async (
    assetSymbol: string,
    assetCountryId: number,
    isCryptocurrency?: boolean,
) => {
    // Append .L for London Stock Exchange assets (UK assets)
    const symbol = assetCountryId === 223 ? `${assetSymbol}.L` : assetSymbol;

    try {
        const response = await dataApiClient()
            .GET("/assets/{symbol}/current-price", {
                params: {
                    path: {
                        symbol: isCryptocurrency ? `${symbol}-USD` : symbol,
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
                isCryptocurrency,
            },
            "Error fetching asset price for symbol",
        );
    }
};
