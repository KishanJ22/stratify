import type { Kysely } from "kysely";

const renameCountriesColumns = async (db: Kysely<any>) => {
    await db.schema
        .withSchema("stratify")
        .alterTable("countries")
        .renameColumn("code", "alpha2")
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("countries")
        .renameColumn("three_letter_code", "alpha3")
        .execute();
};

const revertRenameCountriesColumns = async (db: Kysely<any>) => {
    await db.schema
        .withSchema("stratify")
        .alterTable("countries")
        .renameColumn("alpha2", "code")
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("countries")
        .renameColumn("alpha3", "three_letter_code")
        .execute();
};

export async function up(db: Kysely<any>): Promise<void> {
    await renameCountriesColumns(db);
}

export async function down(db: Kysely<any>): Promise<void> {
    await revertRenameCountriesColumns(db);
}
