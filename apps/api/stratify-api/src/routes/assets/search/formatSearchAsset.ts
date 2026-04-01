import { paths } from "../../../lib/api/stratify-data-api.js";
import { AssetType } from "../../../schemas/common-schemas.js";
import { SearchAsset } from "./search-schema.js";
import type { DbSearchAsset } from "./search.post.js";

type CurrentPriceData =
    paths["/assets/{symbol}/current-price"]["get"]["responses"]["200"]["content"]["application/json"]["data"];

export const formatSearchAsset = (
    asset: DbSearchAsset,
    priceDetails?: CurrentPriceData,
) => {
    return {
        id: asset.id,
        name: asset.name,
        symbol: asset.symbol,
        currency: asset.currency,
        assetType: asset.assetType as AssetType,
        currentPrice: priceDetails?.currentPrice ?? null,
        priceChange: priceDetails?.change ?? null,
        priceChangePercent: priceDetails?.changePercent ?? null,
    } satisfies SearchAsset;
};
