import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .withSchema("stratify")
        .alterTable("assets")
        .addColumn("currency", "varchar")
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("assets")
        .addForeignKeyConstraint(
            "assets_currency_fkey",
            ["currency"],
            "stratify.currencies",
            ["code"],
            (cb) => cb.onDelete("set null"),
        )
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .withSchema("stratify")
        .alterTable("assets")
        .dropConstraint("assets_currency_fkey")
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("assets")
        .dropColumn("currency")
        .execute();
}
