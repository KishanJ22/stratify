import { Asset, readDataFile } from "./update-asset-details.js";

const filePath = "./data/otherListed.txt";

export async function processOtherUsAssetNames() {
    //? Read the contents of the CSV file and split it into lines by separating on the new line
    const content = readDataFile(filePath);
    const lines = content.split("\n").slice(1, -1);

    const assets = lines.reduce((acc, line) => {
        const columns = line.split("|");

        //? Loop through each line and split it into columns by the pipe character
        //? Clean the asset name by removing common suffixes identified in the data
        const cleanedName = columns[1]
            .replace(" Common Stock", "")
            .replace(" common stock", "")
            .replace(" Ordinary Shares", "")
            .replace(" Ordinary Share", "")
            .replace(" Class A Common Stock", "")
            .replace(" Class A Ordinary Share", "")
            .replace(" Class A Ordinary Shares", "");

        const isEtf = columns[4] === "Y";

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
