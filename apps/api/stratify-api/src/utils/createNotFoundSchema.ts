import { Type } from "@sinclair/typebox";

export const createNotFound = <T extends string>(message: T) => {
    return Type.Object({
        message: Type.Literal(message),
    });
};
