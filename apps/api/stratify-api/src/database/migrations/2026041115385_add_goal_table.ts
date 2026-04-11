import { sql, type Kysely } from "kysely";
import { dropTableIfExists } from "../migration-fns.js";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .withSchema("stratify")
        .createTable("goal")
        .addColumn("id", "serial", (col) => col.primaryKey().notNull())
        .addColumn("target_amount", "numeric", (col) => col.notNull())
        .addColumn("created_at", "timestamp", (col) =>
            col.defaultTo(sql`now()`).notNull(),
        )
        .addColumn("updated_at", "timestamp", (col) =>
            col.notNull().defaultTo(sql`now()`),
        )
        .addColumn("user_id", "varchar", (col) => col.notNull())
        .addForeignKeyConstraint(
            "goal_user_fkey",
            ["user_id"],
            "auth.user",
            ["id"],
            (cb) => cb.onDelete("cascade"),
        )
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .withSchema("stratify")
        .alterTable("goal")
        .dropConstraint("goal_user_fkey")
        .execute();
    await dropTableIfExists(db, "stratify", "goal").execute();
}
