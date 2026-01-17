import db from "../database/db.js";

//? Delete all data from tables used in tests
const clearDatabase = async () => {
    await db
        .deleteFrom(["stratify.portfolios", "stratify.trades", "auth.user"])
        .execute();
};

export default clearDatabase;
