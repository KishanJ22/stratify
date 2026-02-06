import { paths } from "../../../lib/api/stratify-data-api.js";
import { AssetType, MarketState } from "../../../schemas/common-schemas.js";
import { AssetDetails } from "./fetch-asset-details.js";
import { TopAsset } from "./top-assets-schema.js";

type TopGainerDataObject =
    paths["/market/top-gainers"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number];

export const formatTopAssetDetails = (
    asset: TopGainerDataObject,
    assetDetails: AssetDetails,
) => {
    return {
        symbol: assetDetails.symbol,
        name: assetDetails.name,
        currency: assetDetails.currency,
        assetType: assetDetails.assetType as AssetType,
        marketState: asset.marketState as MarketState,
        priceDetails: {
            currentPrice: asset.priceDetails.currentPrice ?? null,
            volume: asset.priceDetails.dayTradingActivity.volume ?? null,
            priceChange: asset.priceDetails.dayTradingActivity.change ?? null,
            priceChangePercent:
                asset.priceDetails.dayTradingActivity.changePercent ?? null,
        },
    } satisfies TopAsset;
};
