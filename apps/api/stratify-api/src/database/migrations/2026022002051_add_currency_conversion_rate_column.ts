import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .withSchema("stratify")
        .alterTable("trades")
        .addColumn("currency_conversion_rate", "numeric")
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .withSchema("stratify")
        .alterTable("trades")
        .dropColumn("currency_conversion_rate")
        .execute();
}
