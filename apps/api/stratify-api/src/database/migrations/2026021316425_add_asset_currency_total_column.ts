import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .withSchema("stratify")
        .alterTable("trades")
        .addColumn("asset_currency_total_amount", "numeric")
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .withSchema("stratify")
        .alterTable("trades")
        .dropColumn("asset_currency_total_amount")
        .execute();
}
