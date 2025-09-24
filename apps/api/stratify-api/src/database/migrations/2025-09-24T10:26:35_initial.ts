import type { Kysely } from "kysely";

const createCountriesTable = (db: Kysely<any>) =>
    db.schema
        .withSchema("stratify") // specify the schema here
        .createTable("countries")
        .addColumn("id", "serial", (col) => col.primaryKey()) // Auto-incrementing primary key
        .addColumn("name", "varchar", (col) => col.notNull()) // Country name
        .addColumn("code", "varchar", (col) => col.notNull()) // Country code (e.g., "US", "GB")
        .addColumn("three_letter_code", "varchar", (col) => col.notNull()) // Country three-letter code (e.g., "USA", "GBR")
        .addColumn("currency", "varchar", (col) => col.notNull()); // Currency used in the country (e.g., "USD", "GBP")

const createStocksTable = (db: Kysely<any>) =>
    db.schema
        .withSchema("stratify") // specify the schema here
        .createTable("stocks")
        .addColumn("symbol", "varchar", (col) => col.primaryKey()) // Stock symbol as primary key
        .addColumn("name", "varchar", (col) => col.notNull()) // Stock name
        .addColumn("type", "varchar", (col) => col.notNull()) // Stock type (e.g., ETF/index fund, common stock)
        .addColumn("country_id", "integer", (col) =>
            col.references("countries.id").onDelete("cascade").notNull(),
        ); // Foreign key referencing countries table - gets the country where the stock is listed here

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.createSchema("stratify").ifNotExists().execute();
    await createCountriesTable(db).execute();
    await createStocksTable(db).execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .withSchema("stratify")
        .dropTable("stocks")
        .ifExists()
        .execute();

    await db.schema
        .withSchema("stratify")
        .dropTable("countries")
        .ifExists()
        .execute();

    await db.schema.dropSchema("stratify").ifExists().execute();
}
