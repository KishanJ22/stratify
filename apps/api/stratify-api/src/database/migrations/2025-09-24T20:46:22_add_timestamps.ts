import { sql, type Kysely } from "kysely";

const addTimestampsToTable = (db: Kysely<any>, tableName: string) =>
    db.schema
        .withSchema("stratify")
        .alterTable(tableName)
        .addColumn("created_at", "timestamp", (col) =>
            col.defaultTo(sql`now()`).notNull(),
        )
        .addColumn("updated_at", "timestamp", (col) =>
            col.defaultTo(sql`now()`).notNull(),
        );

const removeTimestampsFromTable = (db: Kysely<any>, tableName: string) =>
    db.schema
        .withSchema("stratify")
        .alterTable(tableName)
        .dropColumn("created_at")
        .dropColumn("updated_at");

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await addTimestampsToTable(db, "countries").execute();
    await addTimestampsToTable(db, "stocks").execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await removeTimestampsFromTable(db, "stocks").execute();
    await removeTimestampsFromTable(db, "countries").execute();
}
