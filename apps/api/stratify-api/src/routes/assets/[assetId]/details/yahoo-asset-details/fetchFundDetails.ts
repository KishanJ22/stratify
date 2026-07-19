import { dataApiClient } from "../../../../../lib/api/data-api-client.js";
import { paths } from "../../../../../lib/api/stratify-data-api.js";
import logger from "../../../../../logger.js";

export type YahooFund =
    paths["/funds/{symbol}"]["get"]["responses"]["200"]["content"]["application/json"]["data"];

export const fetchFundDetails = async (
    assetSymbol: string,
    assetCountryId: number,
) => {
    // Append .L for London Stock Exchange assets (UK assets)
    const symbol = assetCountryId === 223 ? `${assetSymbol}.L` : assetSymbol;

    try {
        const response = await dataApiClient()
            .GET("/funds/{symbol}", {
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
            "Error fetching details for fund",
        );
    }
};
