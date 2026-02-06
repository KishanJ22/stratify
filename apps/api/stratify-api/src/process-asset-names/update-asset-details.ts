import db from "../database/db.js";
import { processLseAssetNames } from "./process-lse-asset-names.js";
import { processNasdaqAssetNames } from "./process-nasdaq-asset-names.js";
import { processOtherUsAssetNames } from "./process-other-us-asset-names.js";
import logger from "../logger.js";
import { SingleBar } from "cli-progress";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { processCryptocurrencyAssetNames } from "./process-cryptocurrency-asset-names.js";
import pLimit from "p-limit";

const __dirname = dirname(new URL(import.meta.url).pathname);

export const readDataFile = (filePath: string) => {
    const content = readFileSync(join(__dirname, filePath), "utf-8");
    return content;
};

//? Structure of Asset interface used in scripts for processing asset names from files to ensure consistency
export interface Asset {
    symbol: string;
    name: string;
    assetType: "Stock" | "ETF" | "Cryptocurrency";
    countryId: number;
    currency?: string;
}

const updateAssetDetailsDb = async (asset: Asset) => {
    //? Check if the asset already exists in the database by checking against symbol and country id
    const isAssetPresent = await db
        .selectFrom("stratify.assets as assets")
        .where("assets.symbol", "=", asset.symbol)
        .where("assets.countryId", "=", asset.countryId)
        .selectAll()
        .executeTakeFirst();

    //? If the asset exists, update the name and type in the database
    if (isAssetPresent) {
        await db
            .updateTable("stratify.assets as assets")
            .set({
                name: asset.name,
                type: asset.assetType.toUpperCase(),
                currency: asset.currency || isAssetPresent.currency,
                updatedAt: new Date(),
            })
            .where("assets.symbol", "=", asset.symbol)
            .where("assets.countryId", "=", asset.countryId)
            .executeTakeFirstOrThrow();
    }
};

//? Call the function to update asset name and type in the database
//? This was split out to a standalone function so that it could be called concurrently with p-limit
const processAsset = async (asset: Asset, progressBar: SingleBar) => {
    try {
        await updateAssetDetailsDb(asset);
        progressBar.increment();
    } catch (error) {
        logger.error(
            { error },
            `Error updating asset details for ${asset.symbol} (${asset.countryId})`,
        );
    }
};

async function updateAssetDetails() {
    const lseAssets = await processLseAssetNames();
    const nasdaqAssets = await processNasdaqAssetNames();
    const otherUsAssets = await processOtherUsAssetNames();
    const cryptocurrencyAssets = await processCryptocurrencyAssetNames();

    const allAssets = [
        ...lseAssets,
        ...nasdaqAssets,
        ...otherUsAssets,
        ...cryptocurrencyAssets,
    ];

    //? Setup p-limit to allow for concurrent updates to the database to speed up the process
    const limit = pLimit(12);
    const updatePromises = [];

    //? Setup progress bar to track the progress of updating the assets in the db
    const progressBar = new SingleBar({
        format: "Updating Assets |{bar}| {percentage}% || {value}/{total} Assets || Elapsed: {duration_formatted} || ETA: {eta_formatted}",
        hideCursor: true,
        stopOnComplete: true,
        noTTYOutput: true,
    });

    progressBar.start(allAssets.length, 0);

    for (const asset of allAssets) {
        updatePromises.push(limit(() => processAsset(asset, progressBar)));
    }

    await Promise.all(updatePromises);
}

updateAssetDetails();
