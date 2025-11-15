import db from "../db.js";

const dropAssetPricesFromDb = async () => {
    try {
        await db.deleteFrom("stratify.assetPrices").execute();
        console.log("All asset prices have been dropped from the database.");
    } catch (error) {
        console.error("Error dropping asset prices from the database:", error);
    }
};

dropAssetPricesFromDb();
