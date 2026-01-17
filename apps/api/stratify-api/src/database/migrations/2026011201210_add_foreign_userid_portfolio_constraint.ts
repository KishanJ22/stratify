import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .withSchema("stratify")
        .alterTable("portfolios")
        .addForeignKeyConstraint(
            "portfolios_user_fkey",
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
        .alterTable("portfolios")
        .dropConstraint("portfolios_user_fkey")
        .execute();
}
