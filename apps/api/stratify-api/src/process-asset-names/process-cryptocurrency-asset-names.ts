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
        const highestRankedAsset = assets
            .filter(
                (a) => a.symbol.toUpperCase() === asset.symbol.toUpperCase(),
            )
            .sort((a, b) => a.rank - b.rank);

        const assetExists = acc.find(
            (a) => a.symbol.toUpperCase() === asset.symbol.toUpperCase(),
        );

        if (assetExists) {
            return acc;
        }

        acc.push({
            symbol: asset.symbol.toUpperCase(),
            name: highestRankedAsset[0].name,
            assetType: "Cryptocurrency",
            countryId: 224, // Country ID for United States (default)
        });

        return acc;
    }, [] as Asset[]);

    return formattedAssets;
}
