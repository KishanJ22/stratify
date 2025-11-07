import { Kysely } from "kysely";

export const dropTableIfExists = (
    db: Kysely<any>,
    schema: string,
    table: string,
) => db.schema.withSchema(schema).dropTable(table).ifExists();
