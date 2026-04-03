import { AssetType } from "../../../../schemas/common-schemas.js";
import { toTwoDecimalPoints } from "../../../../utils/toTwoDecimalPoints.js";
import { DbAssetDetails } from "./[assetId].details.get.js";
import { YahooStockAssetDetails } from "./yahoo-asset-details/fetchStockDetails.js";

export const formatBaseAssetDetails = (assetDetails: DbAssetDetails) => ({
    id: assetDetails.assetId,
    name: assetDetails.name,
    symbol: assetDetails.symbol,
    countryId: assetDetails.countryId,
    assetCurrency: assetDetails.currency,
    assetType: assetDetails.assetType as AssetType,
});

export const formatPriceDetails = (
    priceDetails: YahooStockAssetDetails["priceDetails"]["dayTradingActivity"],
) => ({
    dayTradingActivity: {
        open: priceDetails?.open ? toTwoDecimalPoints(priceDetails.open) : null,
        close: priceDetails?.close
            ? toTwoDecimalPoints(priceDetails.close)
            : null,
        high: priceDetails?.high ? toTwoDecimalPoints(priceDetails.high) : null,
        low: priceDetails?.low ? toTwoDecimalPoints(priceDetails.low) : null,
        priceChange: priceDetails?.change
            ? toTwoDecimalPoints(priceDetails.change)
            : null,
        priceChangePercent: priceDetails?.changePercent
            ? toTwoDecimalPoints(priceDetails.changePercent)
            : null,
        tradingVolume: priceDetails?.volume
            ? toTwoDecimalPoints(priceDetails.volume)
            : null,
    },
});
