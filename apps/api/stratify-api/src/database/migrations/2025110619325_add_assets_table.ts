import { sql, type Kysely } from "kysely";
import { dropTableIfExists } from "../migration-fns.js";

const renameStocksToAssets = (db: Kysely<any>) =>
    db.schema.withSchema("stratify").alterTable("stocks").renameTo("assets");

const renameAssetsToStocks = (db: Kysely<any>) =>
    db.schema.withSchema("stratify").alterTable("assets").renameTo("stocks");

const createAssetPricesTable = (db: Kysely<any>) =>
    db.schema
        .withSchema("stratify")
        .createTable("asset_prices")
        .addColumn("asset_id", "varchar", (col) =>
            col.references("assets.symbol").onDelete("cascade").notNull(),
        )
        .addColumn("price_date", "date", (col) => col.notNull())
        .addColumn("open_price", "decimal", (col) => col.notNull())
        .addColumn("high_price", "decimal", (col) => col.notNull())
        .addColumn("low_price", "decimal", (col) => col.notNull())
        .addColumn("close_price", "decimal", (col) => col.notNull())
        .addColumn("volume", "decimal", (col) => col.notNull())
        .addColumn("created_at", "timestamp", (col) =>
            col.defaultTo(sql`now()`).notNull(),
        )
        .addColumn("country_id", "integer", (col) =>
            col.references("countries.id").onDelete("cascade").notNull(),
        )
        .addPrimaryKeyConstraint("asset_prices_pkey", [
            "asset_id",
            "price_date",
        ]);

export async function up(db: Kysely<any>): Promise<void> {
    await renameStocksToAssets(db).execute();
    await createAssetPricesTable(db).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await renameAssetsToStocks(db).execute();
    await dropTableIfExists(db, "stratify", "asset_prices").execute();
}
