import db from "../database/db.js";

//? Delete all data from tables used in tests
const clearDatabase = async () => {
    try {
        await db.deleteFrom("stratify.portfolios").execute();
        await db.deleteFrom("stratify.trades").execute();
        await db.deleteFrom("auth.user").execute();
    } catch (error) {
        console.error("Error clearing database:", error);
    }
};

export default clearDatabase;
