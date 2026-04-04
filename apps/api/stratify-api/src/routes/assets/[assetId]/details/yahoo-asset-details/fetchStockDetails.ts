import { dataApiClient } from "../../../../../lib/api/data-api-client.js";
import { paths } from "../../../../../lib/api/stratify-data-api.js";
import logger from "../../../../../logger.js";

export type YahooStockAssetDetails =
    paths["/stocks/{symbol}"]["get"]["responses"]["200"]["content"]["application/json"]["data"];

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
