import { dataApiClient } from "../../../../../lib/api/data-api-client.js";
import logger from "../../../../../logger.js";

export const fetchStockDetails = async (
    assetSymbol: string,
    assetCountryId: number,
) => {
    // Append .L for London Stock Exchange assets (UK assets)
    const symbol = assetCountryId === 223 ? `${assetSymbol}.L` : assetSymbol;

    try {
        const response = await dataApiClient()
            .GET("/stocks/{symbol}", {
                params: {
                    path: {
                        symbol,
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
            },
            "Error fetching details for stock",
        );
    }
};
