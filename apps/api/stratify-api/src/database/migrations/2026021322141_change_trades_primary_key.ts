import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .withSchema("stratify")
        .alterTable("trades")
        .dropConstraint("trades_pkey")
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("trades")
        .addColumn("id", "serial", (col) => col.notNull())
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("trades")
        .addPrimaryKeyConstraint("trades_pkey", ["id"])
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .withSchema("stratify")
        .alterTable("trades")
        .dropConstraint("trades_pkey")
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("trades")
        .dropColumn("id")
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("trades")
        .addPrimaryKeyConstraint("trades_pkey", [
            "asset_id",
            "portfolio_id",
            "trade_date",
        ])
        .execute();
}
