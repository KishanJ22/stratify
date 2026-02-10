import { readFile, set_fs, utils } from "xlsx";
import { dirname, join } from "path";
import { Asset } from "./update-asset-details.js";
import * as fs from "fs";

const __dirname = dirname(new URL(import.meta.url).pathname);

const filePath = "./data/lseListed.xlsx";

//? Define structure of each row with the column names used in the spreadsheet
interface AssetRow {
    symbol: string;
    issuerName: string;
    assetName: string;
    ISIN: string;
    MiFIRIdentifierCode: string;
    MiFIRIdentifierName: string;
    ICBIndustry: string;
    ICBSuperSector: string;
    startDate: string;
    incorporationCountry: string;
    currency: string;
    LSEMarket: string;
    FCAListingCategory: string;
    marketSegmentCode: string;
    marketSectorCode: string;
}

//? Required for filtering out assets that are not stocks or ETFs in the spreadsheet
const validAssetIdentifierCodes = ["ETFS", "SHRS"];

export async function processLseAssetNames() {
    const fileName = join(__dirname, filePath);
    set_fs(fs); //? Required for accessing the Excel spreadsheet stored locally

    const workBook = readFile(fileName, { dense: true });

    //? Load the first sheet in the spreadsheet which contains all LSE-listed assets
    const allAssetsSheet = workBook.Sheets[workBook.SheetNames[0]];

    //? Use utility to convert the sheet to JSON format with the specified headers for each column
    // View https://docs.sheetjs.com/docs/api/utilities/array#array-of-objects-input
    const sheetToJson = utils
        .sheet_to_json<AssetRow>(allAssetsSheet, {
            header: [
                "symbol",
                "issuerName",
                "assetName",
                "ISIN",
                "MiFIRIdentifierCode",
                "MiFIRIdentifierName",
                "ICBIndustry",
                "ICBSuperSector",
                "startDate",
                "incorporationCountry",
                "currency",
                "LSEMarket",
                "FCAListingCategory",
                "marketSegmentCode",
                "marketSectorCode",
            ],
        })
        .filter((row) =>
            validAssetIdentifierCodes.includes(row.MiFIRIdentifierCode),
        );

    //? Map through JSON data and format it to match the Asset interface and set asset type based on the MiFIRIdentifierCode value
    const formattedAssets = sheetToJson.map((row) => {
        const isEtf = row.MiFIRIdentifierCode === "ETFS";

        //? Convert GBX to GBP for consistency
        const currency = row.currency === "GBX" ? "GBP" : row.currency;

        const isOrdinaryShare = row.assetName.startsWith("ORD");

        const asset = {
            symbol: row.symbol,
            //? If the asset name starts with "ORD" then the issuer name should be used
            name: isOrdinaryShare ? row.issuerName : row.assetName,
            assetType: isEtf ? "ETF" : "Stock",
            countryId: 223, // Country ID for United Kingdom
            currency,
        } satisfies Asset;

        return asset;
    });

    return formattedAssets;
}
