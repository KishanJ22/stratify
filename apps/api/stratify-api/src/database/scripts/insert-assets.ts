import type { ControlledTransaction } from "kysely";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { DB } from "../types.js";
import db from "../db.js";
import logger from "../../logger.js";
import { opendir, readFile } from "fs/promises";
import { SingleBar } from "cli-progress";
import { readdirSync } from "fs";
import pLimit from "p-limit";

const assetPricesDir = join(
    dirname(fileURLToPath(import.meta.url)),
    "../../../../",
    "stratify-data-api/src/pricing_ingestor/data/output",
);

interface AssetPrice {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

interface Asset {
    ticker: string;
    country: string;
    type: "stock" | "cryptocurrency" | "currency" | "etf";
    assetPricesList: AssetPrice[];
}

const insertAssetDetails = async (
    trx: ControlledTransaction<DB>,
    asset: Asset,
    countryDetails: Country,
) => {
    //? Check if the asset is already present in the db
    const isAssetPresent = await trx
        .selectFrom("stratify.assets as assets")
        .where("assets.symbol", "=", asset.ticker)
        .where("assets.countryId", "=", countryDetails.countryId)
        .where("assets.type", "=", asset.type.toUpperCase())
        .select("assets.id as id")
        .executeTakeFirst();

    // If the asset is not in the database, then insert it
    if (!isAssetPresent) {
        // Insert the asset into the database
        const assetId = await trx
            .insertInto("stratify.assets")
            .values({
                symbol: asset.ticker,
                name: asset.ticker,
                countryId: countryDetails.countryId,
                currency: countryDetails.currencyCode,
                type: asset.type.toUpperCase(),
            })
            .returning("id")
            .executeTakeFirstOrThrow();

        return assetId;
    }

    return isAssetPresent;
};

const insertAssetPrices = async (
    trx: ControlledTransaction<DB>,
    asset: Asset,
    assetId: number,
) => {
    const chunkSize = 8000;

    const assetPrices = asset.assetPricesList.map((price) => ({
        assetId,
        priceDate: new Date(price.date),
        openPrice: price.open,
        highPrice: price.high,
        lowPrice: price.low,
        closePrice: price.close,
        volume: price.volume,
    }));

    for (let i = 0; i < assetPrices.length; i += chunkSize) {
        const chunk = assetPrices.slice(i, i + chunkSize);
        await trx
            .insertInto("stratify.assetPrices")
            .values(chunk)
            .onConflict((oc) =>
                oc.columns(["assetId", "priceDate"]).doUpdateSet((eb) => ({
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

const getCountries = () => {
    try {
        return db
            .selectFrom("stratify.countries as countries")
            .innerJoin(
                "stratify.currencies as currencies",
                "currencies.code",
                "countries.currency",
            )
            .select([
                "countries.id as countryId",
                "countries.alpha2 as alpha2",
                "currencies.code as currencyCode",
            ])
            .execute();
    } catch (error) {
        logger.error(`Error fetching country IDs: ${error}`);
        throw error;
    }
};

type Country = Awaited<ReturnType<typeof getCountries>>[number];

const processAssetFile = async (
    filename: string,
    progressBar: SingleBar,
    countries: Country[],
) => {
    try {
        const filePath = join(assetPricesDir, filename);
        const fileContent = await readFile(filePath, {
            encoding: "utf-8",
        });
        const asset: Asset = JSON.parse(fileContent);

        const transaction = await db.startTransaction().execute();
        try {
            const countryDetails = countries.find(
                (country) => country.alpha2 === asset.country,
            );

            if (countryDetails) {
                const { id } = await insertAssetDetails(
                    transaction,
                    asset,
                    countryDetails,
                );
                await insertAssetPrices(transaction, asset, id);

                await transaction.commit().execute();
            }
            progressBar.increment();
        } catch (error) {
            logger.error(
                `Error processing asset ${asset.ticker} (${asset.country}): ${error}`,
            );
            await transaction.rollback().execute();
        }
    } catch (error) {
        logger.error(`Error reading file ${filename}: ${error}`);
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

    //? Fetch a list of country IDs and codes once
    const countries = await getCountries();

    const fileCount = Array.from(readdirSync(assetPricesDir)).length;
    progressBar.start(fileCount, 0);

    for await (const file of assetFiles) {
        const filename = file.name;
        insertPromises.push(
            limit(() => processAssetFile(filename, progressBar, countries)),
        );
    }

    await Promise.all(insertPromises);
};

insertAssets();
