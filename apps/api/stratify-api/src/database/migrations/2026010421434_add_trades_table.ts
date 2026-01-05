import { sql, type Kysely } from "kysely";
import { dropTableIfExists } from "../migration-fns.js";

const createTradesTable = (db: Kysely<any>) =>
    db.schema
        .withSchema("stratify")
        .createTable("trades")
        .addColumn("asset_id", "varchar", (col) => col.notNull())
        .addColumn("asset_country_id", "integer", (col) => col.notNull())
        .addColumn("portfolio_id", "varchar", (col) => col.notNull())
        .addColumn("trade_date", "timestamp", (col) => col.notNull())
        .addColumn("trade_action", "text", (col) => col.notNull())
        .addColumn("quantity", "numeric", (col) => col.notNull())
        .addColumn("price_per_share", "numeric", (col) => col.notNull())
        .addColumn("total_amount", "numeric", (col) => col.notNull())
        .addColumn("fee", "numeric")
        .addColumn("created_at", "timestamp", (col) =>
            col
                .notNull()
                .defaultTo(sql`now()`)
                .notNull(),
        )
        .addColumn("updated_at", "timestamp", (col) =>
            col
                .notNull()
                .defaultTo(sql`now()`)
                .notNull(),
        )
        .addForeignKeyConstraint(
            "trades_asset_fkey",
            ["asset_id", "asset_country_id"],
            "stratify.assets",
            ["symbol", "country_id"],
            (cb) => cb.onDelete("cascade"),
        )
        .addForeignKeyConstraint(
            "trades_portfolio_fkey",
            ["portfolio_id"],
            "stratify.portfolios",
            ["id"],
            (cb) => cb.onDelete("cascade"),
        )
        .addPrimaryKeyConstraint("trades_pkey", [
            "asset_id",
            "portfolio_id",
            "trade_date",
        ]);

export async function up(db: Kysely<any>): Promise<void> {
    await createTradesTable(db).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await dropTableIfExists(db, "stratify", "trades").execute();
}
