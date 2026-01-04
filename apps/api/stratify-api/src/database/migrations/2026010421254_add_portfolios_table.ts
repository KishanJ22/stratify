import { sql, type Kysely } from "kysely";
import { dropTableIfExists } from "../migration-fns.js";

const createPortfoliosTable = (db: Kysely<any>) =>
    db.schema
        .withSchema("stratify")
        .createTable("portfolios")
        .addColumn("id", "varchar", (col) => col.primaryKey().notNull())
        .addColumn("name", "text", (col) => col.notNull())
        .addColumn("description", "text")
        .addColumn("created_at", "timestamp", (col) =>
            col
                .notNull()
                .defaultTo(sql`now()`)
                .notNull(),
        )
        .addColumn("updated_at", "timestamp", (col) =>
            col
                .notNull()
                .defaultTo(sql`now()`)
                .notNull(),
        )
        .addColumn("user_id", "varchar", (col) => col.notNull())
        .addForeignKeyConstraint(
            "portfolios_user_fkey",
            ["user_id"],
            "public.user",
            ["id"],
        );

export async function up(db: Kysely<any>): Promise<void> {
    await createPortfoliosTable(db).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await dropTableIfExists(db, "stratify", "portfolios").execute();
}
