import { sql } from "kysely";
import db from "../database/db.js";

const dbHealthCheck = async () => {
    try {
        await sql`SELECT 1`.execute(db);
        console.log("Database connection is healthy.");
        process.exit(0);
    } catch (error) {
        console.error("Database connection failed");
        throw error;
    }
};

dbHealthCheck();
