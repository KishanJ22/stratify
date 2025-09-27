import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import pkg from "pg";
import config from "../config.js";
import { DB } from "./types.js";

const { Pool } = pkg;

export const pool = new Pool({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name,
    keepAlive: config.database.keepAlive,
    max: config.database.maxConnections,
    ssl: false,
});

export const dialect = new PostgresDialect({
    pool,
});

const plugins = [new CamelCasePlugin({})];

const db = new Kysely<DB>({
    dialect,
    plugins,
});

export default db;
