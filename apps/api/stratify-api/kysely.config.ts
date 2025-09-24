import { PostgresDialect } from "kysely";
import { defineConfig } from "kysely-ctl";
import pkg from "pg";

//? This configuration is required for doing migrations with Kysely-CTL

const { Pool } = pkg;

export default defineConfig({
    // replace me with a real dialect instance OR a dialect name + `dialectConfig` prop.
    dialect: new PostgresDialect({
        pool: new Pool({
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            ssl: false,
        }),
    }),
    migrations: {
        migrationFolder: "src/database/migrations",
        migrationTableSchema: "stratify_migrations",
        migrationTableName: "db_migrations",
        getMigrationPrefix: () => {
            const date = new Date();
            const formattedDate = date.toISOString().split(".")[0];

            return `${formattedDate}_`;
        },
    },
});
