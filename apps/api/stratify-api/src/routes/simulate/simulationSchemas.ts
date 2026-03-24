import { Static, Type } from "@sinclair/typebox";
import { createNotFound } from "../../utils/createNotFoundSchema.js";

export const notFoundSchema = createNotFound("assetNotFound");
export type NotFoundResponse = Static<typeof notFoundSchema>;

export const cannotSimulateSchema = Type.Object({
    message: Type.Literal("cannotSimulate"),
});
export type CannotSimulateResponse = Static<typeof cannotSimulateSchema>;
