import { beforeEach } from "vitest";
import clearDatabase from "./clear-db.js";

beforeEach(async () => {
    await clearDatabase();
});
