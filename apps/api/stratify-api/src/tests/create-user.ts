import db from "../database/db.js";

export const createUser = (userId: string) => {
    return db.insertInto("auth.user").values({ id: userId } as any);
};
