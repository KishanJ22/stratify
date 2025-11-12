import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .withSchema("stratify")
        .alterTable("asset_prices")
        .dropColumn("country_id")
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .withSchema("stratify")
        .alterTable("asset_prices")
        .addColumn("country_id", "integer", (col) =>
            col.references("countries.id").onDelete("cascade").notNull(),
        )
        .execute();
}
