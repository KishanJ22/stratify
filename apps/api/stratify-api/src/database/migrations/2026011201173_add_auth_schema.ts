import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.createSchema("auth").ifNotExists().execute();

    // Create user table with minimal columns for testing
    if (process.env.ENVIRONMENT === "test") {
        await db.schema
            .withSchema("auth")
            .createTable("user")
            .ifNotExists()
            .addColumn("id", "text", (col) => col.primaryKey())
            .execute();
    }
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropSchema("auth").cascade().execute();
}
