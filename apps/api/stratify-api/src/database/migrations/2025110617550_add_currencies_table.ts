import type { Kysely } from "kysely";
import { dropTableIfExists } from "../migration-fns.js";

const createCurrenciesTable = (db: Kysely<any>) =>
    db.schema
        .withSchema("stratify")
        .createTable("currencies")
        .addColumn("code", "varchar", (col) => col.primaryKey().notNull())
        .addColumn("name", "varchar", (col) => col.notNull());

const addForeignKeyToCountries = (db: Kysely<any>) =>
    db.schema
        .withSchema("stratify")
        .alterTable("countries")
        .addForeignKeyConstraint(
            "countries_currency_fkey",
            ["currency"],
            "currencies",
            ["code"],
        );

const removeForeignKeyFromCountries = (db: Kysely<any>) =>
    db.schema
        .withSchema("stratify")
        .alterTable("countries")
        .dropConstraint("countries_currency_fkey");

export async function up(db: Kysely<any>): Promise<void> {
    await createCurrenciesTable(db).execute();
    await addForeignKeyToCountries(db).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await removeForeignKeyFromCountries(db).execute();
    await dropTableIfExists(db, "stratify", "currencies").execute();
}
