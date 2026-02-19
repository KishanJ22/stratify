import db from "../db.js";

const dropAssetsFromDb = async () => {
    try {
        await db.deleteFrom("stratify.assetPrices").execute();
        await db.deleteFrom("stratify.assets").execute();
        console.log("All assets have been dropped from the database.");
    } catch (error) {
        console.error("Error dropping assets from the database:", error);
    }
};

dropAssetsFromDb();
