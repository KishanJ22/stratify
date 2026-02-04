import { Asset, readDataFile } from "./update-asset-details.js";

const filePath = "./data/nasdaqListed.txt";

export async function processNasdaqAssetNames() {
    //? Read the contents of the CSV file and split it into lines by separating on the new line
    const content = readDataFile(filePath);
    const lines = content.split("\n").slice(1, -1);

    //? Loop through each line and split it into columns by the pipe character
    //? Clean the asset name by removing common suffixes identified in the data
    const assets = lines.reduce((acc, line) => {
        const columns = line.split("|");

        const cleanedName = columns[1]
            .replace(" - Common Stock", "")
            .replace(" - Ordinary Shares", "")
            .replace(" - Ordinary Share", "")
            .replace(" - Class A Common Stock", "")
            .replace(" - Class A Ordinary Share", "")
            .replace(" - Class A Ordinary Shares", "")
            .replace(" - Warrant", "")
            .replace(" - Units", "")
            .replace(" - Unit", "")
            .replace(" - Right", "")
            .replace(" - Rights", "");

        const isEtf = columns[6] === "Y";

        //? Format the data to match the Asset interface
        acc.push({
            symbol: columns[0],
            name: cleanedName,
            assetType: isEtf ? "ETF" : "Stock",
            countryId: 224, // Country ID for United States
        });

        return acc;
    }, [] as Asset[]);

    return assets;
}
