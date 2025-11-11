import fs from "fs";
import { Kysely } from "kysely";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { DB } from "../types.js";

const assetPricesDir = join(
    dirname(fileURLToPath(import.meta.url)),
    "../../../../",
    "stratify-data-api/src/pricing_ingestor/data/output",
);

interface Asset {
    ticker: string;
    country: string;
    assetPriceList: AssetPrice[];
}

interface AssetPrice {
    ticker: string;
    country: string;
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

const insertAssetIntoDb = (db: Kysely<DB>) => (asset: Asset) => {
    const 
};

const insertAssetPrices = () => {
    const assetPriceFiles = fs.readdirSync(assetPricesDir);

    assetPriceFiles.forEach((file) => {
        const filePath = join(assetPricesDir, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const assetPricesJson: Asset = JSON.parse(fileContent);
        console.log(
            `Inserting prices for ${assetPricesJson.ticker} (${assetPricesJson.country})...`,
        );
    });

    console.log("File count:", assetPriceFiles.length);
};

insertAssetPrices();
