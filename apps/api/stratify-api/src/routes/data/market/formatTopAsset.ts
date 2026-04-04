import { paths } from "../../../lib/api/stratify-data-api.js";
import { AssetType, MarketState } from "../../../schemas/common-schemas.js";
import { AssetDetailsBySymbolDb } from "./assetDetailsBySymbolQuery.js";
import { TopAsset } from "./topAssetSchema.js";

type TopGainerDataObject =
    paths["/market/top-gainers"]["get"]["responses"]["200"]["content"]["application/json"]["data"][number];

export const formatTopAssetDetails = (
    asset: TopGainerDataObject,
    assetDetails: AssetDetailsBySymbolDb,
) => {
    return {
        assetId: assetDetails.id,
        assetName: assetDetails.name,
        symbol: assetDetails.symbol,
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
