import fs from "fs";
import type { ControlledTransaction } from "kysely";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { DB } from "../types.js";
import db from "../db.js";
import logger from "../../logger.js";

const assetPricesDir = join(
    dirname(fileURLToPath(import.meta.url)),
    "../../../../",
    "stratify-data-api/src/pricing_ingestor/data/output",
);

interface Asset {
    ticker: string;
    country: string;
    assetPricesList: AssetPrice[];
}

interface AssetPrice {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

const ensureAssetExists = async (
    trx: ControlledTransaction<DB>,
    asset: Asset,
) => {
    // Check if the asset is already present in the db
    const isAssetPresent = await trx
        .selectFrom("stratify.assets as assets")
        .innerJoin(
            "stratify.countries as countries",
            "countries.id",
            "assets.countryId",
        )
        .where("assets.symbol", "=", asset.ticker)
        .where("countries.alpha2", "=", asset.country)
        .select("assets.symbol as assetSymbol")
        .executeTakeFirst();

    // If the asset is not in the database, then add it
    if (!isAssetPresent) {
        // Get the country id based on the two-letter country code in the asset data
        const { countryId } = await trx
            .selectFrom("stratify.countries as countries")
            .where("countries.alpha2", "=", asset.country)
            .select("countries.id as countryId")
            .executeTakeFirstOrThrow();

        // Insert the asset into the database
        await trx
            .insertInto("stratify.assets")
            .values({
                symbol: asset.ticker,
                name: asset.ticker,
                countryId: countryId,
                type: "STOCK",
            })
            .returning("symbol as assetId")
            .executeTakeFirstOrThrow();
    }
};

const insertAssetPrices = async (
    trx: ControlledTransaction<DB>,
    asset: Asset,
) => {
    const assetPrices = asset.assetPricesList.map((price) => ({
        assetId: asset.ticker,
        priceDate: new Date(price.date),
        openPrice: price.open,
        highPrice: price.high,
        lowPrice: price.low,
        closePrice: price.close,
        volume: price.volume,
    }));

    await trx.insertInto("stratify.assetPrices").values(assetPrices).execute();
};

const insertAssets = async () => {
    const assetFiles = fs.readdirSync(assetPricesDir);
    const startTime = Date.now();

    for (const file of assetFiles) {
        try {
            const filePath = join(assetPricesDir, file);
            const fileContent = fs.readFileSync(filePath, "utf-8");
            const asset: Asset = JSON.parse(fileContent);

            const transaction = await db.startTransaction().execute();
            try {
                await ensureAssetExists(transaction, asset);
                await insertAssetPrices(transaction, asset);

                await transaction.commit().execute();
                logger.info(
                    `Successfully processed asset ${asset.ticker} (${asset.country})`,
                );
            } catch (error) {
                logger.error(
                    `Error processing asset ${asset.ticker} (${asset.country}): ${error}`,
                );
                await transaction.rollback().execute();
            }
        } catch (error) {
            logger.error(`Error reading file ${file}: ${error}`);
        }
    }

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    logger.info(`Asset insertion completed in ${duration} seconds.`);
};

insertAssets();
