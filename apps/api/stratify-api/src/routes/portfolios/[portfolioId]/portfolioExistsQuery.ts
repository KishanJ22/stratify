import db from "../../../database/db.js";

export const portfolioExistsForUserCheck = (
    portfolioId: number,
    userId: string,
) =>
    db
        .selectFrom("stratify.portfolios")
        .where("id", "=", portfolioId)
        .where("userId", "=", userId);
