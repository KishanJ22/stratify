import type { Kysely } from "kysely";

const addOriginalPrimaryKeyConstraint = (db: Kysely<any>) =>
    db.schema
        .withSchema("stratify")
        .alterTable("asset_prices")
        .addPrimaryKeyConstraint("asset_prices_pkey", [
            "asset_id",
            "price_date",
        ]);

const dropOriginalPrimaryKeyConstraint = (db: Kysely<any>) =>
    db.schema
        .withSchema("stratify")
        .alterTable("asset_prices")
        .dropConstraint("asset_prices_pkey");

const addCompositePrimaryKeyConstraint = (db: Kysely<any>) =>
    db.schema
        .withSchema("stratify")
        .alterTable("asset_prices")
        .addPrimaryKeyConstraint("asset_prices_pkey", [
            "asset_id",
            "price_date",
            "country_id",
        ]);

const dropCompositePrimaryKeyConstraint = (db: Kysely<any>) =>
    db.schema
        .withSchema("stratify")
        .alterTable("asset_prices")
        .dropConstraint("asset_prices_pkey");

export async function up(db: Kysely<any>): Promise<void> {
    await dropOriginalPrimaryKeyConstraint(db).execute();
    await addCompositePrimaryKeyConstraint(db).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await dropCompositePrimaryKeyConstraint(db).execute();
    await addOriginalPrimaryKeyConstraint(db).execute();
}
