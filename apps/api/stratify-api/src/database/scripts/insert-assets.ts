import type { ControlledTransaction } from "kysely";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { DB } from "../types.js";
import db from "../db.js";
import logger from "../../logger.js";
import { opendir, readFile } from "fs/promises";
import { SingleBar } from "cli-progress";
import { Dirent, readdirSync } from "fs";
import pLimit from "p-limit";

const assetPricesDir = join(
    dirname(fileURLToPath(import.meta.url)),
    "../../../../",
    "stratify-data-api/src/pricing_ingestor/data/output",
);

interface Asset {
    ticker: string;
    country: string;
    type: "stock" | "cryptocurrency" | "currency";
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
    countryId: number,
) => {
    // Check if the asset is already present in the db
    const isAssetPresent = await trx
        .selectFrom("stratify.assets as assets")
        .where("assets.symbol", "=", asset.ticker)
        .where("assets.countryId", "=", countryId)
        .executeTakeFirst();

    // If the asset is not in the database, then add it
    if (!isAssetPresent) {
        // Insert the asset into the database
        await trx
            .insertInto("stratify.assets")
            .values({
                symbol: asset.ticker,
                name: asset.ticker,
                countryId,
                type: asset.type.toUpperCase(),
            })
            .returning("symbol as assetId")
            .executeTakeFirstOrThrow();
    }
};

const getCountryId = (trx: ControlledTransaction<DB>, countryCode: string) =>
    trx
        .selectFrom("stratify.countries as countries")
        .where("countries.alpha2", "=", countryCode)
        .select("countries.id as countryId")
        .executeTakeFirstOrThrow();

const insertAssetPrices = async (
    trx: ControlledTransaction<DB>,
    asset: Asset,
    countryId: number,
) => {
    const chunkSize = 8000;

    const assetPrices = asset.assetPricesList.map((price) => ({
        assetId: asset.ticker,
        priceDate: new Date(price.date),
        openPrice: price.open,
        highPrice: price.high,
        lowPrice: price.low,
        closePrice: price.close,
        volume: price.volume,
        countryId,
    }));

    for (let i = 0; i < assetPrices.length; i += chunkSize) {
        const chunk = assetPrices.slice(i, i + chunkSize);
        await trx
            .insertInto("stratify.assetPrices")
            .values(chunk)
            .onConflict((oc) =>
                oc
                    .columns(["assetId", "priceDate", "countryId"])
                    .doUpdateSet((eb) => ({
                        openPrice: eb.ref("excluded.openPrice"),
                        highPrice: eb.ref("excluded.highPrice"),
                        lowPrice: eb.ref("excluded.lowPrice"),
                        closePrice: eb.ref("excluded.closePrice"),
                        volume: eb.ref("excluded.volume"),
                    })),
            )
            .execute();
    }
};

const processAssetFile = async (
    file: Dirent<string>,
    progressBar: SingleBar,
) => {
    try {
        const filePath = join(assetPricesDir, file.name);
        const fileContent = await readFile(filePath, {
            encoding: "utf-8",
        });
        const asset: Asset = JSON.parse(fileContent);

        const transaction = await db.startTransaction().execute();
        try {
            const { countryId } = await getCountryId(
                transaction,
                asset.country,
            );

            await ensureAssetExists(transaction, asset, countryId);
            await insertAssetPrices(transaction, asset, countryId);

            await transaction.commit().execute();
            progressBar.increment();
        } catch (error) {
            logger.error(
                `Error processing asset ${asset.ticker} (${asset.country}): ${error}`,
            );
            await transaction.rollback().execute();
        }
    } catch (error) {
        logger.error(`Error reading file ${file}: ${error}`);
    }
};

const insertAssets = async () => {
    const assetFiles = await opendir(assetPricesDir);
    const limit = pLimit(12);
    const insertPromises = [];
    const progressBar = new SingleBar({
        format: "Inserting Assets |{bar}| {percentage}% || {value}/{total} Files || Elapsed: {duration_formatted} || ETA: {eta_formatted}",
        hideCursor: true,
        stopOnComplete: true,
        noTTYOutput: true,
    });

    const fileCount = Array.from(readdirSync(assetPricesDir)).length;
    progressBar.start(fileCount, 0);

    for await (const file of assetFiles) {
        insertPromises.push(limit(() => processAssetFile(file, progressBar)));
    }

    await Promise.all(insertPromises);
};

insertAssets();
