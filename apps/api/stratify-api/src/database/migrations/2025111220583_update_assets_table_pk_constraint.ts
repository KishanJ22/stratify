import type { Kysely } from "kysely";

const addOriginalUniqueConstraint = (db: Kysely<any>) =>
    db.schema
        .withSchema("stratify")
        .alterTable("assets")
        .addUniqueConstraint("stocks_pkey", ["symbol"]);

const removeOriginalUniqueConstraint = (db: Kysely<any>) =>
    db.schema
        .withSchema("stratify")
        .alterTable("assets")
        .dropConstraint("stocks_pkey")
        .cascade();

const addCompositePrimaryKeyConstraint = (db: Kysely<any>) =>
    db.schema
        .withSchema("stratify")
        .alterTable("assets")
        .addPrimaryKeyConstraint("assets_pkey", ["symbol", "country_id"]);

const removeCompositePrimaryKeyConstraint = (db: Kysely<any>) =>
    db.schema
        .withSchema("stratify")
        .alterTable("assets")
        .dropConstraint("assets_pkey")
        .cascade();

export async function up(db: Kysely<any>): Promise<void> {
    await removeOriginalUniqueConstraint(db).execute();
    await addCompositePrimaryKeyConstraint(db).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await removeCompositePrimaryKeyConstraint(db).execute();
    await addOriginalUniqueConstraint(db).execute();
}
