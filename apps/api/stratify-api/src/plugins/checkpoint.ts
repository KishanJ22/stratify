import { requestContext } from "@fastify/request-context";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { performance } from "node:perf_hooks";
import logger from "../logger.js";

interface CheckpointEntry {
    label: string;
    time: number;
}

declare module "@fastify/request-context" {
    interface RequestContextData {
        checkpoints: CheckpointEntry[];
    }
}

declare module "fastify" {
    interface FastifyInstance {
        checkpoint: (label: string) => void;
    }
}

export const checkpoint = (label: string) => {
    const checkpoints = requestContext.get("checkpoints");
    if (checkpoints) {
        checkpoints.push({ label, time: performance.now() });
    }
};

async function checkpointPlugin(fastify: FastifyInstance) {
    fastify.addHook("onRequest", async (request) => {
        request.requestContext.set("checkpoints", [
            { label: "start", time: performance.now() },
        ]);
    });

    fastify.decorate("checkpoint", checkpoint);

    fastify.addHook("onResponse", async (request) => {
        const checkpoints = request.requestContext.get("checkpoints");
        if (!checkpoints || checkpoints.length <= 1) return;

        const start = checkpoints[0].time;

        const entries = checkpoints.slice(1).map((cp, i) => ({
            label: cp.label,
            elapsedMs: Math.round(cp.time - start),
            deltaMs: Math.round(cp.time - checkpoints[i].time),
        }));

        logger.info(
            {
                method: request.method,
                url: request.originalUrl,
                checkpoints: entries,
            },
            "Checkpoint timings",
        );
    });
}

export default fp(checkpointPlugin, { name: "checkpoint" });
