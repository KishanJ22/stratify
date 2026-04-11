import { Static, Type } from "@sinclair/typebox";
import { createNotFound } from "../../utils/createNotFoundSchema.js";
import { FastifyInstance } from "fastify";
import db from "../../database/db.js";
import logger from "../../logger.js";
import { getFromStore } from "../../plugins/localStorage.js";
import { UserDetails } from "../../utils/decodeToken.js";

const goalSchema = Type.Object({
    targetAmount: Type.Number(),
});

const successResponseSchema = Type.Object({
    data: goalSchema,
});

type SuccessResponse = Static<typeof successResponseSchema>;

const goalNotFoundSchema = createNotFound("goalNotFound");
type GoalNotFound = Static<typeof goalNotFoundSchema>;

const latestGoalQuery = (userId: string) =>
    db
        .selectFrom("stratify.goal")
        .where("userId", "=", userId)
        .orderBy("createdAt", "desc")
        .select(["targetAmount"])
        .limit(1);

export default async function goalGet(fastify: FastifyInstance) {
    fastify.route<{
        Reply: SuccessResponse | GoalNotFound;
    }>({
        method: "GET",
        url: "/goal",
        schema: {
            response: {
                200: successResponseSchema,
                404: goalNotFoundSchema,
            },
        },
        handler: async (request, reply) => {
            try {
                const { userId } = getFromStore("user") as UserDetails;
                const goal = await latestGoalQuery(userId).executeTakeFirst();

                if (!goal) {
                    return reply.status(404).send({ message: "goalNotFound" });
                }

                return reply.status(200).send({
                    data: {
                        targetAmount: parseFloat(goal.targetAmount),
                    },
                });
            } catch (error) {
                logger.error({ error }, "Error fetching goal");
                throw error;
            }
        },
    });
}
