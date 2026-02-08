import { Asset, readDataFile } from "./update-asset-details.js";

const filePath = "./data/coinMarketCapListed.json";

interface CryptoAssetDetails {
    id: string;
    symbol: string;
    name: string;
    rank: number;
}

export async function processCryptocurrencyAssetNames() {
    const content = readDataFile(filePath);

    const assets: CryptoAssetDetails[] = JSON.parse(content);

    const formattedAssets = assets.reduce((acc, asset) => {
        //? Crypto assets can have many entries with the same symbol - choose the one with the lowest rank number
        const highestRankedAsset = assets
            .filter(
                (a) => a.symbol.toUpperCase() === asset.symbol.toUpperCase(),
            )
            .sort((a, b) => a.rank - b.rank)[0];

        const assetExists = acc.find(
            (a) => a.symbol.toUpperCase() === asset.symbol.toUpperCase(),
        );

        //? Exclude crypto assets that are stock derivatives (e.g. NVDA has a digital asset with the name NVIDIA (Derivatives))
        const isStockDerivative = highestRankedAsset.name
            .toLowerCase()
            .includes("derivatives");

        //? Skip assets that are already in the list or are stock derivatives
        if (assetExists || isStockDerivative) {
            return acc;
        }

        acc.push({
            symbol: asset.symbol.toUpperCase(),
            name: highestRankedAsset.name,
            assetType: "Cryptocurrency",
            countryId: 224, // Country ID for United States (default)
        });

        return acc;
    }, [] as Asset[]);

    return formattedAssets;
}
