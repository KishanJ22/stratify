import type { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema
        .withSchema("stratify")
        .alterTable("trades")
        .dropConstraint("trades_asset_fkey")
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("trades")
        .dropColumn("asset_country_id")
        .dropColumn("asset_id")
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("asset_prices")
        .dropColumn("asset_id")
        .dropColumn("country_id")
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("assets")
        .dropConstraint("assets_pkey")
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("assets")
        .addColumn("id", "serial", (col) => col.notNull())
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("assets")
        .addPrimaryKeyConstraint("assets_pkey", ["id"])
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("trades")
        .addColumn("asset_id", "serial")
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("trades")
        .addForeignKeyConstraint(
            "trades_asset_fkey",
            ["asset_id"],
            "assets",
            ["id"],
            (fk) => fk.onDelete("cascade"),
        )
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("asset_prices")
        .addColumn("asset_id", "serial")
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("asset_prices")
        .addPrimaryKeyConstraint("asset_prices_pkey", [
            "asset_id",
            "price_date",
        ])
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("asset_prices")
        .addForeignKeyConstraint(
            "asset_prices_asset_fkey",
            ["asset_id"],
            "assets",
            ["id"],
            (fk) => fk.onDelete("cascade"),
        )
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .withSchema("stratify")
        .alterTable("asset_prices")
        .dropConstraint("asset_prices_asset_fkey")
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("asset_prices")
        .dropColumn("asset_id")
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("trades")
        .dropConstraint("trades_asset_fkey")
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("trades")
        .dropColumn("asset_id")
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("assets")
        .dropConstraint("assets_pkey")
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("assets")
        .dropColumn("id")
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("assets")
        .addPrimaryKeyConstraint("assets_pkey", ["symbol", "country_id"])
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("asset_prices")
        .addColumn("country_id", "integer", (col) => col.notNull())
        .addColumn("asset_id", "varchar", (col) => col.notNull())
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("asset_prices")
        .addForeignKeyConstraint(
            "asset_prices_asset_fkey",
            ["asset_id", "country_id"],
            "assets",
            ["symbol", "country_id"],
            (fk) => fk.onDelete("cascade"),
        )
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("trades")
        .addColumn("asset_country_id", "integer")
        .addColumn("asset_id", "varchar")
        .execute();

    await db.schema
        .withSchema("stratify")
        .alterTable("trades")
        .addForeignKeyConstraint(
            "trades_asset_fkey",
            ["asset_id", "country_id"],
            "assets",
            ["symbol", "country_id"],
            (fk) => fk.onDelete("cascade"),
        )
        .execute();
}
