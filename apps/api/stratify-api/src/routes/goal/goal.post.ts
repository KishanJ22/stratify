import { Static, Type } from "@sinclair/typebox";
import db from "../../database/db.js";
import { FastifyInstance } from "fastify";
import logger from "../../logger.js";
import { getFromStore } from "../../plugins/localStorage.js";
import { UserDetails } from "../../utils/decodeToken.js";

const goalRequestBodySchema = Type.Object({
    targetAmount: Type.Number(),
});

type GoalRequestBody = Static<typeof goalRequestBodySchema>;

const successResponseSchema = Type.Object({
    data: Type.Object({
        success: Type.Boolean(),
    }),
});

type SuccessResponse = Static<typeof successResponseSchema>;

const insertGoalQuery = (goalDetails: GoalRequestBody, userId: string) =>
    db.insertInto("stratify.goal").values({
        targetAmount: goalDetails.targetAmount,
        userId,
    });

export default async function goalPost(fastify: FastifyInstance) {
    fastify.route<{
        Body: GoalRequestBody;
        Reply: SuccessResponse;
    }>({
        method: "POST",
        url: "/goal",
        schema: {
            body: goalRequestBodySchema,
            response: {
                201: successResponseSchema,
            },
        },
        handler: async (request, reply) => {
            const { targetAmount } = request.body;

            try {
                const { userId } = getFromStore("user") as UserDetails;

                await insertGoalQuery({ targetAmount }, userId).execute();

                reply.status(201).send({
                    data: {
                        success: true,
                    },
                });
            } catch (error) {
                logger.error({ error }, "Error creating goal");
                throw error;
            }
        },
    });
}
